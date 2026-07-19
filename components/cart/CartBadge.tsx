"use client";

import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";

export function CartBadge() {
  const { count } = useCart();

  if (count === 0) return null;

  return (
    <Badge className="text-overline absolute -top-1 -right-1 size-4 justify-center rounded-full p-0">
      {count}
    </Badge>
  );
}
