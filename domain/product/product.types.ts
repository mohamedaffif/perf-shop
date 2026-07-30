import type { z } from "zod";
import type {
  badgeSchema,
  concentrationSchema,
  createProductSchema,
  productFiltersSchema,
  productImageInputSchema,
  productStatusSchema,
  scentFamilySchema,
  sizeSchema,
  updateProductSchema,
} from "./product.validator";
import type { ProductRow } from "./product.repository";
import type { Paginated } from "@/domain/pagination";

export type ProductStatus = z.infer<typeof productStatusSchema>;
export type Concentration = z.infer<typeof concentrationSchema>;
export type Badge = z.infer<typeof badgeSchema>;
export type ScentFamily = z.infer<typeof scentFamilySchema>;
export type Size = z.infer<typeof sizeSchema>;

// Derived from the repository's Prisma.ProductGetPayload row; only the
// Decimal->number conversion toProduct() performs needs overriding here.
export type Product = Omit<ProductRow, "price"> & { price: number };

export type ProductImageInput = z.output<typeof productImageInputSchema>;

// Pre-parse shape sent by the client (fields with .default() are optional).
export type CreateProductInput = z.input<typeof createProductSchema>;
// Post-parse shape the repository receives after createProductSchema.parse().
export type ParsedCreateProductInput = z.output<typeof createProductSchema>;

// updateProductSchema has no defaults/transforms (built from raw fields, see
// product.validator.ts), so its input and output types are identical.
export type UpdateProductInput = z.output<typeof updateProductSchema>;

// Pre-parse shape used by RTK Query callers (page/pageSize are optional).
export type ProductFilters = z.input<typeof productFiltersSchema>;
// Post-parse shape the repository receives (page/pageSize are defaulted).
export type ParsedProductFilters = z.output<typeof productFiltersSchema>;

export type PaginatedProducts = Paginated<Product>;
