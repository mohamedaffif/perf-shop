"use client";

import { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";

import { Button, type buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import type { Product } from "@/domain/product/product.types";
import { useCart } from "@/hooks/useCart";
import { useLiveStock } from "@/hooks/useLiveStock";
import { usePulse } from "@/hooks/usePulse";

interface AddToCartButtonProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  /** Fetch current stock instead of trusting `product` (used on the cached product page). */
  liveStock?: boolean;
  size?: VariantProps<typeof buttonVariants>["size"];
  className?: string;
}

export function AddToCartButton({
  product,
  onAddToCart,
  liveStock = false,
  size,
  className,
}: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const stockQuantity = useLiveStock(product, liveStock);
  const buttonRef = usePulse<HTMLButtonElement>([added], {
    from: 0.94,
    shouldPulse: () => added,
  });

  const outOfStock = stockQuantity <= 0;

  function handleAddToCart() {
    const current = { ...product, stockQuantity };
    setAdded(true);
    if (onAddToCart) {
      onAddToCart(current);
    } else {
      addToCart(current);
    }
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <Button
      ref={buttonRef}
      type="button"
      variant="secondary"
      size={size}
      onClick={handleAddToCart}
      disabled={outOfStock}
      className={className}
    >
      {outOfStock ? (
        "Out of Stock"
      ) : added ? (
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
  );
}
