import { redis, withRedisFallback } from "@/lib/redis";

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;

  const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
    a.localeCompare(b)
  );
  return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${stableStringify(v)}`).join(",")}}`;
}

const PREFIX = "de-perfume-shop:cache";

/**
 * Key for an entry invalidated individually with invalidateKey() — e.g. one
 * product's detail. For entries invalidated as a group, use
 * namespacedCacheKey() instead.
 */
export function cacheKey(namespace: string, params: unknown): string {
  return `${PREFIX}:${namespace}:${stableStringify(params)}`;
}

// No TTL on purpose: with Redis on volatile-lru, keys without a TTL are never
// evicted, so a version counter can't silently reset and resurrect stale entries.
function versionKey(namespace: string): string {
  return `${PREFIX}:${namespace}:ver`;
}

/**
 * Key for an entry in a namespace that's invalidated as a whole (list and
 * search results). Embeds the namespace's current version, so
 * invalidateNamespace() is a single INCR: every existing entry is orphaned
 * at once and simply expires on its TTL. Costs one extra GET per read.
 */
export async function namespacedCacheKey(namespace: string, params: unknown): Promise<string> {
  const version = await withRedisFallback(
    () => redis.get(versionKey(namespace)),
    () => null
  );
  return `${PREFIX}:${namespace}:v${version ?? 0}:${stableStringify(params)}`;
}

// Reads already in progress in this process, keyed by cache key.
const inFlight = new Map<string, Promise<unknown>>();

/**
 * Cache-aside wrapper: check Redis, on miss run `fetcher` and populate the
 * cache. Fails open — a Redis outage falls straight through to `fetcher`
 * (the real Postgres query) rather than breaking the read.
 *
 * Concurrent calls for the same key in this process share one read, so a
 * burst of traffic on a cold key runs the Postgres query once, not once per
 * request. Callers must treat the result as read-only, since it may be shared.
 */
export function cached<T>(key: string, ttlSeconds: number, fetcher: () => Promise<T>): Promise<T> {
  const pending = inFlight.get(key);
  if (pending) return pending as Promise<T>;

  const read = readThrough(key, ttlSeconds, fetcher).finally(() => inFlight.delete(key));
  inFlight.set(key, read);
  return read;
}

async function readThrough<T>(
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

/**
 * Invalidates every entry built with namespacedCacheKey(namespace, …) by
 * bumping the namespace version — one INCR instead of a keyspace SCAN.
 */
export async function invalidateNamespace(namespace: string): Promise<void> {
  await withRedisFallback(
    () => redis.incr(versionKey(namespace)),
    () => 0
  );
}

export async function invalidateKey(key: string): Promise<void> {
  await withRedisFallback(
    () => redis.del(key),
    () => 0
  );
}
