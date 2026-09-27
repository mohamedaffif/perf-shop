"use client";

import { Button } from "@/components/ui/button";
import { useQueryParamFilter } from "@/hooks/useQueryParamFilter";
import { EMPTY_FILTER_VALUES, filterValuesToParams } from "@/lib/shop-filters";

// Used by the empty state; doesn't need brand labels, so skips useShopFilters.
export function ClearFiltersButton() {
  const { setParams } = useQueryParamFilter();

  return (
    <Button variant="outline" onClick={() => setParams(filterValuesToParams(EMPTY_FILTER_VALUES))}>
      Clear filters
    </Button>
  );
}
