import * as couponRepository from "./coupon.repository";
import { couponFiltersSchema, createCouponSchema, updateCouponSchema } from "./coupon.validator";
import type { Coupon, PaginatedCoupons } from "./coupon.types";

export class CouponNotFoundError extends Error {
  constructor(id: string) {
    super(`Coupon ${id} not found`);
    this.name = "CouponNotFoundError";
  }
}

export async function listCoupons(rawFilters: unknown): Promise<PaginatedCoupons> {
  const filters = couponFiltersSchema.parse(rawFilters);
  const { items, total } = await couponRepository.findMany(filters);

  return { items, total, page: filters.page, pageSize: filters.pageSize };
}

export async function getCoupon(id: string): Promise<Coupon> {
  const coupon = await couponRepository.findById(id);

  if (!coupon) {
    throw new CouponNotFoundError(id);
  }

  return coupon;
}

export async function createCoupon(rawInput: unknown): Promise<Coupon> {
  const input = createCouponSchema.parse(rawInput);
  return couponRepository.create(input);
}

export async function updateCoupon(id: string, rawInput: unknown): Promise<Coupon> {
  const input = updateCouponSchema.parse(rawInput);
  await getCoupon(id);
  return couponRepository.update(id, input);
}

export async function deleteCoupon(id: string): Promise<void> {
  await getCoupon(id);
  await couponRepository.remove(id);
}

export interface CouponValidationResult {
  valid: boolean;
  discountAmount: number;
  coupon?: Coupon;
  error?: string;
}

export async function validateCouponForOrder(
  code: string,
  subtotal: number,
  userId?: string | null
): Promise<CouponValidationResult> {
  const coupon = await couponRepository.findByCode(code.trim().toUpperCase());

  if (!coupon) {
    return { valid: false, discountAmount: 0, error: "Coupon not found" };
  }

  if (!coupon.isActive) {
    return { valid: false, discountAmount: 0, error: "This coupon is not active" };
  }

  const now = new Date();
  if (coupon.startsAt && now < coupon.startsAt) {
    return { valid: false, discountAmount: 0, error: "This coupon is not active yet" };
  }

  if (coupon.expiresAt && now > coupon.expiresAt) {
    return { valid: false, discountAmount: 0, error: "This coupon has expired" };
  }

  if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
    return {
      valid: false,
      discountAmount: 0,
      error: `Minimum order value for this coupon is ${coupon.minOrderValue}`,
    };
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, discountAmount: 0, error: "This coupon has reached its usage limit" };
  }

  if (coupon.usageLimitPerUser && userId) {
    const userUses = await couponRepository.countOrdersByUser(coupon.id, userId);
    if (userUses >= coupon.usageLimitPerUser) {
      return { valid: false, discountAmount: 0, error: "You have already used this coupon" };
    }
  }

  let discountAmount =
    coupon.type === "PERCENTAGE" ? (subtotal * coupon.value) / 100 : coupon.value;

  if (coupon.maxDiscountAmount) {
    discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
  }

  discountAmount = Number(Math.min(discountAmount, subtotal).toFixed(2));

  return { valid: true, discountAmount, coupon };
}
