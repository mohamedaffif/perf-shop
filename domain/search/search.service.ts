import { searchProducts } from "@/domain/product";
import { searchQuerySchema } from "./search.validator";
import type { SearchResults } from "./search.types";

export async function search(rawQuery: unknown): Promise<SearchResults> {
  const { q, limit } = searchQuerySchema.parse(rawQuery);
  const items = await searchProducts(q, limit);
  return { items };
}
