import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from "react-email";

const fontFamily =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const bodyStyle = { backgroundColor: "#f6f6f6", fontFamily };
const containerStyle = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "32px",
  maxWidth: "480px",
};
const headingStyle = { fontSize: "20px", fontWeight: 700, margin: "0 0 24px" };
const hrStyle = { borderColor: "#eaeaea", margin: "24px 0" };

export interface EmailShellProps {
  previewText: string;
  heading: string;
  children: React.ReactNode;
}

export function EmailShell({ previewText, heading, children }: EmailShellProps) {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Text style={{ fontSize: "12px", color: "#888", margin: "0 0 8px" }}>
            DE PERFUME SHOP
          </Text>
          <Heading style={headingStyle}>{heading}</Heading>
          {children}
          <Hr style={hrStyle} />
          <Text style={{ fontSize: "12px", color: "#888" }}>
            DE PERFUME SHOP — this is an automated message.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export interface EmailItem {
  productId: string | null;
  productName: string;
  quantity: number;
}

export function ItemsTable({ items }: { items: EmailItem[] }) {
  return (
    <Section>
      {items.map((item, index) => (
        <Text key={item.productId ?? index} style={{ fontSize: "14px", margin: "4px 0" }}>
          {item.quantity}× {item.productName}
        </Text>
      ))}
    </Section>
  );
}
