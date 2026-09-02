import { Text } from "react-email";
import { EmailShell } from "./components";

export interface NewsletterConfirmEmailProps {
  confirmUrl: string;
}

export default function NewsletterConfirmEmail({ confirmUrl }: NewsletterConfirmEmailProps) {
  return (
    <EmailShell
      previewText="Confirm your subscription — DE PERFUME SHOP"
      heading="Confirm your subscription"
    >
      <Text style={{ fontSize: "14px" }}>
        Tap the button below to confirm you&apos;d like to join the DE PERFUME SHOP list. We
        won&apos;t add you until you do.
      </Text>
      <Text style={{ margin: "24px 0" }}>
        <a
          href={confirmUrl}
          style={{
            backgroundColor: "#111111",
            borderRadius: "9999px",
            color: "#ffffff",
            display: "inline-block",
            fontSize: "14px",
            padding: "12px 24px",
            textDecoration: "none",
          }}
        >
          Confirm subscription
        </a>
      </Text>
      <Text style={{ fontSize: "12px", color: "#888" }}>
        This link expires in 24 hours. If you didn&apos;t request this, you can ignore this email.
      </Text>
    </EmailShell>
  );
}

NewsletterConfirmEmail.PreviewProps = {
  confirmUrl: "https://deperfumeshop.co.ke/api/newsletter/confirm?token=example",
} satisfies NewsletterConfirmEmailProps;
