import { publishEvent } from "@/lib/rabbitmq";
import type { LowStockAlert } from "./order.repository";
import type { Order } from "./order.types";

export interface OrderConfirmedEvent {
  orderId: string;
  orderNumber: string;
  email: string;
  total: number;
  items: { productId: string | null; productName: string; quantity: number }[];
  createdAt: string;
}

export async function publishOrderConfirmed(order: Order): Promise<void> {
  const event: OrderConfirmedEvent = {
    orderId: order.id,
    orderNumber: order.orderNumber,
    email: order.email,
    total: order.total,
    items: order.items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
    })),
    createdAt: order.createdAt.toISOString(),
  };

  await publishEvent("order.confirmed", event);
}

export interface StockLowEvent {
  productId: string;
  productName: string;
  stockQuantity: number;
}

export async function publishLowStockAlerts(alerts: LowStockAlert[]): Promise<void> {
  await Promise.all(
    alerts.map((alert) =>
      publishEvent("stock.low", {
        productId: alert.productId,
        productName: alert.productName,
        stockQuantity: alert.stockQuantity,
      } satisfies StockLowEvent)
    )
  );
}
