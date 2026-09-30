import { render } from "react-email";

import { BUSINESS } from "@/lib/business";
import { getEnv } from "@/lib/env";
import { resend } from "@/lib/resend";
import NewsletterConfirmEmail from "@/emails/newsletter-confirm";
import NewsletterWelcomeEmail from "@/emails/newsletter-welcome";
import { createUnsubscribeToken } from "./newsletter.unsubscribe-token";

/** Payload of the `email.newsletter` queue, published by newsletter.service. */
export type NewsletterEmailJob =
  | { kind: "confirm"; email: string; token: string }
  // subscriberId is optional so welcome jobs queued before it existed still send (without a link).
  | { kind: "welcome"; email: string; subscriberId?: string };

/** Opens the confirmation page (a GET never unsubscribes — mail scanners pre-open links). */
export function buildUnsubscribePageUrl(subscriberId: string): string {
  const token = encodeURIComponent(createUnsubscribeToken(subscriberId));
  return `${getEnv().NEXT_PUBLIC_APP_URL}/newsletter/unsubscribe?token=${token}`;
}

/** RFC 8058 one-click target: mail clients POST here and it unsubscribes immediately. */
export function buildOneClickUnsubscribeUrl(subscriberId: string): string {
  const token = encodeURIComponent(createUnsubscribeToken(subscriberId));
  return `${getEnv().NEXT_PUBLIC_APP_URL}/api/newsletter/unsubscribe?token=${token}`;
}

/** List-Unsubscribe headers every marketing email must carry (Gmail/Yahoo bulk-sender rules). */
export function buildUnsubscribeHeaders(subscriberId: string): Record<string, string> {
  return {
    "List-Unsubscribe": `<${buildOneClickUnsubscribeUrl(subscriberId)}>, <mailto:${BUSINESS.email}?subject=unsubscribe>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
}

/**
 * Renders and sends one newsletter email. Runs in the worker, off the request
 * path. Throws on failure so the queue retries it (see consumeQueue).
 */
export async function sendNewsletterEmail(job: NewsletterEmailJob): Promise<void> {
  const { NEXT_PUBLIC_APP_URL, NEWSLETTER_FROM_EMAIL, RESEND_FROM_EMAIL } = getEnv();

  const { subject, html, headers } =
    job.kind === "confirm"
      ? {
          subject: "Confirm your subscription — DE PERFUME SHOP",
          html: await render(
            NewsletterConfirmEmail({
              confirmUrl: `${NEXT_PUBLIC_APP_URL}/api/newsletter/confirm?token=${job.token}`,
            })
          ),
          headers: undefined,
        }
      : {
          subject: "You're on the list — DE PERFUME SHOP",
          html: await render(
            NewsletterWelcomeEmail({
              appUrl: NEXT_PUBLIC_APP_URL,
              unsubscribeUrl: job.subscriberId
                ? buildUnsubscribePageUrl(job.subscriberId)
                : undefined,
            })
          ),
          headers: job.subscriberId ? buildUnsubscribeHeaders(job.subscriberId) : undefined,
        };

  const { error } = await resend.emails.send({
    from: NEWSLETTER_FROM_EMAIL ?? RESEND_FROM_EMAIL,
    to: job.email,
    subject,
    html,
    headers,
  });
  if (error) throw new Error(`Resend send failed: ${error.message}`);
}
