import { render } from "react-email";

import { getEnv } from "@/lib/env";
import { resend } from "@/lib/resend";
import NewsletterConfirmEmail from "@/emails/newsletter-confirm";
import NewsletterWelcomeEmail from "@/emails/newsletter-welcome";

/** Payload of the `email.newsletter` queue, published by newsletter.service. */
export type NewsletterEmailJob =
  { kind: "confirm"; email: string; token: string } | { kind: "welcome"; email: string };

/**
 * Renders and sends one newsletter email. Runs in the worker, off the request
 * path. Throws on failure so the queue retries it (see consumeQueue).
 */
export async function sendNewsletterEmail(job: NewsletterEmailJob): Promise<void> {
  const { NEXT_PUBLIC_APP_URL, RESEND_FROM_EMAIL } = getEnv();

  const { subject, html } =
    job.kind === "confirm"
      ? {
          subject: "Confirm your subscription — DE PERFUME SHOP",
          html: await render(
            NewsletterConfirmEmail({
              confirmUrl: `${NEXT_PUBLIC_APP_URL}/api/newsletter/confirm?token=${job.token}`,
            })
          ),
        }
      : {
          subject: "You're on the list — DE PERFUME SHOP",
          html: await render(NewsletterWelcomeEmail({ appUrl: NEXT_PUBLIC_APP_URL })),
        };

  const { error } = await resend.emails.send({
    from: RESEND_FROM_EMAIL,
    to: job.email,
    subject,
    html,
  });
  if (error) throw new Error(`Resend send failed: ${error.message}`);
}
