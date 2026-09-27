"use client";

import { FilterDropdown } from "@/components/shop/FilterDropdown";
import type { Brand } from "@/domain/brand/brand.types";
import { useShopFilters } from "@/hooks/useShopFilters";

interface FilterSidebarProps {
  brands: Brand[];
}

export function FilterSidebar({ brands }: FilterSidebarProps) {
  const { defs, values, setOne } = useShopFilters(brands);

  return (
    <aside className="hidden w-60 shrink-0 flex-col gap-6 lg:flex">
      {defs.map(({ id, ...filter }) => (
        <FilterDropdown
          key={id}
          {...filter}
          value={values[id]}
          onValueChange={(value) => setOne(id, value)}
        />
      ))}
    </aside>
  );
}
