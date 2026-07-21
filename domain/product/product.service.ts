import * as productRepository from "./product.repository";
import {
  createProductSchema,
  productFiltersSchema,
  updateProductSchema,
} from "./product.validator";
import type { PaginatedProducts, Product } from "./product.types";

export class ProductNotFoundError extends Error {
  constructor(id: string) {
    super(`Product ${id} not found`);
    this.name = "ProductNotFoundError";
  }
}

export async function listProducts(rawFilters: unknown): Promise<PaginatedProducts> {
  const filters = productFiltersSchema.parse(rawFilters);
  const { items, total } = await productRepository.findMany(filters);

  return { items, total, page: filters.page, pageSize: filters.pageSize };
}

export async function searchProducts(query: string, limit = 8): Promise<Product[]> {
  return productRepository.searchPublished(query, limit);
}

export async function getProduct(id: string): Promise<Product> {
  const product = await productRepository.findById(id);

  if (!product) {
    throw new ProductNotFoundError(id);
  }

  return product;
}

export async function createProduct(rawInput: unknown): Promise<Product> {
  const input = createProductSchema.parse(rawInput);
  return productRepository.create(input);
}

export async function updateProduct(id: string, rawInput: unknown): Promise<Product> {
  const input = updateProductSchema.parse(rawInput);
  await getProduct(id);
  return productRepository.update(id, input);
}

export async function deleteProduct(id: string): Promise<void> {
  await getProduct(id);
  await productRepository.remove(id);
}
