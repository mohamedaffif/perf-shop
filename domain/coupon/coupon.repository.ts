import { prisma } from "@/lib/prisma";
import type { PrismaClient, Coupon as CouponRow } from "@/lib/generated/prisma/client";
import type { Coupon, CouponFilters, CreateCouponInput, UpdateCouponInput } from "./coupon.types";

function toCoupon(row: CouponRow): Coupon {
  return {
    ...row,
    value: Number(row.value),
    minOrderValue: row.minOrderValue !== null ? Number(row.minOrderValue) : null,
    maxDiscountAmount: row.maxDiscountAmount !== null ? Number(row.maxDiscountAmount) : null,
  };
}

export async function findMany(
  filters: CouponFilters
): Promise<{ items: Coupon[]; total: number }> {
  const { page = 1, pageSize = 20 } = filters;

  const [rows, total] = await Promise.all([
    prisma.coupon.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.coupon.count(),
  ]);

  return { items: rows.map(toCoupon), total };
}

export async function findById(id: string): Promise<Coupon | null> {
  const row = await prisma.coupon.findUnique({ where: { id } });
  return row ? toCoupon(row) : null;
}

export async function findByCode(code: string): Promise<Coupon | null> {
  const row = await prisma.coupon.findUnique({ where: { code } });
  return row ? toCoupon(row) : null;
}

export async function create(data: CreateCouponInput): Promise<Coupon> {
  const row = await prisma.coupon.create({ data });
  return toCoupon(row);
}

export async function update(id: string, data: UpdateCouponInput): Promise<Coupon> {
  const row = await prisma.coupon.update({ where: { id }, data });
  return toCoupon(row);
}

export async function remove(id: string): Promise<void> {
  await prisma.coupon.delete({ where: { id } });
}

export async function incrementUsedCount(
  id: string,
  tx: Pick<PrismaClient, "coupon"> = prisma
): Promise<void> {
  await tx.coupon.update({ where: { id }, data: { usedCount: { increment: 1 } } });
}

export async function countOrdersByUser(couponId: string, userId: string): Promise<number> {
  return prisma.order.count({ where: { couponId, userId } });
}
