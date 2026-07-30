import type { z } from "zod";
import type {
  couponFiltersSchema,
  couponTypeSchema,
  createCouponSchema,
  updateCouponSchema,
} from "./coupon.validator";
import type { Paginated } from "@/domain/pagination";

export type CouponType = z.infer<typeof couponTypeSchema>;

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  isActive: boolean;
  minOrderValue: number | null;
  maxDiscountAmount: number | null;
  startsAt: Date | null;
  expiresAt: Date | null;
  usageLimit: number | null;
  usageLimitPerUser: number | null;
  usedCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// z.coerce.date()'s input type is `unknown`, which is less useful than the
// actual accepted client shape (a date input's string value, or a Date) —
// so startsAt/expiresAt are overridden explicitly rather than derived as-is.
type CouponDateOverrides = { startsAt?: Date | string; expiresAt?: Date | string };

// Pre-parse shape sent by the client (isActive is optional; matches
// CouponForm/couponsApi.ts, which send it before createCouponSchema.parse()).
export type CreateCouponInput = Omit<z.input<typeof createCouponSchema>, "startsAt" | "expiresAt"> &
  CouponDateOverrides;
// Post-parse shape the repository receives (isActive defaulted, dates coerced).
export type ParsedCreateCouponInput = z.output<typeof createCouponSchema>;

export type UpdateCouponInput = Omit<z.input<typeof updateCouponSchema>, "startsAt" | "expiresAt"> &
  CouponDateOverrides;
export type ParsedUpdateCouponInput = z.output<typeof updateCouponSchema>;

// Pre-parse shape used by RTK Query callers (page/pageSize are optional).
export type CouponFilters = z.input<typeof couponFiltersSchema>;
// Post-parse shape the repository receives (page/pageSize are defaulted).
export type ParsedCouponFilters = z.output<typeof couponFiltersSchema>;

export type PaginatedCoupons = Paginated<Coupon>;
