import { render } from "react-email";

import { getEnv } from "@/lib/env";
import { resend } from "@/lib/resend";
import { consumeTemporaryToken, createTemporaryToken } from "@/lib/tokens";
import NewsletterConfirmEmail from "@/emails/newsletter-confirm";
import NewsletterWelcomeEmail from "@/emails/newsletter-welcome";
import * as newsletterRepository from "./newsletter.repository";
import { subscribeSchema, subscriberFiltersSchema } from "./newsletter.validator";
import type { PaginatedSubscribers, Subscriber } from "./newsletter.types";

const CONFIRM_TOKEN_PURPOSE = "newsletter-confirm";
const CONFIRM_TOKEN_TTL_SECONDS = 60 * 60 * 24;

async function sendConfirmationEmail(email: string, token: string): Promise<void> {
  try {
    const confirmUrl = `${getEnv().NEXT_PUBLIC_APP_URL}/api/newsletter/confirm?token=${token}`;
    const html = await render(NewsletterConfirmEmail({ confirmUrl }));
    const { error } = await resend.emails.send({
      from: getEnv().RESEND_FROM_EMAIL,
      to: email,
      subject: "Confirm your subscription — DE PERFUME SHOP",
      html,
    });
    if (error) throw new Error(error.message);
  } catch (err) {
    // A mail failure must never fail the signup itself; the visitor can retry.
    console.error(`[newsletter] confirmation email to ${email} failed`, err);
  }
}

async function sendWelcomeEmail(email: string): Promise<void> {
  try {
    const html = await render(NewsletterWelcomeEmail({ appUrl: getEnv().NEXT_PUBLIC_APP_URL }));
    const { error } = await resend.emails.send({
      from: getEnv().RESEND_FROM_EMAIL,
      to: email,
      subject: "You're on the list — DE PERFUME SHOP",
      html,
    });
    if (error) throw new Error(error.message);
  } catch (err) {
    // A mail failure must never fail the signup itself.
    console.error(`[newsletter] welcome email to ${email} failed`, err);
  }
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
  await sendConfirmationEmail(email, token);

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
  await sendWelcomeEmail(email);

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
