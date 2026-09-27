import {
  badgeSchema,
  concentrationSchema,
  scentFamilySchema,
  sizeSchema,
} from "@/domain/product/product.validator";
import { isOneOf } from "@/lib/type-guards";
import type { Brand } from "@/domain/brand/brand.types";
import type { Badge, Concentration, ScentFamily, Size } from "@/domain/product/product.types";

export const ALL_VALUE = "all";

export const CONCENTRATION_OPTIONS: { value: Concentration; label: string }[] = [
  { value: "EXTRAIT_DE_PARFUM", label: "Extrait de Parfum" },
  { value: "EAU_DE_PARFUM", label: "Eau de Parfum" },
  { value: "EAU_DE_TOILETTE", label: "Eau de Toilette" },
  { value: "EAU_DE_COLOGNE", label: "Eau de Cologne" },
  { value: "EAU_FRAICHE", label: "Eau Fraîche" },
];

export const SCENT_FAMILY_OPTIONS: { value: ScentFamily; label: string }[] = [
  { value: "FLORAL", label: "Floral" },
  { value: "ORIENTAL", label: "Oriental" },
  { value: "FRESH", label: "Fresh" },
  { value: "WOODY", label: "Woody" },
  { value: "AROMATIC", label: "Aromatic" },
  { value: "CITRUS", label: "Citrus" },
  { value: "SPICY", label: "Spicy" },
];

export const SIZE_OPTIONS: { value: Size; label: string }[] = [
  { value: "ML_50", label: "50ML" },
  { value: "ML_75", label: "75ML" },
  { value: "ML_100", label: "100ML" },
];

export const BADGE_OPTIONS: { value: Badge; label: string }[] = [
  { value: "NEW", label: "New" },
  { value: "BEST_SELLER", label: "Best Seller" },
  { value: "LIMITED_EDITION", label: "Limited Edition" },
  { value: "SALE", label: "Sale" },
];

export const FILTER_IDS = [
  "brandId",
  "price",
  "concentration",
  "scentFamily",
  "size",
  "badge",
] as const;

export type FilterId = (typeof FILTER_IDS)[number];

// UI-level filter values, keyed by filter id. Price holds a PRICE_BUCKETS id,
// not raw min/max — it's only expanded to URL params in filterValuesToParams().
export type FilterValues = Record<FilterId, string>;

export interface ShopFilterDef {
  id: FilterId;
  label: string;
  allLabel: string;
  options: { value: string; label: string }[];
}

export function buildShopFilterDefs(brands: Pick<Brand, "id" | "name">[]): ShopFilterDef[] {
  return [
    {
      id: "brandId",
      label: "Brand",
      allLabel: "All Brands",
      options: brands.map((brand) => ({ value: brand.id, label: brand.name })),
    },
    {
      id: "price",
      label: "Price",
      allLabel: "All Prices",
      options: PRICE_BUCKETS.map((bucket) => ({ value: bucket.id, label: bucket.label })),
    },
    { id: "concentration", label: "Concentration", allLabel: "All", options: CONCENTRATION_OPTIONS },
    { id: "scentFamily", label: "Family", allLabel: "All", options: SCENT_FAMILY_OPTIONS },
    { id: "size", label: "Size", allLabel: "All Sizes", options: SIZE_OPTIONS },
    { id: "badge", label: "Badge", allLabel: "All", options: BADGE_OPTIONS },
  ];
}

export const EMPTY_FILTER_VALUES: FilterValues = Object.fromEntries(
  FILTER_IDS.map((id) => [id, ALL_VALUE])
) as FilterValues;

export function readFilterValues(searchParams: { get(key: string): string | null }): FilterValues {
  const values = { ...EMPTY_FILTER_VALUES };
  for (const id of FILTER_IDS) {
    values[id] =
      id === "price"
        ? currentPriceBucketId(searchParams.get("minPrice"), searchParams.get("maxPrice"))
        : (searchParams.get(id) ?? ALL_VALUE);
  }
  return values;
}

export function filterValuesToParams(values: FilterValues): Record<string, string | undefined> {
  const params: Record<string, string | undefined> = {};
  for (const id of FILTER_IDS) {
    if (id === "price") {
      const bucket = PRICE_BUCKETS.find((b) => b.id === values.price);
      params.minPrice = bucket?.min;
      params.maxPrice = bucket?.max;
    } else {
      params[id] = values[id] === ALL_VALUE ? undefined : values[id];
    }
  }
  return params;
}

// Counts filter ids, not URL params — a price bucket is one filter.
export function countActiveFilters(values: FilterValues): number {
  return FILTER_IDS.filter((id) => values[id] !== ALL_VALUE).length;
}

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
