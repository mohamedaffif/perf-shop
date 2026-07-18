"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Typography } from "@/components/ui/typography";
import type { Brand } from "@/domain/brand/brand.types";
import type { Badge, Concentration, ScentFamily, Size } from "@/domain/product/product.types";

interface FilterSidebarProps {
  brands: Brand[];
}

const ALL_VALUE = "all";

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

const PRICE_BUCKETS = [
  { id: "under-40000", label: "Under KES 40,000", min: undefined, max: "40000" },
  { id: "40000-55000", label: "KES 40,000 – 55,000", min: "40000", max: "55000" },
  { id: "55000-65000", label: "KES 55,000 – 65,000", min: "55000", max: "65000" },
  { id: "over-65000", label: "Over KES 65,000", min: "65000", max: undefined },
] as const;

function currentPriceBucketId(minPrice: string | null, maxPrice: string | null): string {
  const match = PRICE_BUCKETS.find(
    (bucket) => (bucket.min ?? null) === minPrice && (bucket.max ?? null) === maxPrice
  );
  return match?.id ?? ALL_VALUE;
}

export function FilterSidebar({ brands }: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value === ALL_VALUE) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page");

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function setPriceBucket(bucketId: string) {
    const params = new URLSearchParams(searchParams.toString());
    const bucket = PRICE_BUCKETS.find((b) => b.id === bucketId);

    params.delete("minPrice");
    params.delete("maxPrice");
    if (bucket?.min) params.set("minPrice", bucket.min);
    if (bucket?.max) params.set("maxPrice", bucket.max);
    params.delete("page");

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
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
