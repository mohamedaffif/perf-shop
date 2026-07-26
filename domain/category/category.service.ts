import * as categoryRepository from "./category.repository";
import {
  categoryFiltersSchema,
  createCategorySchema,
  updateCategorySchema,
} from "./category.validator";
import type { Category, PaginatedCategories } from "./category.types";

export class CategoryNotFoundError extends Error {
  constructor(id: string) {
    super(`Category ${id} not found`);
    this.name = "CategoryNotFoundError";
  }
}

export class CategoryInUseError extends Error {
  constructor(count: number) {
    super(`Cannot delete: ${count} product${count === 1 ? "" : "s"} still use this category`);
    this.name = "CategoryInUseError";
  }
}

export async function listCategories(rawFilters: unknown): Promise<PaginatedCategories> {
  const filters = categoryFiltersSchema.parse(rawFilters);
  const { items, total } = await categoryRepository.findMany(filters);

  return { items, total, page: filters.page, pageSize: filters.pageSize };
}

export async function getCategory(id: string): Promise<Category> {
  const category = await categoryRepository.findById(id);

  if (!category) {
    throw new CategoryNotFoundError(id);
  }

  return category;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return categoryRepository.findBySlug(slug);
}

export async function createCategory(rawInput: unknown): Promise<Category> {
  const input = createCategorySchema.parse(rawInput);
  return categoryRepository.create(input);
}

export async function updateCategory(id: string, rawInput: unknown): Promise<Category> {
  const input = updateCategorySchema.parse(rawInput);
  await getCategory(id);
  return categoryRepository.update(id, input);
}

export async function deleteCategory(id: string): Promise<void> {
  await getCategory(id);

  const productCount = await categoryRepository.countProducts(id);
  if (productCount > 0) {
    throw new CategoryInUseError(productCount);
  }

  await categoryRepository.remove(id);
}
