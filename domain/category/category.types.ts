import type { z } from "zod";
import type {
  categoryFiltersSchema,
  createCategorySchema,
  updateCategorySchema,
} from "./category.validator";
import type { Paginated } from "@/domain/pagination";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// No .default() fields on either schema, so input and output are identical.
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

// Pre-parse shape used by RTK Query callers (page/pageSize are optional).
export type CategoryFilters = z.input<typeof categoryFiltersSchema>;
// Post-parse shape the repository receives (page/pageSize are defaulted).
export type ParsedCategoryFilters = z.output<typeof categoryFiltersSchema>;

export type PaginatedCategories = Paginated<Category>;
