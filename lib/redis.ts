import { Redis } from "ioredis";
import { getEnv } from "@/lib/env";

const globalForRedis = globalThis as unknown as { redis?: Redis };

function createClient(): Redis {
  const client = new Redis(getEnv().REDIS_URL, {
    maxRetriesPerRequest: 2,
    retryStrategy: (attempt) => Math.min(attempt * 200, 2000),
    lazyConnect: false,
  });

  client.on("error", (err) => {
    console.error("[redis] connection error", err);
  });

  return client;
}

export const redis = globalForRedis.redis ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}

/**
 * Runs a Redis-backed operation and falls back to `onUnavailable` if Redis
 * is down or the operation throws, instead of letting a cache/rate-limit
 * outage take down an otherwise-healthy request.
 */
export async function withRedisFallback<T>(operation: () => Promise<T>, onUnavailable: () => T | Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (err) {
    console.error("[redis] operation failed, falling back", err);
    return onUnavailable();
  }
}
