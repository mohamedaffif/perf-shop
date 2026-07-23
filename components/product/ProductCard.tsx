"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn, formatPrice } from "@/lib/utils";
import type { Product } from "@/domain/product/product.types";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ProductDetailsDialog } from "@/components/product/ProductDetailsDialog";
import { BADGE_META } from "@/components/product/product-meta";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product, active: boolean) => void;
}

export function ProductCard({ product, onAddToCart, onToggleWishlist }: ProductCardProps) {
  const [fav, setFav] = useState(false);

  const image = product.images.find((img) => img.isPrimary) ?? product.images[0];
  const primaryBadge = product.badges[0];
  const lowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;
  const outOfStock = product.stockQuantity <= 0;

  function handleToggleFav() {
    const next = !fav;
    setFav(next);
    onToggleWishlist?.(product, next);
  }

  return (
    <Card className="bg-background ring-primary/40 hover:shadow-card-hover flex flex-col gap-0 overflow-hidden rounded-2xl py-0 ring-1 transition-shadow duration-200">
      <div className="bg-muted relative aspect-4/3">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText ?? `${product.brand.name} ${product.name}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
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

        <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {primaryBadge ? (
            <Badge className="rounded-full">{BADGE_META[primaryBadge].label}</Badge>
          ) : null}
          {outOfStock ? (
            <Badge variant="destructive" className="rounded-full">
              Out of Stock
            </Badge>
          ) : lowStock ? (
            <Badge variant="warning" className="rounded-full">
              Only {product.stockQuantity} left
            </Badge>
          ) : null}
        </div>

        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={handleToggleFav}
          aria-label="Toggle wishlist"
          className="bg-background/70 hover:bg-background/90 absolute top-2.5 right-2.5 rounded-full backdrop-blur-sm"
        >
          <Heart
            className={cn(
              "transition-colors",
              fav ? "fill-primary text-primary" : "text-muted-foreground"
            )}
          />
        </Button>
      </div>

      <div className="flex flex-1 flex-col gap-3.5 p-6">
        <div>
          <p className="text-primary text-xs font-semibold tracking-wider uppercase">
            {product.brand.name}
          </p>
          <h3 className="font-heading text-foreground text-2xl">{product.name}</h3>
        </div>

        <span className="font-heading text-foreground text-xl font-semibold">
          {formatPrice(product.price)}
        </span>

        <div className="mt-auto flex flex-col gap-2.5 pt-0.5">
          <AddToCartButton product={product} onAddToCart={onAddToCart} className="w-full" />
          <ProductDetailsDialog product={product} onAddToCart={onAddToCart} />
        </div>
      </div>
    </Card>
  );
}
