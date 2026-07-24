import { randomBytes } from "crypto";
import { Prisma } from "@/lib/generated/prisma/client";
import { getProduct, invalidateProductCaches } from "@/domain/product";
import { validateCouponForOrder } from "@/domain/coupon";
import { calculateShipping } from "@/lib/pricing";
import { withInventoryLocks } from "@/lib/lock";
import * as orderRepository from "./order.repository";
import { publishOrderConfirmed, publishLowStockAlerts } from "./order.events";
import { orderFiltersSchema, placeOrderSchema, updateOrderStatusSchema } from "./order.validator";
import type { Order, PaginatedOrders } from "./order.types";

export class OutOfStockError extends Error {
  constructor(productName: string) {
    super(`${productName} is out of stock or has insufficient quantity`);
    this.name = "OutOfStockError";
  }
}

export class OrderNotFoundError extends Error {
  constructor(identifier: string) {
    super(`Order ${identifier} not found`);
    this.name = "OrderNotFoundError";
  }
}

export class InvalidCouponError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidCouponError";
  }
}

function generateOrderNumber(): string {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
    now.getDate()
  ).padStart(2, "0")}`;
  const random = randomBytes(4).toString("hex").toUpperCase();
  return `PS-${date}-${random}`;
}

export async function placeOrder(rawInput: unknown, userId?: string | null): Promise<Order> {
  const input = placeOrderSchema.parse(rawInput);

  const orderItems = await Promise.all(
    input.items.map(async ({ productId, quantity }) => {
      const product = await getProduct(productId);

      if (product.status !== "PUBLISHED" || product.stockQuantity < quantity) {
        throw new OutOfStockError(product.name);
      }

      const image = product.images.find((i) => i.isPrimary) ?? product.images[0];
      const lineTotal = Number((product.price * quantity).toFixed(2));

      return {
        productId: product.id,
        productName: product.name,
        productBrand: product.brand.name,
        productSize: product.size,
        productConcentration: product.concentration,
        productImageUrl: image?.url ?? null,
        unitPrice: product.price,
        quantity,
        lineTotal,
      };
    })
  );

  const subtotal = Number(orderItems.reduce((sum, i) => sum + i.lineTotal, 0).toFixed(2));

  let discountAmount = 0;
  let couponId: string | null = null;
  let couponCode: string | null = null;

  if (input.couponCode) {
    const result = await validateCouponForOrder(input.couponCode, subtotal, userId);

    if (!result.valid || !result.coupon) {
      throw new InvalidCouponError(result.error ?? "Invalid coupon code");
    }

    discountAmount = result.discountAmount;
    couponId = result.coupon.id;
    couponCode = result.coupon.code;
  }

  const shippingCost = calculateShipping(subtotal, input.shippingCity);
  const taxAmount = 0;
  const total = Number((subtotal + shippingCost - discountAmount).toFixed(2));

  const orderData = {
    email: input.email,
    phone: input.phone ?? input.shippingPhone,
    userId: userId ?? null,
    shippingFullName: input.shippingFullName,
    shippingPhone: input.shippingPhone,
    shippingLine1: input.shippingLine1,
    shippingLine2: input.shippingLine2,
    shippingCity: input.shippingCity,
    shippingState: input.shippingState,
    shippingPostalCode: input.shippingPostalCode,
    shippingCountry: input.shippingCountry,
    subtotal,
    shippingCost,
    taxAmount,
    discountAmount,
    total,
    couponId,
    couponCode,
    items: orderItems,
  };

  const productIds = orderItems.map((item) => item.productId);

  const result = await withInventoryLocks(productIds, async () => {
    const MAX_ATTEMPTS = 3;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        return await orderRepository.createOrderWithStockDecrement({
          ...orderData,
          orderNumber: generateOrderNumber(),
        });
      } catch (err) {
        if (err instanceof orderRepository.StockConflictError) {
          const item = orderItems.find((i) => i.productId === err.productId);
          throw new OutOfStockError(item?.productName ?? err.productId);
        }

        const isUniqueClash =
          err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002";
        if (isUniqueClash && attempt < MAX_ATTEMPTS) continue;

        throw err;
      }
    }

    throw new Error("Failed to generate a unique order number");
  });

  const { order, touchedProductIds, lowStockAlerts } = result;

  // Stock was decremented via a raw query in order.repository.ts, bypassing
  // the product repository's own cache invalidation — invalidate here so
  // product/list/search caches don't serve stale stockQuantity values.
  await Promise.all(touchedProductIds.map((id) => invalidateProductCaches(id)));

  await publishOrderConfirmed(order);
  if (lowStockAlerts.length > 0) {
    await publishLowStockAlerts(lowStockAlerts);
  }

  return order;
}

export async function getOrderByOrderNumber(orderNumber: string): Promise<Order> {
  const order = await orderRepository.findByOrderNumber(orderNumber);

  if (!order) {
    throw new OrderNotFoundError(orderNumber);
  }

  return order;
}

export async function getOrder(id: string): Promise<Order> {
  const order = await orderRepository.findById(id);

  if (!order) {
    throw new OrderNotFoundError(id);
  }

  return order;
}

export async function listOrders(rawFilters: unknown): Promise<PaginatedOrders> {
  const filters = orderFiltersSchema.parse(rawFilters);
  const { items, total } = await orderRepository.findMany(filters);

  return { items, total, page: filters.page, pageSize: filters.pageSize };
}

export async function updateOrderStatus(id: string, rawInput: unknown): Promise<Order> {
  const { status } = updateOrderStatusSchema.parse(rawInput);
  await getOrder(id);
  return orderRepository.updateStatus(id, status);
}
