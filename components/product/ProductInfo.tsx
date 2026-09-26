import { Droplet, FlaskConical, Leaf } from "lucide-react";

import { formatPrice } from "@/lib/utils";
import type { Product } from "@/domain/product/product.types";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ProductNotesTabs } from "@/components/product/ProductNotesTabs";
import { StockBadge } from "@/components/product/StockBadge";
import { BADGE_META, CONCENTRATION_LABELS, SIZE_LABELS } from "@/components/product/product-meta";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const { oil, longevity } = CONCENTRATION_LABELS[product.concentration];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-primary text-xs font-semibold tracking-wider uppercase">
          {product.brand.name}
        </p>
        <h1 className="font-heading text-foreground text-3xl text-balance">{product.name}</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {longevity} · {oil}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="font-heading text-foreground text-2xl font-semibold tabular-nums">
          {formatPrice(product.price)}
        </span>
        <StockBadge product={product} />
      </div>

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

      <AddToCartButton product={product} liveStock size="lg" className="w-full" />

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

      <ProductNotesTabs
        description={product.description}
        topNotes={product.topNotes}
        heartNotes={product.heartNotes}
        baseNotes={product.baseNotes}
      />
    </div>
  );
}
