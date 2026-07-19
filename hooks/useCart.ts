"use client";

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch } from "@/lib/store";
import type { Product } from "@/domain/product/product.types";
import {
  addItem,
  clearCart,
  removeItem,
  selectCartCount,
  selectCartItems,
  selectCartSubtotal,
  setQuantity,
} from "@/redux/slices/cartSlice";

export function useCart() {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector(selectCartItems);
  const count = useSelector(selectCartCount);
  const subtotal = useSelector(selectCartSubtotal);

  const addToCart = useCallback(
    (product: Product, quantity = 1) => {
      const image = product.images.find((i) => i.isPrimary) ?? product.images[0];
      dispatch(
        addItem({
          item: {
            productId: product.id,
            name: product.name,
            brandName: product.brand.name,
            price: product.price,
            size: product.size,
            imageUrl: image?.url ?? null,
          },
          quantity,
        })
      );
    },
    [dispatch]
  );

  const removeFromCart = useCallback(
    (productId: string) => dispatch(removeItem({ productId })),
    [dispatch]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => dispatch(setQuantity({ productId, quantity })),
    [dispatch]
  );

  const clear = useCallback(() => dispatch(clearCart()), [dispatch]);

  return { items, count, subtotal, addToCart, removeFromCart, updateQuantity, clear };
}
