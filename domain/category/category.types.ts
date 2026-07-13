export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryInput {
  name: string;
  slug: string;
  description?: string;
}

export type UpdateCategoryInput = Partial<CreateCategoryInput>;

export interface CategoryFilters {
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedCategories {
  items: Category[];
  total: number;
  page: number;
  pageSize: number;
}
