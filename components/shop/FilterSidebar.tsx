"use client";

import { FilterDropdown } from "@/components/shop/FilterDropdown";
import type { Brand } from "@/domain/brand/brand.types";
import type { Badge, Concentration, ScentFamily, Size } from "@/domain/product/product.types";
import { useQueryParamFilter } from "@/hooks/useQueryParamFilter";
import { ALL_VALUE, PRICE_BUCKETS, currentPriceBucketId } from "@/lib/shop-filters";

interface FilterSidebarProps {
  brands: Brand[];
}

const CONCENTRATION_OPTIONS: { value: Concentration; label: string }[] = [
  { value: "EXTRAIT_DE_PARFUM", label: "Extrait de Parfum" },
  { value: "EAU_DE_PARFUM", label: "Eau de Parfum" },
  { value: "EAU_DE_TOILETTE", label: "Eau de Toilette" },
  { value: "EAU_DE_COLOGNE", label: "Eau de Cologne" },
  { value: "EAU_FRAICHE", label: "Eau Fraîche" },
];

const SCENT_FAMILY_OPTIONS: { value: ScentFamily; label: string }[] = [
  { value: "FLORAL", label: "Floral" },
  { value: "ORIENTAL", label: "Oriental" },
  { value: "FRESH", label: "Fresh" },
  { value: "WOODY", label: "Woody" },
  { value: "AROMATIC", label: "Aromatic" },
  { value: "CITRUS", label: "Citrus" },
  { value: "SPICY", label: "Spicy" },
];

const SIZE_OPTIONS: { value: Size; label: string }[] = [
  { value: "ML_50", label: "50ML" },
  { value: "ML_75", label: "75ML" },
  { value: "ML_100", label: "100ML" },
];

const BADGE_OPTIONS: { value: Badge; label: string }[] = [
  { value: "NEW", label: "New" },
  { value: "BEST_SELLER", label: "Best Seller" },
  { value: "LIMITED_EDITION", label: "Limited Edition" },
  { value: "SALE", label: "Sale" },
];

export function FilterSidebar({ brands }: FilterSidebarProps) {
  const { searchParams, setParam, setParams } = useQueryParamFilter();

  function setPriceBucket(bucketId: string) {
    const bucket = PRICE_BUCKETS.find((b) => b.id === bucketId);
    setParams({ minPrice: bucket?.min, maxPrice: bucket?.max });
  }

  const filters = [
    {
      id: "brandId",
      label: "Brand",
      allLabel: "All Brands",
      value: searchParams.get("brandId") ?? ALL_VALUE,
      onValueChange: (value: string) => setParam("brandId", value),
      options: brands.map((brand) => ({ value: brand.id, label: brand.name })),
    },
    {
      id: "price",
      label: "Price",
      allLabel: "All Prices",
      value: currentPriceBucketId(searchParams.get("minPrice"), searchParams.get("maxPrice")),
      onValueChange: setPriceBucket,
      options: PRICE_BUCKETS.map((bucket) => ({ value: bucket.id, label: bucket.label })),
    },
    {
      id: "concentration",
      label: "Concentration",
      allLabel: "All",
      value: searchParams.get("concentration") ?? ALL_VALUE,
      onValueChange: (value: string) => setParam("concentration", value),
      options: CONCENTRATION_OPTIONS,
    },
    {
      id: "scentFamily",
      label: "Family",
      allLabel: "All",
      value: searchParams.get("scentFamily") ?? ALL_VALUE,
      onValueChange: (value: string) => setParam("scentFamily", value),
      options: SCENT_FAMILY_OPTIONS,
    },
    {
      id: "size",
      label: "Size",
      allLabel: "All Sizes",
      value: searchParams.get("size") ?? ALL_VALUE,
      onValueChange: (value: string) => setParam("size", value),
      options: SIZE_OPTIONS,
    },
    {
      id: "badge",
      label: "Badge",
      allLabel: "All",
      value: searchParams.get("badge") ?? ALL_VALUE,
      onValueChange: (value: string) => setParam("badge", value),
      options: BADGE_OPTIONS,
    },
  ];

  return (
    <aside className="flex w-full flex-col gap-6 lg:w-60 lg:shrink-0">
      {filters.map(({ id, ...filter }) => (
        <FilterDropdown key={id} {...filter} />
      ))}
    </aside>
  );
}
