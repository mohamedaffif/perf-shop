import type { z } from "zod";
import type { brandFiltersSchema, createBrandSchema, updateBrandSchema } from "./brand.validator";
import type { Paginated } from "@/domain/pagination";

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// No .default() fields on either schema, so input and output are identical.
export type CreateBrandInput = z.infer<typeof createBrandSchema>;
export type UpdateBrandInput = z.infer<typeof updateBrandSchema>;

// Pre-parse shape used by RTK Query callers (page/pageSize are optional).
export type BrandFilters = z.input<typeof brandFiltersSchema>;
// Post-parse shape the repository receives (page/pageSize are defaulted).
export type ParsedBrandFilters = z.output<typeof brandFiltersSchema>;

export type PaginatedBrands = Paginated<Brand>;
