"use client";

import { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";

import { Button, type buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import type { Product } from "@/domain/product/product.types";
import { useCart } from "@/hooks/useCart";
import { usePulse } from "@/hooks/usePulse";

interface AddToCartButtonProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  size?: VariantProps<typeof buttonVariants>["size"];
  className?: string;
}

export function AddToCartButton({ product, onAddToCart, size, className }: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const buttonRef = usePulse<HTMLButtonElement>([added], {
    from: 0.94,
    shouldPulse: () => added,
  });

  const outOfStock = product.stockQuantity <= 0;

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
