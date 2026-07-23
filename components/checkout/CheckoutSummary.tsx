"use client";

import Image from "next/image";

import { formatPrice } from "@/lib/utils";
import { calculateShipping } from "@/lib/pricing";
import type { Size } from "@/domain/product/product.types";
import { SIZE_LABELS } from "@/components/product/product-meta";
import { CouponInput } from "@/components/checkout/CouponInput";
import { useCart } from "@/hooks/useCart";

interface CheckoutSummaryProps {
  couponCode: string | null;
  discountAmount: number;
  onApplyCoupon: (code: string, discountAmount: number) => void;
  onRemoveCoupon: () => void;
  shippingCity: string;
}

export function CheckoutSummary({
  couponCode,
  discountAmount,
  onApplyCoupon,
  onRemoveCoupon,
  shippingCity,
}: CheckoutSummaryProps) {
  const { items, subtotal } = useCart();

  const shippingCost = calculateShipping(subtotal, shippingCity);
  const total = Number((subtotal + shippingCost - discountAmount).toFixed(2));

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
              <p className="text-primary text-xs font-semibold tracking-wider uppercase">
                {item.brandName}
              </p>
              <p className="text-foreground text-sm font-medium">{item.name}</p>
              <p className="text-muted-foreground text-xs">
                {SIZE_LABELS[item.size as Size] ?? item.size} · Qty {item.quantity}
              </p>
              <span className="text-foreground mt-auto text-sm font-semibold">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-border mt-4 border-t pt-4">
        <CouponInput
          subtotal={subtotal}
          appliedCode={couponCode}
          onApply={onApplyCoupon}
          onRemove={onRemoveCoupon}
        />
      </div>

      <div className="mt-4 flex flex-col gap-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {discountAmount > 0 ? (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Discount</span>
            <span>-{formatPrice(discountAmount)}</span>
          </div>
        ) : null}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>{shippingCost > 0 ? formatPrice(shippingCost) : "Free"}</span>
        </div>
      </div>

      <div className="border-border mt-4 flex items-center justify-between border-t pt-4">
        <span className="text-foreground font-semibold">Total</span>
        <span className="font-heading text-foreground text-lg font-semibold">
          {formatPrice(total)}
        </span>
      </div>
    </div>
  );
}
