import { Text } from "react-email";
import { EmailShell } from "./components";

export interface ContactMessageEmailProps {
  name: string;
  email: string;
  message: string;
}

export default function ContactMessageEmail({ name, email, message }: ContactMessageEmailProps) {
  return (
    <EmailShell previewText={`New contact message from ${name}`} heading="New contact message">
      <Text style={{ fontSize: "14px", margin: "4px 0" }}>
        <strong>From:</strong> {name}
      </Text>
      <Text style={{ fontSize: "14px", margin: "4px 0" }}>
        <strong>Email:</strong> {email}
      </Text>
      <Text style={{ fontSize: "14px", margin: "16px 0 0", whiteSpace: "pre-wrap" }}>
        {message}
      </Text>
    </EmailShell>
  );
}

ContactMessageEmail.PreviewProps = {
  name: "Amina K.",
  email: "amina@example.com",
  message: "Hi, do you ship to Mombasa? And when does the collection launch?",
} satisfies ContactMessageEmailProps;
