"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Check,
  Crown,
  Droplet,
  FlaskConical,
  Gem,
  Heart,
  Leaf,
  Sparkles,
  ShoppingCart,
  Tag as TagIcon,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn, formatPrice } from "@/lib/utils";
import type {
  Badge as ProductBadge,
  Concentration,
  Product,
  Size,
} from "@/domain/product/product.types";
import { useCart } from "@/hooks/useCart";
import { usePulse } from "@/hooks/usePulse";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product, active: boolean) => void;
}

const SIZE_LABELS: Record<Size, string> = {
  ML_50: "50ML",
  ML_75: "75ML",
  ML_100: "100ML",
};

const CONCENTRATION_LABELS: Record<Concentration, { oil: string; longevity: string }> = {
  EXTRAIT_DE_PARFUM: { oil: "20-30% Oil", longevity: "Long Lasting" },
  EAU_DE_PARFUM: { oil: "15-20% Oil", longevity: "Long Lasting" },
  EAU_DE_TOILETTE: { oil: "5-15% Oil", longevity: "Moderate" },
  EAU_DE_COLOGNE: { oil: "2-4% Oil", longevity: "Light" },
  EAU_FRAICHE: { oil: "1-3% Oil", longevity: "Light" },
};

const BADGE_META: Record<ProductBadge, { icon: LucideIcon; label: string }> = {
  NEW: { icon: Sparkles, label: "New" },
  BEST_SELLER: { icon: Crown, label: "Best Seller" },
  LIMITED_EDITION: { icon: Gem, label: "Limited Edition" },
  SALE: { icon: TagIcon, label: "Sale" },
};

export function ProductCard({ product, onAddToCart, onToggleWishlist }: ProductCardProps) {
  const [fav, setFav] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const addButtonRef = usePulse<HTMLButtonElement>([added], {
    from: 0.94,
    shouldPulse: () => added,
  });

  const image = product.images.find((img) => img.isPrimary) ?? product.images[0];
  const notes = [...product.topNotes, ...product.heartNotes, ...product.baseNotes]
    .slice(0, 4)
    .join(", ");
  const { oil, longevity } = CONCENTRATION_LABELS[product.concentration];
  const primaryBadge = product.badges[0];

  function handleToggleFav() {
    const next = !fav;
    setFav(next);
    onToggleWishlist?.(product, next);
  }

  function handleAddToCart() {
    setAdded(true);
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      addToCart(product);
    }
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <Card className="flex flex-col gap-0 overflow-hidden rounded-2xl bg-background py-0 ring-1 ring-primary/40 transition-shadow duration-200 hover:shadow-card-hover">
      <div className="relative aspect-4/3 bg-muted">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText ?? `${product.brand.name} ${product.name}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
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

        {primaryBadge ? (
          <Badge className="absolute top-3 left-3 rounded-full">
            {BADGE_META[primaryBadge].label}
          </Badge>
        ) : null}

        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={handleToggleFav}
          aria-label="Toggle wishlist"
          className="absolute top-2.5 right-2.5 rounded-full bg-background/70 backdrop-blur-sm hover:bg-background/90"
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
          <p className="text-xs font-semibold tracking-wider text-primary uppercase">
            {product.brand.name}
          </p>
          <h3 className="font-heading text-2xl text-foreground">{product.name}</h3>
        </div>

        {notes ? <p className="text-sm leading-relaxed text-muted-foreground">{notes}</p> : null}

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

        <div className="flex flex-col gap-2.5 pt-0.5">
          <Button
            ref={addButtonRef}
            type="button"
            variant="secondary"
            onClick={handleAddToCart}
            className="w-full gap-1.5"
          >
            {added ? (
              <>
                <Check className="size-3.5" />
                Added
              </>
            ) : (
              <>
                <ShoppingCart className="size-3.5" />
                Add to Cart
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full border-primary/60 text-primary hover:bg-primary/10"
          >
            View Details
          </Button>
        </div>

        {product.badges.length > 0 ? (
          <div className="mt-auto flex flex-wrap gap-2.5 pt-1">
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
      </div>
    </Card>
  );
}
