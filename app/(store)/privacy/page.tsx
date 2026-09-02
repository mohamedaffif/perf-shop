import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/LegalPage";
import { BUSINESS, BUSINESS_ADDRESS_ONELINE } from "@/lib/business";

/*
 * DRAFT — please review before publishing.
 * Scoped to the soft-launch site, which only collects data via the newsletter
 * signup and the contact form. Revisit when checkout goes live (payment data,
 * order history, shipping details, Pesapal as a processor).
 * Business details come from lib/business.ts — confirm the contact email exists.
 */

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How DE PERFUME SHOP collects and uses your personal data.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="2 September 2026">
      <p>
        This Privacy Policy explains how DE PERFUME SHOP (&quot;we&quot;, &quot;us&quot;) collects,
        uses, and protects your personal data when you visit this website. We process personal data
        in accordance with the Data Protection Act, 2019 of Kenya.
      </p>

      <h2>Who we are</h2>
      <p>
        {BUSINESS.name} is operated by {BUSINESS.legalName}, {BUSINESS_ADDRESS_ONELINE}. For any
        privacy questions or requests, contact us at{" "}
        <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a> or {BUSINESS.phone}.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Newsletter signups:</strong> your email address, and the date you subscribed.
        </li>
        <li>
          <strong>Contact form:</strong> your name, email address, and the content of your message.
        </li>
        <li>
          <strong>Technical data:</strong> standard server logs (IP address, browser type, pages
          visited) and cookie preferences, used for security and to keep the site working.
        </li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To send you launch news and offers you have asked to receive.</li>
        <li>To respond to enquiries you send us.</li>
        <li>To secure the site, prevent abuse, and comply with our legal obligations.</li>
      </ul>
      <p>
        We rely on your consent for marketing email, and on our legitimate interest in running and
        securing the site for the remaining purposes. We do not sell your personal data.
      </p>

      <h2>Who we share it with</h2>
      <ul>
        <li>
          <strong>Resend</strong> — our email delivery provider, which processes your email address
          to send newsletter and transactional messages.
        </li>
        <li>
          <strong>Supabase</strong> — our database hosting provider, which stores the data described
          above on our behalf.
        </li>
        <li>Authorities or advisers where we are legally required to do so.</li>
      </ul>
      <p>
        Some of these providers process data outside Kenya. Where that happens, we rely on their
        contractual data-protection commitments.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep newsletter data until you unsubscribe, and contact messages for up to 24 months
        after your enquiry is resolved. Server logs are retained for a short period for security
        purposes.
      </p>

      <h2>Your rights</h2>
      <p>
        You may ask us to access, correct, or delete your personal data, or to stop using it for
        marketing. You can unsubscribe from email at any time using the link in any message, or by
        contacting us. You also have the right to lodge a complaint with the Office of the Data
        Protection Commissioner.
      </p>

      <h2>Cookies</h2>
      <p>
        We use only essential cookies plus any you consent to via the cookie banner. You can change
        your choices at any time through the &quot;Cookie preferences&quot; link in the footer.
      </p>

      <h2>Changes</h2>
      <p>
        We may update this policy from time to time. The &quot;last updated&quot; date above shows
        when it last changed.
      </p>
    </LegalPage>
  );
}
