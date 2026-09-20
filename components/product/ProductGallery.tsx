"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import type { Product } from "@/domain/product/product.types";

interface ProductGalleryProps {
  images: Product["images"];
  brandName: string;
  productName: string;
}

function BottlePlaceholder() {
  return (
    <div className="text-muted-foreground/60 flex h-full w-full flex-col items-center justify-center gap-2">
      <svg
        width="40"
        height="70"
        viewBox="0 0 52 90"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="20" y="2" width="12" height="12" rx="2" />
        <rect x="17" y="14" width="18" height="8" />
        <rect x="8" y="22" width="36" height="62" rx="6" />
      </svg>
      <span className="font-mono text-[10px] tracking-wide uppercase">bottle shot</span>
    </div>
  );
}

export function ProductGallery({ images, brandName, productName }: ProductGalleryProps) {
  const sorted = useMemo(() => [...images].sort((a, b) => a.order - b.order), [images]);
  const [index, setIndex] = useState(() =>
    Math.max(
      0,
      sorted.findIndex((img) => img.isPrimary)
    )
  );

  const active = sorted[index];
  const alt = active?.altText ?? `${brandName} ${productName}`;

  function move(delta: number) {
    setIndex((current) => Math.min(sorted.length - 1, Math.max(0, current + delta)));
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-muted rounded-image relative aspect-4/3 overflow-hidden">
        {active ? (
          <Image
            key={active.publicId}
            src={active.url}
            alt={alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        ) : (
          <BottlePlaceholder />
        )}
      </div>

      {sorted.length > 1 ? (
        <div
          role="tablist"
          aria-label="Product images"
          className="flex flex-wrap gap-2"
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") move(1);
            if (event.key === "ArrowLeft") move(-1);
          }}
        >
          {sorted.map((img, i) => (
            <button
              key={img.publicId}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show image ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                "bg-muted rounded-image relative size-16 shrink-0 overflow-hidden ring-1 transition-shadow sm:size-20",
                i === index ? "ring-primary ring-2" : "ring-border hover:ring-primary/40"
              )}
            >
              <Image
                src={img.url}
                alt={img.altText ?? `${brandName} ${productName} thumbnail ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
