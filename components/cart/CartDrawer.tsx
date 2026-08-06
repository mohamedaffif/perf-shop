"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useSession } from "next-auth/react";

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
import { sizeSchema } from "@/domain/product/product.validator";
import { isOneOf } from "@/lib/type-guards";
import { SIZE_LABELS } from "@/components/product/product-meta";
import { CartBadge } from "@/components/cart/CartBadge";
import { useCart } from "@/hooks/useCart";

export function CartDrawer() {
  const { items, subtotal, updateQuantity, removeFromCart } = useCart();
  const { status } = useSession();
  // "loading" isn't treated as signed-out: the server-side checkout guard
  // is the real protection, this is only an upfront UX shortcut.
  const checkoutHref =
    status === "unauthenticated" ? "/login?callbackUrl=%2Fcheckout" : "/checkout";

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
                        {isOneOf(sizeSchema.options, item.size)
                          ? SIZE_LABELS[item.size]
                          : item.size}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label="Remove item"
                      onClick={() => removeFromCart(item.productId)}
                      className="text-muted-foreground hover:text-foreground flex size-11 shrink-0 items-center justify-center rounded-full transition-colors"
                    >
                      <X className="size-4" />
                    </button>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-touch"
                        aria-label="Decrease quantity"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >
                        <Minus className="size-3.5" />
                      </Button>
                      <span className="w-6 text-center text-sm tabular-nums">{item.quantity}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-touch"
                        aria-label="Increase quantity"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        <Plus className="size-3.5" />
                      </Button>
                    </div>
                    <span className="text-foreground text-sm font-semibold tabular-nums">
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
              <span className="font-heading text-lg font-semibold tabular-nums">
                {formatPrice(subtotal)}
              </span>
            </div>
            <SheetClose asChild>
              <Button asChild className="w-full">
                <Link href={checkoutHref}>Checkout</Link>
              </Button>
            </SheetClose>
          </SheetFooter>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
