import { z } from "zod";

export const subscribeSchema = z.object({
  email: z.email().transform((value) => value.trim().toLowerCase()),
  source: z.string().max(64).optional(),
});

export const subscriberFiltersSchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});
