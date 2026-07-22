import { z } from "zod";

export const couponTypeSchema = z.enum(["PERCENTAGE", "FIXED_AMOUNT"]);

const couponFields = {
  code: z
    .string()
    .min(1)
    .transform((value) => value.trim().toUpperCase()),
  type: couponTypeSchema,
  value: z.number().positive(),
  isActive: z.boolean().optional(),
  minOrderValue: z.number().nonnegative().optional(),
  maxDiscountAmount: z.number().nonnegative().optional(),
  startsAt: z.coerce.date().optional(),
  expiresAt: z.coerce.date().optional(),
  usageLimit: z.number().int().positive().optional(),
  usageLimitPerUser: z.number().int().positive().optional(),
};

export const createCouponSchema = z.object(couponFields).extend({
  isActive: z.boolean().default(true),
});

export const updateCouponSchema = z.object(couponFields).partial();

export const couponFiltersSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});
