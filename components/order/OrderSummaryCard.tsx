import { Badge } from "@/components/ui/badge";
import { SIZE_LABELS } from "@/components/product/product-meta";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/domain/order/order.types";

const STATUS_LABELS: Record<Order["status"], string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

interface OrderSummaryCardProps {
  order: Order;
  showStatus?: boolean;
}

export function OrderSummaryCard({ order, showStatus = false }: OrderSummaryCardProps) {
  return (
    <div className="border-border divide-y rounded-lg border">
      {showStatus ? (
        <div className="flex items-center justify-between p-4">
          <span className="text-sm font-medium">Order {order.orderNumber}</span>
          <Badge>{STATUS_LABELS[order.status]}</Badge>
        </div>
      ) : null}

      {order.items.map((item) => (
        <div key={item.id} className="flex items-center justify-between gap-4 p-4">
          <div>
            <p className="text-sm font-medium">{item.productName}</p>
            <p className="text-muted-foreground text-xs">
              {SIZE_LABELS[item.productSize]} · Qty {item.quantity}
            </p>
          </div>
          <span className="text-sm font-semibold">{formatPrice(item.lineTotal)}</span>
        </div>
      ))}

      <div className="flex flex-col gap-1.5 p-4 text-sm">
        <div className="text-muted-foreground flex items-center justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(order.subtotal)}</span>
        </div>
        {order.discountAmount > 0 ? (
          <div className="text-muted-foreground flex items-center justify-between">
            <span>Discount{order.couponCode ? ` (${order.couponCode})` : ""}</span>
            <span>-{formatPrice(order.discountAmount)}</span>
          </div>
        ) : null}
        <div className="text-muted-foreground flex items-center justify-between">
          <span>Shipping</span>
          <span>{order.shippingCost > 0 ? formatPrice(order.shippingCost) : "Free"}</span>
        </div>
        <div className="text-muted-foreground flex items-center justify-between">
          <span>Tax</span>
          <span>{formatPrice(order.taxAmount)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between p-4">
        <span className="font-semibold">Total</span>
        <span className="font-heading text-lg font-semibold">{formatPrice(order.total)}</span>
      </div>
    </div>
  );
}
