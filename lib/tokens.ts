import { randomBytes } from "crypto";
import { redis } from "@/lib/redis";

/**
 * One-time, short-lived tokens (password reset, email verification, etc.)
 * backed by Redis. Not wired into a specific flow yet — callers pick a
 * `purpose` namespace and TTL appropriate to their use case.
 */

function tokenKey(purpose: string, token: string): string {
  return `de-perfume-shop:token:${purpose}:${token}`;
}

export async function createTemporaryToken(
  purpose: string,
  subjectId: string,
  ttlSeconds: number
): Promise<string> {
  const token = randomBytes(32).toString("hex");
  await redis.set(tokenKey(purpose, token), subjectId, "EX", ttlSeconds);
  return token;
}

/** Validates and deletes the token atomically so it can only be consumed once. */
export async function consumeTemporaryToken(
  purpose: string,
  token: string
): Promise<string | null> {
  const key = tokenKey(purpose, token);
  const subjectId = await redis.get(key);
  if (subjectId === null) return null;

  await redis.del(key);
  return subjectId;
}
