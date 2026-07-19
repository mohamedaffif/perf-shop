import type { Badge, Concentration, ScentFamily, Size } from "@/domain/product/product.types";

export const ALL_VALUE = "all";

export const PRICE_BUCKETS = [
  { id: "under-40000", label: "Under KES 40,000", min: undefined, max: "40000" },
  { id: "40000-55000", label: "KES 40,000 – 55,000", min: "40000", max: "55000" },
  { id: "55000-65000", label: "KES 55,000 – 65,000", min: "55000", max: "65000" },
  { id: "over-65000", label: "Over KES 65,000", min: "65000", max: undefined },
] as const;

export function currentPriceBucketId(minPrice: string | null, maxPrice: string | null): string {
  const match = PRICE_BUCKETS.find(
    (bucket) => (bucket.min ?? null) === minPrice && (bucket.max ?? null) === maxPrice
  );
  return match?.id ?? ALL_VALUE;
}

export function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export interface ShopSearchParams {
  brandId?: string;
  concentration?: Concentration;
  scentFamily?: ScentFamily;
  size?: Size;
  badge?: Badge;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
}

export function parseShopFilters(
  sp: Record<string, string | string[] | undefined>
): ShopSearchParams {
  return {
    brandId: first(sp.brandId),
    concentration: first(sp.concentration) as Concentration | undefined,
    scentFamily: first(sp.scentFamily) as ScentFamily | undefined,
    size: first(sp.size) as Size | undefined,
    badge: first(sp.badge) as Badge | undefined,
    minPrice: first(sp.minPrice),
    maxPrice: first(sp.maxPrice),
    page: first(sp.page),
  };
}
