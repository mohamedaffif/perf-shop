import {
  badgeSchema,
  concentrationSchema,
  scentFamilySchema,
  sizeSchema,
} from "@/domain/product/product.validator";
import { isOneOf } from "@/lib/type-guards";
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

// Drops a param instead of passing it through when it doesn't match one of
// the enum's values — a stale/malformed query string would otherwise reach
// productFiltersSchema.parse() downstream and throw, crashing the shop page.
function parseEnumParam<T extends string>(
  value: string | undefined,
  options: readonly T[]
): T | undefined {
  return value !== undefined && isOneOf(options, value) ? value : undefined;
}

export function parseShopFilters(
  sp: Record<string, string | string[] | undefined>
): ShopSearchParams {
  return {
    brandId: first(sp.brandId),
    concentration: parseEnumParam(first(sp.concentration), concentrationSchema.options),
    scentFamily: parseEnumParam(first(sp.scentFamily), scentFamilySchema.options),
    size: parseEnumParam(first(sp.size), sizeSchema.options),
    badge: parseEnumParam(first(sp.badge), badgeSchema.options),
    minPrice: first(sp.minPrice),
    maxPrice: first(sp.maxPrice),
    page: first(sp.page),
  };
}
