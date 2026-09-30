import { Text } from "react-email";
import { EmailShell } from "./components";

export interface NewsletterWelcomeEmailProps {
  appUrl: string;
  unsubscribeUrl?: string;
}

export default function NewsletterWelcomeEmail({
  appUrl,
  unsubscribeUrl,
}: NewsletterWelcomeEmailProps) {
  return (
    <EmailShell previewText="You're on the list — DE PERFUME SHOP" heading="You're on the list">
      <Text style={{ fontSize: "14px" }}>
        Thank you for joining the DE PERFUME SHOP list. We&apos;re putting the finishing touches on
        the collection and you&apos;ll be among the first to know when it opens.
      </Text>
      <Text style={{ fontSize: "14px" }}>
        As a founding subscriber, you&apos;ll receive an early-access offer with the launch
        announcement.
      </Text>
      <Text style={{ fontSize: "14px" }}>
        <a href={appUrl} style={{ color: "#111111" }}>
          {appUrl.replace(/^https?:\/\//, "")}
        </a>
      </Text>
      {unsubscribeUrl && (
        <Text style={{ fontSize: "12px", color: "#888" }}>
          Don&apos;t want these emails?{" "}
          <a href={unsubscribeUrl} style={{ color: "#888" }}>
            Unsubscribe
          </a>
        </Text>
      )}
    </EmailShell>
  );
}

NewsletterWelcomeEmail.PreviewProps = {
  appUrl: "https://deperfumeshop.co.ke",
  unsubscribeUrl: "https://deperfumeshop.co.ke/newsletter/unsubscribe?token=preview",
} satisfies NewsletterWelcomeEmailProps;
