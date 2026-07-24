import "dotenv/config";
import { consumeQueue, publishEvent, QUEUES } from "@/lib/rabbitmq";
import { updateOrderStatus } from "@/domain/order";
import type { OrderConfirmedEvent, StockLowEvent } from "@/domain/order/order.events";

async function handleOrderConfirmed(payload: unknown): Promise<void> {
  const event = payload as OrderConfirmedEvent;
  console.log(`[worker] order confirmed: ${event.orderNumber}`);

  await updateOrderStatus(event.orderId, { status: "CONFIRMED" });

  await Promise.all([
    publishEvent("email.customer", event),
    publishEvent("notification.admin", event),
    publishEvent("invoice.generate", event),
  ]);
}

async function handleEmailCustomer(payload: unknown): Promise<void> {
  const event = payload as OrderConfirmedEvent;
  // Stub: no email provider is wired up yet — this is where one (e.g. Resend) plugs in.
  console.log(`[worker] would send confirmation email to ${event.email} for order ${event.orderNumber}`);
}

async function handleNotificationAdmin(payload: unknown): Promise<void> {
  const event = payload as OrderConfirmedEvent;
  console.log(`[worker] admin notification: new order ${event.orderNumber} totalling ${event.total}`);
}

async function handleInvoiceGenerate(payload: unknown): Promise<void> {
  const event = payload as OrderConfirmedEvent;
  console.log(`[worker] would generate invoice for order ${event.orderNumber}`);
}

async function handleStockLow(payload: unknown): Promise<void> {
  const event = payload as StockLowEvent;
  console.log(`[worker] low stock: ${event.productName} (${event.stockQuantity} left)`);
}

async function handlePaymentEvents(payload: unknown): Promise<void> {
  // Stub: no Pesapal webhook/IPN integration exists yet — this is where it plugs in once built.
  console.log("[worker] payment event received", payload);
}

async function main(): Promise<void> {
  await consumeQueue("order.confirmed", handleOrderConfirmed);
  await consumeQueue("email.customer", handleEmailCustomer);
  await consumeQueue("notification.admin", handleNotificationAdmin);
  await consumeQueue("invoice.generate", handleInvoiceGenerate);
  await consumeQueue("stock.low", handleStockLow);
  await consumeQueue("payment.events", handlePaymentEvents);

  console.log(`[worker] listening on queues: ${QUEUES.join(", ")}`);
}

main().catch((err) => {
  console.error("[worker] fatal error", err);
  process.exit(1);
});
