"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import { FilterPillGroup } from "@/components/shop/FilterPillGroup";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Typography } from "@/components/ui/typography";
import type { Brand } from "@/domain/brand/brand.types";
import { useShopFilters } from "@/hooks/useShopFilters";
import { EMPTY_FILTER_VALUES, countActiveFilters, type FilterValues } from "@/lib/shop-filters";

interface MobileFilterDrawerProps {
  brands: Brand[];
  total: number;
}

export function MobileFilterDrawer({ brands, total }: MobileFilterDrawerProps) {
  const { defs, values, activeCount, apply } = useShopFilters(brands);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<FilterValues>(values);

  function handleOpenChange(next: boolean) {
    // Seed from the URL only on open, so in-progress picks aren't overwritten
    // and a swipe-to-close discards them.
    if (next) setDraft(values);
    setOpen(next);
  }

  function handleApply() {
    apply(draft);
    setOpen(false);
  }

  const draftCount = countActiveFilters(draft);

  return (
    <div className="border-border bg-background/95 supports-backdrop-filter:bg-background/80 top-navbar-h sticky z-30 -mx-4 flex items-center justify-between gap-4 border-b px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:hidden">
      <Typography variant="body-small" className="text-muted-foreground tabular-nums">
        {total} {total === 1 ? "fragrance" : "fragrances"}
      </Typography>

      <Drawer open={open} onOpenChange={handleOpenChange}>
        <DrawerTrigger asChild>
          <Button variant="outline" size="lg">
            <SlidersHorizontal />
            Filters
            {activeCount > 0 && (
              <Badge variant="secondary" className="tabular-nums">
                {activeCount}
              </Badge>
            )}
          </Button>
        </DrawerTrigger>

        <DrawerContent className="px-0 pb-0">
          <DrawerHeader className="px-card-padding">
            <DrawerTitle>Filters</DrawerTitle>
            <DrawerDescription>Narrow down fragrances, then show results.</DrawerDescription>
          </DrawerHeader>

          <div className="px-card-padding flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto overscroll-contain pb-4">
            {defs.map(({ id, label, options }) => (
              <FilterPillGroup
                key={id}
                label={label}
                options={options}
                value={draft[id]}
                onValueChange={(value) => setDraft((prev) => ({ ...prev, [id]: value }))}
              />
            ))}
          </div>

          <DrawerFooter className="border-border px-card-padding flex-row border-t py-4">
            <Button
              variant="ghost"
              size="lg"
              className="flex-1"
              disabled={draftCount === 0}
              onClick={() => setDraft(EMPTY_FILTER_VALUES)}
            >
              Clear all
            </Button>
            <Button variant="secondary" size="lg" className="flex-1" onClick={handleApply}>
              Show results
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
