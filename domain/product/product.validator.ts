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

export const scentFamilySchema = z.enum([
  "FLORAL",
  "ORIENTAL",
  "FRESH",
  "WOODY",
  "AROMATIC",
  "CITRUS",
  "SPICY",
]);

export const sizeSchema = z.enum(["ML_50", "ML_75", "ML_100"]);

export const productImageInputSchema = z.object({
  url: z.url(),
  publicId: z.string().min(1),
  altText: z.string().optional(),
  isPrimary: z.boolean().default(false),
  order: z.number().int().nonnegative().default(0),
});

const productFields = {
  name: z.string().min(1),
  brandId: z.string().min(1),
  categoryId: z.string().min(1),
  concentration: concentrationSchema,
  scentFamily: scentFamilySchema,
  description: z.string().optional(),
  topNotes: z.array(z.string()).optional(),
  heartNotes: z.array(z.string()).optional(),
  baseNotes: z.array(z.string()).optional(),
  size: sizeSchema,
  price: z.number().positive(),
  stockQuantity: z.number().int().nonnegative().optional(),
  status: productStatusSchema.optional(),
  badges: z.array(badgeSchema).optional(),
  images: z.array(productImageInputSchema).optional(),
};

export const createProductSchema = z.object(productFields).extend({
  topNotes: z.array(z.string()).default([]),
  heartNotes: z.array(z.string()).default([]),
  baseNotes: z.array(z.string()).default([]),
  stockQuantity: z.number().int().nonnegative().default(0),
  status: productStatusSchema.default("DRAFT"),
  badges: z.array(badgeSchema).default([]),
  images: z.array(productImageInputSchema).default([]),
});

// Built from the raw (default-free) fields — .partial() on a schema with
// .default() would still backfill omitted fields instead of leaving them
// undefined, silently wiping data on partial updates.
export const updateProductSchema = z.object(productFields).partial();

export const productFiltersSchema = z.object({
  status: productStatusSchema.optional(),
  brandId: z.string().optional(),
  categoryId: z.string().optional(),
  concentration: concentrationSchema.optional(),
  scentFamily: scentFamilySchema.optional(),
  size: sizeSchema.optional(),
  badge: badgeSchema.optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});
