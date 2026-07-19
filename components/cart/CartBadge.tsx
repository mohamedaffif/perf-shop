"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { usePulse } from "@/hooks/usePulse";
import { DURATION_SLOW } from "@/lib/motion";

export function CartBadge() {
  const { count } = useCart();
  const [mountedAt] = useState(() => Date.now());

  // Skip changes right after mount so redux-persist rehydrating a saved
  // cart doesn't pulse the badge — only real user actions should.
  const badgeRef = usePulse<HTMLSpanElement>([count], {
    from: 1.4,
    duration: DURATION_SLOW,
    shouldPulse: () => Date.now() - mountedAt >= 500,
  });

  if (count === 0) return null;

  return (
    <Badge
      ref={badgeRef}
      className="text-overline absolute -top-1 -right-1 size-4 justify-center rounded-full p-0"
    >
      {count}
    </Badge>
  );
}
