import { publishEvent } from "@/lib/rabbitmq";
import { consumeTemporaryToken, createTemporaryToken } from "@/lib/tokens";
import * as newsletterRepository from "./newsletter.repository";
import type { NewsletterEmailJob } from "./newsletter.emails";
import { subscribeSchema, subscriberFiltersSchema } from "./newsletter.validator";
import type { PaginatedSubscribers, Subscriber } from "./newsletter.types";

const CONFIRM_TOKEN_PURPOSE = "newsletter-confirm";
const CONFIRM_TOKEN_TTL_SECONDS = 60 * 60 * 24;

// Emails are sent by the worker (sendNewsletterEmail), with queue retries, so a
// slow or failing mail provider never slows or fails the signup request.
// publishEvent logs and swallows broker errors — the visitor can retry.
function queueNewsletterEmail(job: NewsletterEmailJob): Promise<void> {
  return publishEvent("email.newsletter", job);
}

export type SubscribeResult = { status: "pending" | "already_subscribed" };

/**
 * Double opt-in: nothing is written to the database here. The pending signup is held
 * in a one-time Redis token and only becomes a subscriber once `confirmSubscription`
 * runs from the emailed link.
 */
export async function subscribe(rawInput: unknown): Promise<SubscribeResult> {
  const { email, source } = subscribeSchema.parse(rawInput);

  const existing = await newsletterRepository.findByEmail(email);
  if (existing && !existing.unsubscribedAt) {
    return { status: "already_subscribed" };
  }

  const token = await createTemporaryToken(
    CONFIRM_TOKEN_PURPOSE,
    JSON.stringify({ email, source }),
    CONFIRM_TOKEN_TTL_SECONDS
  );
  await queueNewsletterEmail({ kind: "confirm", email, token });

  return { status: "pending" };
}

export async function confirmSubscription(token: string): Promise<{ ok: boolean }> {
  const payload = await consumeTemporaryToken(CONFIRM_TOKEN_PURPOSE, token);
  if (payload === null) return { ok: false };

  let email: string;
  let source: string | undefined;
  try {
    ({ email, source } = JSON.parse(payload) as { email: string; source?: string });
  } catch {
    return { ok: false };
  }

  await newsletterRepository.upsert(email, source);
  await queueNewsletterEmail({ kind: "welcome", email });

  return { ok: true };
}

export async function listSubscribers(rawFilters: unknown): Promise<PaginatedSubscribers> {
  const filters = subscriberFiltersSchema.parse(rawFilters);
  const { items, total } = await newsletterRepository.findMany(filters);
  return { items, total, page: filters.page, pageSize: filters.pageSize };
}

export async function exportSubscribersCsv(): Promise<string> {
  const subscribers = await newsletterRepository.findAll();
  const header = "email,source,subscribed_at,unsubscribed_at";
  const rows = subscribers.map((s: Subscriber) =>
    [
      s.email,
      s.source ?? "",
      s.createdAt.toISOString(),
      s.unsubscribedAt ? s.unsubscribedAt.toISOString() : "",
    ]
      .map((field) => `"${String(field).replace(/"/g, '""')}"`)
      .join(",")
  );
  return [header, ...rows].join("\r\n");
}
