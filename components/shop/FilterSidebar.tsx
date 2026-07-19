"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Typography } from "@/components/ui/typography";
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

  return (
    <aside className="flex w-full flex-col gap-8 lg:w-60 lg:shrink-0">
      <div className="flex flex-col gap-3">
        <Typography variant="h6">Brand</Typography>
        <RadioGroup
          value={searchParams.get("brandId") ?? ALL_VALUE}
          onValueChange={(value) => setParam("brandId", value)}
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value={ALL_VALUE} id="brand-all" />
            <Label htmlFor="brand-all">All Brands</Label>
          </div>
          {brands.map((brand) => (
            <div key={brand.id} className="flex items-center gap-2">
              <RadioGroupItem value={brand.id} id={`brand-${brand.id}`} />
              <Label htmlFor={`brand-${brand.id}`}>{brand.name}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="flex flex-col gap-3">
        <Typography variant="h6">Price</Typography>
        <RadioGroup
          value={currentPriceBucketId(searchParams.get("minPrice"), searchParams.get("maxPrice"))}
          onValueChange={setPriceBucket}
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value={ALL_VALUE} id="price-all" />
            <Label htmlFor="price-all">All Prices</Label>
          </div>
          {PRICE_BUCKETS.map((bucket) => (
            <div key={bucket.id} className="flex items-center gap-2">
              <RadioGroupItem value={bucket.id} id={`price-${bucket.id}`} />
              <Label htmlFor={`price-${bucket.id}`}>{bucket.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="flex flex-col gap-3">
        <Typography variant="h6">Concentration</Typography>
        <RadioGroup
          value={searchParams.get("concentration") ?? ALL_VALUE}
          onValueChange={(value) => setParam("concentration", value)}
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value={ALL_VALUE} id="concentration-all" />
            <Label htmlFor="concentration-all">All</Label>
          </div>
          {CONCENTRATION_OPTIONS.map((option) => (
            <div key={option.value} className="flex items-center gap-2">
              <RadioGroupItem value={option.value} id={`concentration-${option.value}`} />
              <Label htmlFor={`concentration-${option.value}`}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="flex flex-col gap-3">
        <Typography variant="h6">Family</Typography>
        <RadioGroup
          value={searchParams.get("scentFamily") ?? ALL_VALUE}
          onValueChange={(value) => setParam("scentFamily", value)}
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value={ALL_VALUE} id="scentFamily-all" />
            <Label htmlFor="scentFamily-all">All</Label>
          </div>
          {SCENT_FAMILY_OPTIONS.map((option) => (
            <div key={option.value} className="flex items-center gap-2">
              <RadioGroupItem value={option.value} id={`scentFamily-${option.value}`} />
              <Label htmlFor={`scentFamily-${option.value}`}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="flex flex-col gap-3">
        <Typography variant="h6">Size</Typography>
        <RadioGroup
          value={searchParams.get("size") ?? ALL_VALUE}
          onValueChange={(value) => setParam("size", value)}
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value={ALL_VALUE} id="size-all" />
            <Label htmlFor="size-all">All Sizes</Label>
          </div>
          {SIZE_OPTIONS.map((option) => (
            <div key={option.value} className="flex items-center gap-2">
              <RadioGroupItem value={option.value} id={`size-${option.value}`} />
              <Label htmlFor={`size-${option.value}`}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="flex flex-col gap-3">
        <Typography variant="h6">Badge</Typography>
        <RadioGroup
          value={searchParams.get("badge") ?? ALL_VALUE}
          onValueChange={(value) => setParam("badge", value)}
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value={ALL_VALUE} id="badge-all" />
            <Label htmlFor="badge-all">All</Label>
          </div>
          {BADGE_OPTIONS.map((option) => (
            <div key={option.value} className="flex items-center gap-2">
              <RadioGroupItem value={option.value} id={`badge-${option.value}`} />
              <Label htmlFor={`badge-${option.value}`}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </aside>
  );
}
