import { beforeEach, describe, expect, it, vi } from "vitest";

const store = new Map<string, string>();

vi.mock("@/lib/redis", () => ({
  redis: {
    get: vi.fn(async (key: string) => store.get(key) ?? null),
    set: vi.fn(async (key: string, value: string) => {
      store.set(key, value);
      return "OK";
    }),
    incr: vi.fn(async (key: string) => {
      const next = Number(store.get(key) ?? 0) + 1;
      store.set(key, String(next));
      return next;
    }),
    del: vi.fn(async (key: string) => Number(store.delete(key))),
  },
  withRedisFallback: async <T>(operation: () => Promise<T>, onUnavailable: () => T) => {
    try {
      return await operation();
    } catch {
      return onUnavailable();
    }
  },
}));

import { cached, invalidateNamespace, namespacedCacheKey } from "./cache";

describe("namespacedCacheKey / invalidateNamespace", () => {
  beforeEach(() => store.clear());

  it("starts at version 0 and moves to a new key space after invalidation", async () => {
    const before = await namespacedCacheKey("product:list", { page: 1 });
    expect(before).toBe('de-perfume-shop:cache:product:list:v0:{"page":1}');

    await invalidateNamespace("product:list");

    const after = await namespacedCacheKey("product:list", { page: 1 });
    expect(after).toBe('de-perfume-shop:cache:product:list:v1:{"page":1}');
  });

  it("only bumps the namespace that was invalidated", async () => {
    await invalidateNamespace("product:list");

    expect(await namespacedCacheKey("brand:list", {})).toContain(":brand:list:v0:");
  });
});

describe("cached", () => {
  beforeEach(() => store.clear());

  it("serves a hit from Redis without calling the fetcher", async () => {
    store.set("k", JSON.stringify({ n: 1 }));
    const fetcher = vi.fn(async () => ({ n: 2 }));

    await expect(cached("k", 60, fetcher)).resolves.toEqual({ n: 1 });
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("runs the fetcher once for concurrent misses on the same key", async () => {
    let release!: () => void;
    const gate = new Promise<void>((resolve) => (release = resolve));
    const fetcher = vi.fn(async () => {
      await gate;
      return { n: 3 };
    });

    const reads = [1, 2, 3].map(() => cached("cold", 60, fetcher));
    release();

    await expect(Promise.all(reads)).resolves.toEqual([{ n: 3 }, { n: 3 }, { n: 3 }]);
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(JSON.parse(store.get("cold")!)).toEqual({ n: 3 });
  });

  it("fetches again once the previous read has finished", async () => {
    const fetcher = vi.fn(async () => ({ n: 4 }));

    await cached("once", 60, fetcher);
    store.delete("once");
    await cached("once", 60, fetcher);

    expect(fetcher).toHaveBeenCalledTimes(2);
  });
});
