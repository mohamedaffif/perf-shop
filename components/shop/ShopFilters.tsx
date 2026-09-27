import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { MobileFilterDrawer } from "@/components/shop/MobileFilterDrawer";
import type { Brand } from "@/domain/brand/brand.types";

interface ShopFiltersProps {
  brands: Brand[];
  total: number;
}

// Desktop sidebar (lg+) and the sticky mobile filter bar + drawer (< lg).
export function ShopFilters({ brands, total }: ShopFiltersProps) {
  return (
    <>
      <FilterSidebar brands={brands} />
      <MobileFilterDrawer brands={brands} total={total} />
    </>
  );
}
