import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/client";
import type {
  Order,
  OrderFilters,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from "./order.types";

export const orderInclude = {
  items: true,
} satisfies Prisma.OrderInclude;

export type OrderRow = Prisma.OrderGetPayload<{ include: typeof orderInclude }>;

function toOrder(row: OrderRow): Order {
  return {
    ...row,
    subtotal: Number(row.subtotal),
    discountAmount: Number(row.discountAmount),
    shippingCost: Number(row.shippingCost),
    taxAmount: Number(row.taxAmount),
    total: Number(row.total),
    items: row.items.map((item): OrderItem => ({
      ...item,
      unitPrice: Number(item.unitPrice),
      lineTotal: Number(item.lineTotal),
    })),
  };
}

export class StockConflictError extends Error {
  constructor(public productId: string) {
    super(`Insufficient stock for product ${productId}`);
    this.name = "StockConflictError";
  }
}

const LOW_STOCK_THRESHOLD = 5;

export interface LowStockAlert {
  productId: string;
  productName: string;
  stockQuantity: number;
}

export interface OrderItemCreateData {
  productId: string | null;
  productName: string;
  productBrand: string | null;
  productSize: OrderRow["items"][number]["productSize"];
  productConcentration: OrderRow["items"][number]["productConcentration"];
  productImageUrl: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface CreateOrderData {
  orderNumber: string;
  email: string;
  phone?: string | null;
  userId?: string | null;
  shippingFullName: string;
  shippingPhone: string;
  shippingLine1: string;
  shippingLine2?: string | null;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingCountry: string;
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  couponId?: string | null;
  couponCode?: string | null;
  paymentMethod: PaymentMethod;
  items: OrderItemCreateData[];
}

export interface CreateOrderResult {
  order: Order;
  touchedProductIds: string[];
  lowStockAlerts: LowStockAlert[];
}

export async function createOrderWithStockDecrement(
  data: CreateOrderData
): Promise<CreateOrderResult> {
  const { items, couponId, ...orderFields } = data;
  const lowStockAlerts: LowStockAlert[] = [];
  const touchedProductIds: string[] = [];

  const row = await prisma.$transaction(async (tx) => {
    for (const item of items) {
      if (!item.productId) continue;

      const result = await tx.product.updateMany({
        where: { id: item.productId, stockQuantity: { gte: item.quantity } },
        data: { stockQuantity: { decrement: item.quantity } },
      });

      if (result.count === 0) {
        throw new StockConflictError(item.productId);
      }

      touchedProductIds.push(item.productId);

      const updated = await tx.product.findUnique({
        where: { id: item.productId },
        select: { name: true, stockQuantity: true },
      });

      if (updated && updated.stockQuantity <= LOW_STOCK_THRESHOLD) {
        lowStockAlerts.push({
          productId: item.productId,
          productName: updated.name,
          stockQuantity: updated.stockQuantity,
        });
      }
    }

    if (couponId) {
      await tx.coupon.update({ where: { id: couponId }, data: { usedCount: { increment: 1 } } });
    }

    return tx.order.create({
      data: { ...orderFields, couponId, items: { create: items } },
      include: orderInclude,
    });
  });

  return { order: toOrder(row), touchedProductIds, lowStockAlerts };
}

export async function findByOrderNumber(orderNumber: string): Promise<Order | null> {
  const row = await prisma.order.findUnique({
    where: { orderNumber },
    include: orderInclude,
  });

  return row ? toOrder(row) : null;
}

export async function findById(id: string): Promise<Order | null> {
  const row = await prisma.order.findUnique({
    where: { id },
    include: orderInclude,
  });

  return row ? toOrder(row) : null;
}

/**
 * Looks up an order by its Pesapal tracking id rather than merchant
 * reference — the merchant reference must be regenerated fresh on every
 * retry attempt (Pesapal requires uniqueness per request), so the tracking
 * id we store right after each SubmitOrderRequest is the stable key for
 * matching an IPN/callback back to the order.
 */
export async function findByPaymentReference(paymentReference: string): Promise<Order | null> {
  const row = await prisma.order.findFirst({
    where: { paymentReference },
    include: orderInclude,
  });

  return row ? toOrder(row) : null;
}

function buildWhere(filters: OrderFilters): Prisma.OrderWhereInput {
  const { userId, status, search } = filters;

  return {
    userId,
    status,
    OR: search
      ? [
          { orderNumber: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ]
      : undefined,
  };
}

export async function findMany(filters: OrderFilters): Promise<{ items: Order[]; total: number }> {
  const where = buildWhere(filters);
  const { page = 1, pageSize = 20 } = filters;

  const [rows, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: orderInclude,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.count({ where }),
  ]);

  return { items: rows.map(toOrder), total };
}

export async function updateStatus(id: string, status: OrderStatus): Promise<Order> {
  const row = await prisma.order.update({
    where: { id },
    data: { status },
    include: orderInclude,
  });

  return toOrder(row);
}

/** Records the Pesapal tracking id + raw submit response against an order right after SubmitOrderRequest succeeds. */
export async function updatePaymentTracking(
  orderNumber: string,
  data: { paymentReference: string; gatewayResponse: Prisma.InputJsonValue }
): Promise<void> {
  await prisma.order.update({
    where: { orderNumber },
    data: { paymentReference: data.paymentReference, gatewayResponse: data.gatewayResponse },
  });
}

export interface PaymentConfirmationData {
  paymentStatus: PaymentStatus;
  paidAt: Date | null;
  failureReason: string | null;
  gatewayResponse: Prisma.InputJsonValue;
}

/**
 * Idempotently transitions paymentStatus PENDING -> the given status, along
 * with the supporting details (paidAt/failureReason/gatewayResponse) customer
 * support needs without having to go dig through Pesapal's dashboard. Returns
 * the updated order, or null if no row was still PENDING (already confirmed by
 * a concurrent IPN/browser-callback call, or the order doesn't exist) — the
 * same conditional-update-then-count-check pattern used for stock decrement above.
 */
export async function updatePaymentStatusIfPending(
  orderNumber: string,
  data: PaymentConfirmationData
): Promise<Order | null> {
  const result = await prisma.order.updateMany({
    where: { orderNumber, paymentStatus: "PENDING" },
    data,
  });

  if (result.count === 0) return null;

  return findByOrderNumber(orderNumber);
}
