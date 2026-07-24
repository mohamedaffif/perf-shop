import { redis, withRedisFallback } from "@/lib/redis";

export class RateLimitExceededError extends Error {
  constructor(public readonly retryAfterSeconds: number) {
    super("Too many requests, please try again later");
    this.name = "RateLimitExceededError";
  }
}

type RateLimitOptions = {
  /** Identifies the caller, e.g. `register:ip:1.2.3.4` or `login:user@example.com`. */
  key: string;
  limit: number;
  windowSeconds: number;
};

// Atomic fixed-window counter: increment, and set the window's expiry only
// on the first hit in that window, so the count and TTL can't drift apart
// under concurrent requests.
const INCR_WITH_TTL_SCRIPT = `
local current = redis.call("INCR", KEYS[1])
if current == 1 then
  redis.call("EXPIRE", KEYS[1], ARGV[1])
end
return current
`;

/**
 * Fixed-window rate limiter. Fails open: if Redis is unreachable, the
 * request is allowed through rather than blocked, since a rate-limiter
 * outage shouldn't take down otherwise-healthy traffic.
 */
export async function enforceRateLimit({
  key,
  limit,
  windowSeconds,
}: RateLimitOptions): Promise<void> {
  const redisKey = `de-perfume-shop:ratelimit:${key}`;

  const count = await withRedisFallback(
    async () => Number(await redis.eval(INCR_WITH_TTL_SCRIPT, 1, redisKey, windowSeconds)),
    () => 0
  );

  if (count > limit) {
    throw new RateLimitExceededError(windowSeconds);
  }
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || "unknown";
}
