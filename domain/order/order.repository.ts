import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/client";
import type { Order, OrderItem } from "./order.types";

const orderInclude = {
  items: true,
} satisfies Prisma.OrderInclude;

type OrderRow = Prisma.OrderGetPayload<{ include: typeof orderInclude }>;

function toOrder(row: OrderRow): Order {
  return {
    ...row,
    subtotal: Number(row.subtotal),
    discountAmount: Number(row.discountAmount),
    shippingCost: Number(row.shippingCost),
    taxAmount: Number(row.taxAmount),
    total: Number(row.total),
    items: row.items.map(
      (item): OrderItem => ({
        ...item,
        unitPrice: Number(item.unitPrice),
        lineTotal: Number(item.lineTotal),
      })
    ),
  };
}

export class StockConflictError extends Error {
  constructor(public productId: string) {
    super(`Insufficient stock for product ${productId}`);
    this.name = "StockConflictError";
  }
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
  items: OrderItemCreateData[];
}

export async function createOrderWithStockDecrement(data: CreateOrderData): Promise<Order> {
  const { items, ...orderFields } = data;

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
    }

    return tx.order.create({
      data: { ...orderFields, items: { create: items } },
      include: orderInclude,
    });
  });

  return toOrder(row);
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
