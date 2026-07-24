import { formatPrice } from "@/lib/utils";
import { SIZE_LABELS } from "@/components/product/product-meta";
import type { Order } from "@/domain/order/order.types";

export function buildOrderWhatsAppUrl(order: Order): string | null {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!number) return null;

  const lines = [
    `Hi! I'd like to confirm my DE PERFUME SHOP order *${order.orderNumber}*.`,
    "",
    ...order.items.map(
      (item) =>
        `${item.quantity} x ${item.productName} (${SIZE_LABELS[item.productSize]}) - ${formatPrice(item.lineTotal)}`
    ),
    "",
    `Total: ${formatPrice(order.total)}`,
    `Deliver to: ${order.shippingFullName}, ${order.shippingLine1}, ${order.shippingCity}`,
  ];

  return `https://wa.me/${number}?text=${encodeURIComponent(lines.join("\n"))}`;
}
