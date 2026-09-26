"use client";

import type { Product } from "@/domain/product/product.types";
import { useGetProductStockQuery } from "@/lib/api/productsApi";

/**
 * Current stock for a product. The product page is cached HTML, so its
 * stockQuantity can be minutes old; with `live` on, this fetches the real
 * figure (one request per page — RTK Query dedupes callers) and falls back
 * to the cached value until it arrives. Checkout re-checks stock in the order
 * transaction regardless, so a briefly stale display can never oversell.
 */
export function useLiveStock(product: Pick<Product, "id" | "stockQuantity">, live = true): number {
  const { data } = useGetProductStockQuery(product.id, {
    skip: !live,
    refetchOnMountOrArgChange: true,
  });

  return data?.stockQuantity ?? product.stockQuantity;
}
