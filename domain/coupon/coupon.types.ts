export type CouponType = "PERCENTAGE" | "FIXED_AMOUNT";

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

export interface CreateCouponInput {
  code: string;
  type: CouponType;
  value: number;
  isActive?: boolean;
  minOrderValue?: number;
  maxDiscountAmount?: number;
  startsAt?: Date | string;
  expiresAt?: Date | string;
  usageLimit?: number;
  usageLimitPerUser?: number;
}

export type UpdateCouponInput = Partial<CreateCouponInput>;

export interface CouponFilters {
  page?: number;
  pageSize?: number;
}

export interface PaginatedCoupons {
  items: Coupon[];
  total: number;
  page: number;
  pageSize: number;
}
