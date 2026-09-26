"use client";

import type { Product } from "@/domain/product/product.types";
import { useLiveStock } from "@/hooks/useLiveStock";
import { Badge } from "@/components/ui/badge";

// Client-side so the stock shown on the (cached) product page is live.
export function StockBadge({ product }: { product: Pick<Product, "id" | "stockQuantity"> }) {
  const stockQuantity = useLiveStock(product);

  if (stockQuantity <= 0) return <Badge variant="destructive">Out of Stock</Badge>;
  if (stockQuantity <= 5) return <Badge variant="warning">Only {stockQuantity} left</Badge>;
  return null;
}
