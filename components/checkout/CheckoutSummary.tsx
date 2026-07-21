"use client";

import Image from "next/image";

import { formatPrice } from "@/lib/utils";
import type { Size } from "@/domain/product/product.types";
import { SIZE_LABELS } from "@/components/product/product-meta";
import { useCart } from "@/hooks/useCart";

export function CheckoutSummary() {
  const { items, subtotal } = useCart();

  return (
    <div className="border-border h-fit rounded-lg border p-4">
      <h2 className="mb-4 font-semibold">Order summary</h2>

      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div key={item.productId} className="flex gap-3">
            <div className="bg-muted relative size-16 shrink-0 overflow-hidden rounded-lg">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : null}
            </div>

            <div className="flex flex-1 flex-col gap-1">
              <p className="text-xs font-semibold tracking-wider text-primary uppercase">
                {item.brandName}
              </p>
              <p className="text-sm font-medium text-foreground">{item.name}</p>
              <p className="text-muted-foreground text-xs">
                {SIZE_LABELS[item.size as Size] ?? item.size} · Qty {item.quantity}
              </p>
              <span className="mt-auto text-sm font-semibold text-foreground">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-border mt-4 flex items-center justify-between border-t pt-4">
        <span className="font-semibold text-foreground">Total</span>
        <span className="font-heading text-lg font-semibold text-foreground">
          {formatPrice(subtotal)}
        </span>
      </div>
    </div>
  );
}
