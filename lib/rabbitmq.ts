import amqp, { type ChannelModel, type Channel, type ConsumeMessage } from "amqplib";
import { getEnv } from "@/lib/env";

export const EXCHANGE = "perf-shop.events";

export const QUEUES = [
  "order.confirmed",
  "email.customer",
  "notification.admin",
  "invoice.generate",
  "stock.low",
  "payment.events",
] as const;

export type QueueName = (typeof QUEUES)[number];

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 30_000;
const RETRY_COUNT_HEADER = "x-retry-count";

function retryQueueOf(name: QueueName): string {
  return `${name}.retry`;
}

function dlqOf(name: QueueName): string {
  return `${name}.dlq`;
}

async function assertTopology(channel: Channel): Promise<void> {
  await channel.assertExchange(EXCHANGE, "topic", { durable: true });

  for (const name of QUEUES) {
    await channel.assertQueue(name, { durable: true });
    await channel.bindQueue(name, EXCHANGE, name);

    await channel.assertQueue(dlqOf(name), { durable: true });

    await channel.assertQueue(retryQueueOf(name), {
      durable: true,
      arguments: {
        "x-message-ttl": RETRY_DELAY_MS,
        "x-dead-letter-exchange": "",
        "x-dead-letter-routing-key": name,
      },
    });
  }
}

type State = {
  connection?: ChannelModel;
  channel?: Channel;
  connecting?: Promise<Channel>;
};

const globalForRabbitMq = globalThis as unknown as { rabbitmq?: State };
const state: State = globalForRabbitMq.rabbitmq ?? {};

if (process.env.NODE_ENV !== "production") {
  globalForRabbitMq.rabbitmq = state;
}

async function connect(): Promise<Channel> {
  if (state.channel) return state.channel;
  if (state.connecting) return state.connecting;

  state.connecting = (async () => {
    const connection = await amqp.connect(getEnv().RABBITMQ_URL);
    const channel = await connection.createChannel();
    await assertTopology(channel);

    connection.on("error", (err) => console.error("[rabbitmq] connection error", err));
    connection.on("close", () => {
      console.error("[rabbitmq] connection closed");
      state.connection = undefined;
      state.channel = undefined;
    });

    state.connection = connection;
    state.channel = channel;
    return channel;
  })();

  try {
    return await state.connecting;
  } finally {
    state.connecting = undefined;
  }
}

/**
 * Publishes a job onto its queue. Logged and swallowed on failure rather
 * than thrown — a missed publish after a successful DB write should not
 * fail the customer-facing request; it means a missed downstream job
 * (email/invoice/notification), which is the one gap worth a follow-up
 * reconciliation job (see plan notes), not a reason to break checkout.
 */
export async function publishEvent(queueName: QueueName, payload: unknown): Promise<void> {
  try {
    const channel = await connect();
    channel.publish(EXCHANGE, queueName, Buffer.from(JSON.stringify(payload)), {
      persistent: true,
      contentType: "application/json",
    });
  } catch (err) {
    console.error(`[rabbitmq] failed to publish to ${queueName}`, err);
  }
}

/**
 * Consumes a queue with delayed-retry semantics: on handler failure, the
 * message is re-queued via `<queue>.retry` (which dead-letters back to the
 * original queue after a TTL) up to MAX_RETRIES times, after which it's
 * routed to `<queue>.dlq` for manual inspection.
 */
export async function consumeQueue(
  queueName: QueueName,
  handler: (payload: unknown, message: ConsumeMessage) => Promise<void>
): Promise<void> {
  const channel = await connect();
  await channel.prefetch(10);

  await channel.consume(queueName, (message) => {
    if (!message) return;

    void (async () => {
      try {
        const payload = JSON.parse(message.content.toString());
        await handler(payload, message);
        channel.ack(message);
      } catch (err) {
        console.error(`[rabbitmq] handler failed for ${queueName}`, err);

        const retryCount = Number(message.properties.headers?.[RETRY_COUNT_HEADER] ?? 0) + 1;
        const target = retryCount <= MAX_RETRIES ? retryQueueOf(queueName) : dlqOf(queueName);

        channel.sendToQueue(target, message.content, {
          persistent: true,
          contentType: "application/json",
          headers: { ...message.properties.headers, [RETRY_COUNT_HEADER]: retryCount },
        });
        channel.ack(message);
      }
    })();
  });
}
