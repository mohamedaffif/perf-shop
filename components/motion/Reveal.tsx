"use client";

import * as React from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { useInView } from "@/hooks/useInView";
import {
  DURATION_NORMAL,
  DURATION_SLOW,
  EASE_EMPHASIZED,
  prefersReducedMotion,
} from "@/lib/motion";

interface RevealProps {
  children: React.ReactNode;
  stagger?: boolean;
  y?: number;
  className?: string;
}

export function Reveal({ children, stagger = false, y = 24, className }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });

  useGSAP(
    () => {
      if (!ref.current || !inView) return;

      const targets = stagger ? gsap.utils.selector(ref)(":scope > *") : ref.current;

      if (prefersReducedMotion()) {
        gsap.set(targets, { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: stagger ? DURATION_SLOW : DURATION_NORMAL,
          ease: EASE_EMPHASIZED,
          stagger: stagger ? 0.08 : 0,
        }
      );
    },
    { scope: ref, dependencies: [inView] }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
