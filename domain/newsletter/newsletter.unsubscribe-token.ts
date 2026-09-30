import { createHmac, timingSafeEqual } from "node:crypto";

import { getEnv } from "@/lib/env";

// Stateless signed token: `<subscriberId>.<signature>`. Nothing is stored, so the
// same link works in every newsletter we send, and the URL never carries an email.
const PURPOSE = "newsletter-unsubscribe:";

function sign(subscriberId: string): string {
  return createHmac("sha256", getEnv().NEWSLETTER_UNSUBSCRIBE_SECRET)
    .update(PURPOSE + subscriberId)
    .digest("base64url");
}

export function createUnsubscribeToken(subscriberId: string): string {
  return `${subscriberId}.${sign(subscriberId)}`;
}

/** Returns the subscriber id when the signature is valid, otherwise null. */
export function verifyUnsubscribeToken(token: string): string | null {
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;

  const subscriberId = token.slice(0, dot);
  const given = Buffer.from(token.slice(dot + 1));
  const expected = Buffer.from(sign(subscriberId));

  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  return subscriberId;
}
