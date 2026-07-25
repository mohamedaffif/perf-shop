import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { Customer, CustomerFilters, CustomerStats } from "./user.types";

const customerInclude = {
  orders: { select: { total: true, createdAt: true, status: true } },
} satisfies Prisma.UserInclude;

type CustomerRow = Prisma.UserGetPayload<{ include: typeof customerInclude }>;

const EXCLUDED_SPEND_STATUSES = new Set(["CANCELLED", "REFUNDED"]);
const VIP_SPEND_THRESHOLD = 100_000;
const VIP_ORDER_COUNT_THRESHOLD = 5;
const NEW_CUSTOMER_WINDOW_DAYS = 30;

function toCustomer(row: CustomerRow): Customer {
  const orderCount = row.orders.length;
  const totalSpent = row.orders
    .filter((order) => !EXCLUDED_SPEND_STATUSES.has(order.status))
    .reduce((sum, order) => sum + Number(order.total), 0);
  const lastOrderAt = row.orders.reduce<Date | null>((latest, order) => {
    if (!latest || order.createdAt > latest) return order.createdAt;
    return latest;
  }, null);

  const daysSinceJoined = (Date.now() - row.createdAt.getTime()) / (1000 * 60 * 60 * 24);
  const isVip = totalSpent >= VIP_SPEND_THRESHOLD || orderCount >= VIP_ORDER_COUNT_THRESHOLD;
  const isNew = orderCount === 0 || daysSinceJoined <= NEW_CUSTOMER_WINDOW_DAYS;

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    image: row.image,
    createdAt: row.createdAt,
    orderCount,
    totalSpent,
    lastOrderAt,
    tier: isVip ? "VIP" : isNew ? "NEW" : "REGULAR",
  };
}

function buildWhere(filters: CustomerFilters): Prisma.UserWhereInput {
  const { search } = filters;

  return {
    role: "CUSTOMER",
    OR: search
      ? [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ]
      : undefined,
  };
}

export async function findMany(
  filters: CustomerFilters
): Promise<{ items: Customer[]; total: number }> {
  const { page = 1, pageSize = 20 } = filters;
  const where = buildWhere(filters);

  const [rows, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: customerInclude,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where }),
  ]);

  return { items: rows.map(toCustomer), total };
}

export async function getStats(): Promise<CustomerStats> {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [totalCustomers, newThisMonth, rows] = await Promise.all([
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.user.count({ where: { role: "CUSTOMER", createdAt: { gte: startOfMonth } } }),
    prisma.user.findMany({ where: { role: "CUSTOMER" }, include: customerInclude }),
  ]);

  const customers = rows.map(toCustomer);
  const vipCustomers = customers.filter((c) => c.tier === "VIP").length;
  const totalSpendAllCustomers = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const totalOrdersAllCustomers = customers.reduce((sum, c) => sum + c.orderCount, 0);
  const avgOrderValue =
    totalOrdersAllCustomers > 0 ? totalSpendAllCustomers / totalOrdersAllCustomers : 0;

  return { totalCustomers, newThisMonth, vipCustomers, avgOrderValue };
}
