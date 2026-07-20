"use client";

import Image from "next/image";
import { Droplet, FlaskConical, Leaf } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/domain/product/product.types";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { BADGE_META, CONCENTRATION_LABELS, SIZE_LABELS } from "@/components/product/product-meta";

interface ProductDetailsDialogProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductDetailsDialog({ product, onAddToCart }: ProductDetailsDialogProps) {
  const image = product.images.find((img) => img.isPrimary) ?? product.images[0];
  const { oil, longevity } = CONCENTRATION_LABELS[product.concentration];

  const noteGroups = [
    { label: "Top Notes", notes: product.topNotes },
    { label: "Heart Notes", notes: product.heartNotes },
    { label: "Base Notes", notes: product.baseNotes },
  ].filter((group) => group.notes.length > 0);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full border-primary/60 text-primary hover:bg-primary/10"
        >
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <p className="text-xs font-semibold tracking-wider text-primary uppercase">
            {product.brand.name}
          </p>
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>
            {product.description ?? `${longevity} · ${oil}`}
          </DialogDescription>
        </DialogHeader>

        <div className="relative aspect-4/3 overflow-hidden rounded-lg bg-muted">
          {image ? (
            <Image
              src={image.url}
              alt={image.altText ?? `${product.brand.name} ${product.name}`}
              fill
              sizes="(max-width: 640px) 100vw, 640px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground/60">
              <svg
                width="40"
                height="70"
                viewBox="0 0 52 90"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              >
                <rect x="20" y="2" width="12" height="12" rx="2" />
                <rect x="17" y="14" width="18" height="8" />
                <rect x="8" y="22" width="36" height="62" rx="6" />
              </svg>
              <span className="font-mono text-[10px] tracking-wide uppercase">bottle shot</span>
            </div>
          )}
        </div>

        {product.description ? (
          <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>
        ) : null}

        {noteGroups.length > 0 ? (
          <div className="flex flex-col gap-2">
            {noteGroups.map(({ label, notes }) => (
              <p key={label} className="text-sm leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">{label}: </span>
                {notes.join(", ")}
              </p>
            ))}
          </div>
        ) : null}

        <div className="border-t border-border" />

        <div className="grid grid-cols-3">
          <div className="flex flex-col items-center gap-2 border-r border-border px-1.5">
            <FlaskConical className="size-4.5 text-primary" />
            <span className="text-center text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
              {SIZE_LABELS[product.size]}
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 border-r border-border px-1.5">
            <Leaf className="size-4.5 text-primary" />
            <span className="text-center text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
              {longevity}
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 px-1.5">
            <Droplet className="size-4.5 text-primary" />
            <span className="text-center text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
              {oil}
            </span>
          </div>
        </div>

        <div className="border-t border-border" />

        <span className="font-heading text-xl font-semibold text-foreground">
          {formatPrice(product.price)}
        </span>

        {product.badges.length > 0 ? (
          <div className="flex flex-wrap gap-2.5">
            {product.badges.map((badge) => {
              const { icon: Icon, label } = BADGE_META[badge];
              return (
                <div
                  key={badge}
                  className="flex items-center gap-1.5 rounded-lg border border-primary/40 px-3 py-2"
                >
                  <Icon className="size-3.5 text-primary" />
                  <span className="text-[10px] font-semibold tracking-wide text-foreground uppercase">
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        ) : null}

        <AddToCartButton product={product} onAddToCart={onAddToCart} size="lg" className="w-full" />
      </DialogContent>
    </Dialog>
  );
}
