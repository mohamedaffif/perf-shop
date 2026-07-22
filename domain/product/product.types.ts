export type ProductStatus = "DRAFT" | "PUBLISHED";

export type Concentration =
  "EXTRAIT_DE_PARFUM" | "EAU_DE_PARFUM" | "EAU_DE_TOILETTE" | "EAU_DE_COLOGNE" | "EAU_FRAICHE";

export type Badge = "NEW" | "BEST_SELLER" | "LIMITED_EDITION" | "SALE";

export type ScentFamily =
  "FLORAL" | "ORIENTAL" | "FRESH" | "WOODY" | "AROMATIC" | "CITRUS" | "SPICY";

export type Size = "ML_50" | "ML_75" | "ML_100";

export interface ProductImage {
  id: string;
  url: string;
  publicId: string;
  altText: string | null;
  isPrimary: boolean;
  order: number;
}

export interface ProductBrand {
  id: string;
  name: string;
  slug: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  brandId: string;
  brand: ProductBrand;
  categoryId: string;
  category: ProductCategory;
  concentration: Concentration;
  scentFamily: ScentFamily;
  description: string | null;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  size: Size;
  price: number;
  stockQuantity: number;
  status: ProductStatus;
  badges: Badge[];
  images: ProductImage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductImageInput {
  url: string;
  publicId: string;
  altText?: string;
  isPrimary?: boolean;
  order?: number;
}

export interface CreateProductInput {
  name: string;
  brandId: string;
  categoryId: string;
  concentration: Concentration;
  scentFamily: ScentFamily;
  description?: string;
  topNotes?: string[];
  heartNotes?: string[];
  baseNotes?: string[];
  size: Size;
  price: number;
  stockQuantity?: number;
  status?: ProductStatus;
  badges?: Badge[];
  images?: ProductImageInput[];
}

export type UpdateProductInput = Partial<CreateProductInput>;

export interface ProductFilters {
  status?: ProductStatus;
  brandId?: string;
  categoryId?: string;
  concentration?: Concentration;
  scentFamily?: ScentFamily;
  size?: Size;
  badge?: Badge;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedProducts {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
}
