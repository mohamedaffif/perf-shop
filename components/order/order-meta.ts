import type { OrderStatus, PaymentMethod } from "@/domain/order/order.types";

export const STATUS_LABELS = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
} satisfies Record<OrderStatus, string>;

export const PAYMENT_METHOD_LABELS = {
  PESAPAL: "Pay now (Pesapal)",
  COD: "Cash on delivery",
  BANK_TRANSFER: "Bank transfer",
} satisfies Record<PaymentMethod, string>;
