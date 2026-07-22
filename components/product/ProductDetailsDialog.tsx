"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Product } from "@/domain/product/product.types";
import { ProductDetails } from "@/components/product/ProductDetails";

interface ProductDetailsDialogProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductDetailsDialog({ product, onAddToCart }: ProductDetailsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="border-primary/60 text-primary hover:bg-primary/10 w-full"
        >
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>{product.description ?? product.name}</DialogDescription>
        </DialogHeader>

        <ProductDetails product={product} onAddToCart={onAddToCart} />
      </DialogContent>
    </Dialog>
  );
}
