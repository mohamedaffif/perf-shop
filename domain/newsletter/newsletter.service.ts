import { render } from "react-email";

import { getEnv } from "@/lib/env";
import { resend } from "@/lib/resend";
import NewsletterWelcomeEmail from "@/emails/newsletter-welcome";
import * as newsletterRepository from "./newsletter.repository";
import { subscribeSchema, subscriberFiltersSchema } from "./newsletter.validator";
import type { PaginatedSubscribers, Subscriber } from "./newsletter.types";

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

export async function subscribe(rawInput: unknown): Promise<{ subscribed: true }> {
  const { email, source } = subscribeSchema.parse(rawInput);
  const { created } = await newsletterRepository.upsert(email, source);

  if (created) {
    await sendWelcomeEmail(email);
  }

  return { subscribed: true };
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
