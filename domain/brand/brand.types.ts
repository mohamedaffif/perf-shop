export interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBrandInput {
  name: string;
  slug: string;
  description?: string;
}

export type UpdateBrandInput = Partial<CreateBrandInput>;

export interface BrandFilters {
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedBrands {
  items: Brand[];
  total: number;
  page: number;
  pageSize: number;
}
