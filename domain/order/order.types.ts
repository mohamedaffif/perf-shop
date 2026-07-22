import type { Concentration, Size } from "@/domain/product/product.types";

export type OrderStatus =
  "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface OrderLineItemInput {
  productId: string;
  quantity: number;
}

export interface PlaceOrderInput {
  email: string;
  phone?: string;
  shippingFullName: string;
  shippingPhone: string;
  shippingLine1: string;
  shippingLine2?: string;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingCountry: string;
  items: OrderLineItemInput[];
}

export interface OrderItem {
  id: string;
  productId: string | null;
  productName: string;
  productBrand: string | null;
  productSize: Size;
  productConcentration: Concentration;
  productImageUrl: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string | null;
  paymentReference: string | null;
  email: string;
  phone: string | null;
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  taxAmount: number;
  total: number;
  couponCode: string | null;
  shippingFullName: string;
  shippingPhone: string;
  shippingLine1: string;
  shippingLine2: string | null;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingCountry: string;
  userId: string | null;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}
