import { Text } from "react-email";
import { formatPrice } from "@/lib/utils";
import { EmailShell, ItemsTable, type EmailItem } from "./components";

export interface OrderConfirmationEmailProps {
  orderNumber: string;
  items: EmailItem[];
  total: number;
}

export default function OrderConfirmationEmail({
  orderNumber,
  items,
  total,
}: OrderConfirmationEmailProps) {
  return (
    <EmailShell
      previewText={`Your order ${orderNumber} is confirmed`}
      heading={`Order ${orderNumber} confirmed`}
    >
      <Text style={{ fontSize: "14px" }}>
        Thanks for your order! Here&apos;s a summary of what you purchased:
      </Text>
      <ItemsTable items={items} />
      <Text style={{ fontSize: "14px", fontWeight: 700, margin: "16px 0 0" }}>
        Total: {formatPrice(total)}
      </Text>
    </EmailShell>
  );
}

OrderConfirmationEmail.PreviewProps = {
  orderNumber: "DPS-1001",
  items: [
    { productId: "1", productName: "Amber Oud 100ml", quantity: 1 },
    { productId: "2", productName: "Rose Musk 50ml", quantity: 2 },
  ],
  total: 8500,
} satisfies OrderConfirmationEmailProps;
