import { z } from "zod";

export const productStatusSchema = z.enum(["DRAFT", "PUBLISHED"]);

export const concentrationSchema = z.enum([
  "EXTRAIT_DE_PARFUM",
  "EAU_DE_PARFUM",
  "EAU_DE_TOILETTE",
  "EAU_DE_COLOGNE",
  "EAU_FRAICHE",
]);

export const badgeSchema = z.enum(["NEW", "BEST_SELLER", "LIMITED_EDITION", "SALE"]);

export const sizeSchema = z.enum(["ML_50", "ML_75", "ML_100"]);

export const productImageInputSchema = z.object({
  url: z.url(),
  altText: z.string().optional(),
  isPrimary: z.boolean().default(false),
  order: z.number().int().nonnegative().default(0),
});

export const createProductSchema = z.object({
  name: z.string().min(1),
  brand: z.string().min(1),
  concentration: concentrationSchema,
  description: z.string().optional(),
  topNotes: z.array(z.string()).default([]),
  heartNotes: z.array(z.string()).default([]),
  baseNotes: z.array(z.string()).default([]),
  size: sizeSchema,
  price: z.number().positive(),
  stockQuantity: z.number().int().nonnegative().default(0),
  status: productStatusSchema.default("DRAFT"),
  badges: z.array(badgeSchema).default([]),
  images: z.array(productImageInputSchema).default([]),
});

export const updateProductSchema = createProductSchema.partial();

export const productFiltersSchema = z.object({
  status: productStatusSchema.optional(),
  brand: z.string().optional(),
  concentration: concentrationSchema.optional(),
  size: sizeSchema.optional(),
  badge: badgeSchema.optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});
