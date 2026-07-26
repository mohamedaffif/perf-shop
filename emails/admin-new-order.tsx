import { Text } from "react-email";
import { formatPrice } from "@/lib/utils";
import { EmailShell, ItemsTable, type EmailItem } from "./components";

export interface AdminNewOrderEmailProps {
  orderNumber: string;
  email: string;
  total: number;
  items: EmailItem[];
}

export default function AdminNewOrderEmail({
  orderNumber,
  email,
  total,
  items,
}: AdminNewOrderEmailProps) {
  return (
    <EmailShell previewText={`New order ${orderNumber}`} heading={`New order ${orderNumber}`}>
      <Text style={{ fontSize: "14px" }}>Customer: {email}</Text>
      <ItemsTable items={items} />
      <Text style={{ fontSize: "14px", fontWeight: 700, margin: "16px 0 0" }}>
        Total: {formatPrice(total)}
      </Text>
    </EmailShell>
  );
}

AdminNewOrderEmail.PreviewProps = {
  orderNumber: "DPS-1001",
  email: "customer@example.com",
  items: [
    { productId: "1", productName: "Amber Oud 100ml", quantity: 1 },
    { productId: "2", productName: "Rose Musk 50ml", quantity: 2 },
  ],
  total: 8500,
} satisfies AdminNewOrderEmailProps;
