import { redis } from "@/lib/redis";

export class DuplicateRequestError extends Error {
  constructor() {
    super("This request has already been processed or is still in progress");
    this.name = "DuplicateRequestError";
  }
}

export class IdempotencyUnavailableError extends Error {
  constructor() {
    super("Unable to verify request idempotency right now, please retry");
    this.name = "IdempotencyUnavailableError";
  }
}

const TTL_SECONDS = 60 * 10;
const IN_PROGRESS = "__IN_PROGRESS__";

/**
 * Wraps a handler with idempotency-key protection for checkout/payment
 * endpoints. Unlike caching/rate-limiting, this guard exists specifically to
 * prevent duplicate orders/charges, so it fails closed: if Redis can't be
 * reached, the request is rejected rather than silently allowed through.
 */
export async function withIdempotency<T>(
  key: string | null,
  handler: () => Promise<T>
): Promise<T> {
  if (!key) return handler();

  const redisKey = `de-perfume-shop:idempotency:${key}`;

  let existing: string | null;
  try {
    existing = await redis.get(redisKey);
  } catch (err) {
    console.error("[idempotency] redis unavailable on read", err);
    throw new IdempotencyUnavailableError();
  }

  if (existing === IN_PROGRESS) {
    throw new DuplicateRequestError();
  }
  if (existing !== null) {
    return JSON.parse(existing) as T;
  }

  let reserved: "OK" | null;
  try {
    reserved = await redis.set(redisKey, IN_PROGRESS, "EX", TTL_SECONDS, "NX");
  } catch (err) {
    console.error("[idempotency] redis unavailable on reserve", err);
    throw new IdempotencyUnavailableError();
  }

  if (reserved !== "OK") {
    throw new DuplicateRequestError();
  }

  try {
    const result = await handler();
    await redis.set(redisKey, JSON.stringify(result), "EX", TTL_SECONDS);
    return result;
  } catch (err) {
    await redis.del(redisKey).catch(() => {});
    throw err;
  }
}
