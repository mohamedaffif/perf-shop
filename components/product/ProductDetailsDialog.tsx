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
          className="border-primary/60 text-primary hover:bg-primary/10 w-full"
        >
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <p className="text-primary text-xs font-semibold tracking-wider uppercase">
            {product.brand.name}
          </p>
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>{product.description ?? `${longevity} · ${oil}`}</DialogDescription>
        </DialogHeader>

        <div className="bg-muted relative aspect-4/3 overflow-hidden rounded-lg">
          {image ? (
            <Image
              src={image.url}
              alt={image.altText ?? `${product.brand.name} ${product.name}`}
              fill
              sizes="(max-width: 640px) 100vw, 640px"
              className="object-cover"
            />
          ) : (
            <div className="text-muted-foreground/60 flex h-full w-full flex-col items-center justify-center gap-2">
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
          <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>
        ) : null}

        {noteGroups.length > 0 ? (
          <div className="flex flex-col gap-2">
            {noteGroups.map(({ label, notes }) => (
              <p key={label} className="text-muted-foreground text-sm leading-relaxed">
                <span className="text-foreground font-semibold">{label}: </span>
                {notes.join(", ")}
              </p>
            ))}
          </div>
        ) : null}

        <div className="border-border border-t" />

        <div className="grid grid-cols-3">
          <div className="border-border flex flex-col items-center gap-2 border-r px-1.5">
            <FlaskConical className="text-primary size-4.5" />
            <span className="text-muted-foreground text-center text-[10px] font-semibold tracking-wide uppercase">
              {SIZE_LABELS[product.size]}
            </span>
          </div>
          <div className="border-border flex flex-col items-center gap-2 border-r px-1.5">
            <Leaf className="text-primary size-4.5" />
            <span className="text-muted-foreground text-center text-[10px] font-semibold tracking-wide uppercase">
              {longevity}
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 px-1.5">
            <Droplet className="text-primary size-4.5" />
            <span className="text-muted-foreground text-center text-[10px] font-semibold tracking-wide uppercase">
              {oil}
            </span>
          </div>
        </div>

        <div className="border-border border-t" />

        <span className="font-heading text-foreground text-xl font-semibold">
          {formatPrice(product.price)}
        </span>

        {product.badges.length > 0 ? (
          <div className="flex flex-wrap gap-2.5">
            {product.badges.map((badge) => {
              const { icon: Icon, label } = BADGE_META[badge];
              return (
                <div
                  key={badge}
                  className="border-primary/40 flex items-center gap-1.5 rounded-lg border px-3 py-2"
                >
                  <Icon className="text-primary size-3.5" />
                  <span className="text-foreground text-[10px] font-semibold tracking-wide uppercase">
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
