import { redis, withRedisFallback } from "@/lib/redis";

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;

  const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
    a.localeCompare(b)
  );
  return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${stableStringify(v)}`).join(",")}}`;
}

export function cacheKey(namespace: string, params: unknown): string {
  return `de-perfume-shop:cache:${namespace}:${stableStringify(params)}`;
}

/**
 * Cache-aside wrapper: check Redis, on miss run `fetcher` and populate the
 * cache. Fails open — a Redis outage falls straight through to `fetcher`
 * (the real Postgres query) rather than breaking the read.
 */
export async function cached<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const hit = await withRedisFallback(
    () => redis.get(key),
    () => null
  );

  if (hit !== null) {
    return JSON.parse(hit) as T;
  }

  const value = await fetcher();

  await withRedisFallback(
    () => redis.set(key, JSON.stringify(value), "EX", ttlSeconds),
    () => "OK" as const
  );

  return value;
}

/** Invalidates every cached entry under a namespace prefix (called from writes). */
export async function invalidateNamespace(namespace: string): Promise<void> {
  await withRedisFallback(
    async () => {
      const pattern = `de-perfume-shop:cache:${namespace}:*`;
      const keysToDelete: string[] = [];

      for await (const keys of redis.scanStream({ match: pattern, count: 100 })) {
        keysToDelete.push(...(keys as string[]));
      }

      if (keysToDelete.length > 0) {
        await redis.del(...keysToDelete);
      }
    },
    () => undefined
  );
}

export async function invalidateKey(key: string): Promise<void> {
  await withRedisFallback(
    () => redis.del(key),
    () => 0
  );
}
