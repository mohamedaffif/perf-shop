"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { DURATION_NORMAL, EASE_EMPHASIZED, prefersReducedMotion } from "@/lib/motion";

interface UsePulseOptions {
  from?: number;
  duration?: number;
  shouldPulse?: () => boolean;
}

export function usePulse<T extends HTMLElement>(
  dependencies: unknown[],
  { from = 1.3, duration = DURATION_NORMAL, shouldPulse }: UsePulseOptions = {}
) {
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion()) return;
      if (shouldPulse && !shouldPulse()) return;
      gsap.fromTo(ref.current, { scale: from }, { scale: 1, duration, ease: EASE_EMPHASIZED });
    },
    { dependencies }
  );

  return ref;
}
