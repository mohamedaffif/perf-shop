import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/LegalPage";
import { BUSINESS } from "@/lib/business";

/*
 * DRAFT — please review before publishing.
 * Scoped to the soft-launch site (no online sales yet). Add sales terms, pricing,
 * delivery, returns, and refund clauses before enabling checkout.
 * Business details come from lib/business.ts — confirm the contact email exists.
 */

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that apply to your use of the DE PERFUME SHOP website.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" lastUpdated="2 September 2026">
      <p>
        These terms govern your use of the {BUSINESS.name} website operated by {BUSINESS.legalName}{" "}
        (&quot;we&quot;, &quot;us&quot;). By using this site you agree to them. If you do not agree,
        please do not use the site.
      </p>

      <h2>The website today</h2>
      <p>
        This site currently provides information about DE PERFUME SHOP, a newsletter signup, and a
        contact form. Products are not yet available for purchase online. Any prices, launch dates,
        or product details shown are indicative and may change.
      </p>

      <h2>Newsletter and communications</h2>
      <p>
        If you subscribe, you consent to receiving marketing email from us. You can unsubscribe at
        any time using the link in any message. We may also send you a confirmation email when you
        subscribe or contact us.
      </p>

      <h2>Acceptable use</h2>
      <ul>
        <li>Do not use the site for any unlawful or fraudulent purpose.</li>
        <li>Do not attempt to disrupt, probe, or gain unauthorised access to the site.</li>
        <li>Do not submit false information or another person&apos;s details without consent.</li>
      </ul>

      <h2>Intellectual property</h2>
      <p>
        All content on this site — text, branding, logos, and imagery — belongs to us or our
        licensors and may not be reproduced without permission.
      </p>

      <h2>Disclaimer and liability</h2>
      <p>
        The site is provided &quot;as is&quot; without warranties of any kind. To the extent
        permitted by law, we are not liable for any loss arising from your use of, or inability to
        use, the site. Nothing in these terms limits liability that cannot be limited under Kenyan
        law.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of Kenya, and the courts of Kenya have exclusive
        jurisdiction over any dispute.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms? Contact us at{" "}
        <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms from time to time. The &quot;last updated&quot; date above shows
        when they last changed.
      </p>
    </LegalPage>
  );
}
