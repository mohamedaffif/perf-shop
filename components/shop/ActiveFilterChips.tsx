"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Brand } from "@/domain/brand/brand.types";
import { useShopFilters } from "@/hooks/useShopFilters";
import { ALL_VALUE } from "@/lib/shop-filters";

interface ActiveFilterChipsProps {
  brands: Brand[];
}

export function ActiveFilterChips({ brands }: ActiveFilterChipsProps) {
  const { defs, values, activeCount, clearOne, clearAll } = useShopFilters(brands);

  if (activeCount === 0) return null;

  const chips = defs.flatMap((def) => {
    const value = values[def.id];
    if (value === ALL_VALUE) return [];
    const option = def.options.find((o) => o.value === value);
    return [{ id: def.id, label: option?.label ?? value, filterLabel: def.label }];
  });

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <Button
          key={chip.id}
          variant="outline"
          size="sm"
          onClick={() => clearOne(chip.id)}
          aria-label={`Remove ${chip.filterLabel} filter: ${chip.label}`}
          className="font-medium"
        >
          {chip.label}
          <X data-icon="inline-end" />
        </Button>
      ))}
      {activeCount > 1 && (
        <Button variant="link" size="sm" onClick={clearAll} className="underline">
          Clear all
        </Button>
      )}
    </div>
  );
}
