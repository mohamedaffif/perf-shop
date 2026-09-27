"use client";

import { useMemo } from "react";

import type { Brand } from "@/domain/brand/brand.types";
import { useQueryParamFilter } from "@/hooks/useQueryParamFilter";
import {
  ALL_VALUE,
  EMPTY_FILTER_VALUES,
  buildShopFilterDefs,
  countActiveFilters,
  filterValuesToParams,
  readFilterValues,
  type FilterId,
  type FilterValues,
} from "@/lib/shop-filters";

// Everything is derived from the URL on each render (no copied state), so
// browser Back/Forward keeps desktop selects, chips and counts in sync.
export function useShopFilters(brands: Pick<Brand, "id" | "name">[]) {
  const { searchParams, setParams } = useQueryParamFilter();

  const defs = useMemo(() => buildShopFilterDefs(brands), [brands]);
  const values = readFilterValues(searchParams);

  function apply(next: FilterValues) {
    setParams(filterValuesToParams(next));
  }

  return {
    defs,
    values,
    activeCount: countActiveFilters(values),
    apply,
    setOne: (id: FilterId, value: string) => apply({ ...values, [id]: value }),
    clearOne: (id: FilterId) => apply({ ...values, [id]: ALL_VALUE }),
    clearAll: () => apply(EMPTY_FILTER_VALUES),
  };
}
