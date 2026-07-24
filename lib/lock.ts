import { randomUUID } from "crypto";
import { redis, withRedisFallback } from "@/lib/redis";

const LOCK_TTL_MS = 5000;

const RELEASE_SCRIPT = `
if redis.call("get", KEYS[1]) == ARGV[1] then
  return redis.call("del", KEYS[1])
else
  return 0
end
`;

/**
 * Best-effort distributed lock for a single product. Reduces wasted DB
 * transaction contention under concurrent checkout bursts; the Prisma
 * transaction (with its own conflict retry) remains the actual correctness
 * guarantee, so if Redis is unavailable we skip locking and proceed —
 * checkout should not fail just because the lock is unavailable.
 */
async function withInventoryLock<T>(productId: string, fn: () => Promise<T>): Promise<T> {
  const key = `de-perfume-shop:lock:product:${productId}`;
  const token = randomUUID();

  const acquired = await withRedisFallback(
    async () => (await redis.set(key, token, "PX", LOCK_TTL_MS, "NX")) === "OK",
    () => false
  );

  try {
    return await fn();
  } finally {
    if (acquired) {
      await withRedisFallback(
        () => redis.eval(RELEASE_SCRIPT, 1, key, token),
        () => 0
      );
    }
  }
}

/** Acquires per-product locks in sorted order so concurrent multi-item orders can't deadlock. */
export async function withInventoryLocks<T>(
  productIds: string[],
  fn: () => Promise<T>
): Promise<T> {
  const sorted = Array.from(new Set(productIds)).sort();

  function acquireNext(index: number): Promise<T> {
    if (index >= sorted.length) return fn();
    return withInventoryLock(sorted[index], () => acquireNext(index + 1));
  }

  return acquireNext(0);
}
