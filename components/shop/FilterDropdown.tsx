"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Typography } from "@/components/ui/typography";
import { ALL_VALUE } from "@/lib/shop-filters";

interface FilterDropdownProps {
  label: string;
  allLabel: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
}

export function FilterDropdown({
  label,
  allLabel,
  value,
  onValueChange,
  options,
}: FilterDropdownProps) {
  return (
    <div className="flex flex-col gap-2">
      <Typography variant="h6">{label}</Typography>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>{allLabel}</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
