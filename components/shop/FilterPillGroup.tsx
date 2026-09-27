"use client";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { ALL_VALUE } from "@/lib/shop-filters";
import { cn } from "@/lib/utils";

interface FilterPillGroupProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
}

// Single-select pill list: tap to choose, tap the selected pill again to clear.
export function FilterPillGroup({ label, value, onValueChange, options }: FilterPillGroupProps) {
  return (
    <fieldset className="flex flex-col gap-3">
      <Typography variant="h6" asChild>
        <legend>{label}</legend>
      </Typography>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <Button
              key={option.value}
              type="button"
              size="lg"
              variant={selected ? "secondary" : "outline"}
              aria-pressed={selected}
              onClick={() => onValueChange(selected ? ALL_VALUE : option.value)}
              className={cn("font-medium", selected && "shadow-sm")}
            >
              {option.label}
            </Button>
          );
        })}
      </div>
    </fieldset>
  );
}
