"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatPrice } from "@/lib/utils";
import type { Size } from "@/domain/product/product.types";
import { SIZE_LABELS } from "@/components/product/product-meta";
import { CartBadge } from "@/components/cart/CartBadge";
import { useCart } from "@/hooks/useCart";

export function CartDrawer() {
  const { items, subtotal, updateQuantity, removeFromCart } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Cart"
          className="text-foreground/80 hover:bg-muted hover:text-foreground relative inline-flex size-9 items-center justify-center rounded-full transition-colors"
        >
          <ShoppingBag className="size-4" />
          <CartBadge />
        </button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <p className="text-muted-foreground text-sm">Your cart is empty.</p>
        ) : (
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
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
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-primary text-xs font-semibold tracking-wider uppercase">
                        {item.brandName}
                      </p>
                      <p className="text-foreground text-sm font-medium">{item.name}</p>
                      <p className="text-muted-foreground text-xs">
                        {SIZE_LABELS[item.size as Size] ?? item.size}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label="Remove item"
                      onClick={() => removeFromCart(item.productId)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="size-4" />
                    </button>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Decrease quantity"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >
                        <Minus className="size-3.5" />
                      </Button>
                      <span className="w-6 text-center text-sm">{item.quantity}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Increase quantity"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        <Plus className="size-3.5" />
                      </Button>
                    </div>
                    <span className="text-foreground text-sm font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 ? (
          <SheetFooter>
            <div className="text-foreground flex items-center justify-between">
              <span className="font-semibold">Subtotal</span>
              <span className="font-heading text-lg font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <SheetClose asChild>
              <Button asChild className="w-full">
                <Link href="/checkout">Checkout</Link>
              </Button>
            </SheetClose>
          </SheetFooter>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
