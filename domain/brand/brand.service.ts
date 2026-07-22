import * as brandRepository from "./brand.repository";
import { brandFiltersSchema, createBrandSchema, updateBrandSchema } from "./brand.validator";
import type { Brand, PaginatedBrands } from "./brand.types";

export class BrandNotFoundError extends Error {
  constructor(id: string) {
    super(`Brand ${id} not found`);
    this.name = "BrandNotFoundError";
  }
}

export async function listBrands(rawFilters: unknown): Promise<PaginatedBrands> {
  const filters = brandFiltersSchema.parse(rawFilters);
  const { items, total } = await brandRepository.findMany(filters);

  return { items, total, page: filters.page, pageSize: filters.pageSize };
}

export async function getBrand(id: string): Promise<Brand> {
  const brand = await brandRepository.findById(id);

  if (!brand) {
    throw new BrandNotFoundError(id);
  }

  return brand;
}

export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  return brandRepository.findBySlug(slug);
}

export async function createBrand(rawInput: unknown): Promise<Brand> {
  const input = createBrandSchema.parse(rawInput);
  return brandRepository.create(input);
}

export async function updateBrand(id: string, rawInput: unknown): Promise<Brand> {
  const input = updateBrandSchema.parse(rawInput);
  await getBrand(id);
  return brandRepository.update(id, input);
}

export async function deleteBrand(id: string): Promise<void> {
  await getBrand(id);
  await brandRepository.remove(id);
}
