import type { z } from "zod";
import type {
  orderFiltersSchema,
  orderLineItemSchema,
  orderStatusSchema,
  paymentMethodSchema,
  placeOrderSchema,
} from "./order.validator";
import type { OrderRow } from "./order.repository";
import type { Paginated } from "@/domain/pagination";

export type OrderStatus = z.infer<typeof orderStatusSchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

// No matching Zod schema validates this as client input — it's producer-only
// (set from lib/pesapal.ts's STATUS_CODE_MAP). Addressed in the payment phase.
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export type OrderLineItemInput = z.infer<typeof orderLineItemSchema>;

// placeOrderSchema has no .default()/transforms, so input and output are identical.
export type PlaceOrderInput = z.infer<typeof placeOrderSchema>;

// Only ever consumed post-parse (order.service.ts's listOrders always calls
// orderFiltersSchema.parse() before passing filters to the repository), so
// this is the output (page/pageSize defaulted) shape, not a client input type.
export type OrderFilters = z.output<typeof orderFiltersSchema>;

export type OrderItem = Omit<OrderRow["items"][number], "unitPrice" | "lineTotal"> & {
  unitPrice: number;
  lineTotal: number;
};

export type Order = Omit<
  OrderRow,
  "subtotal" | "discountAmount" | "shippingCost" | "taxAmount" | "total" | "items"
> & {
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  taxAmount: number;
  total: number;
  items: OrderItem[];
};

export type PaginatedOrders = Paginated<Order>;

// Additive, opt-in refinement of paymentStatus/paidAt/failureReason — does
// NOT replace those flat fields on Order (existing repository/service/
// component code already treats them independently). Available for new code
// that wants the three fields' co-variance enforced by the type system.
export type OrderPaymentState =
  | { paymentStatus: "PENDING"; paidAt: null; failureReason: null }
  | { paymentStatus: "PAID"; paidAt: Date; failureReason: null }
  | { paymentStatus: "FAILED" | "REFUNDED"; paidAt: null; failureReason: string | null };
