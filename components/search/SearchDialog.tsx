"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";

import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { SIZE_LABELS } from "@/components/product/product-meta";
import { formatPrice } from "@/lib/utils";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useSearchQuery } from "@/lib/api/searchApi";

const MIN_QUERY_LENGTH = 2;

export function SearchDialog() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 300);
  const term = debouncedQuery.trim();

  const { data, isFetching } = useSearchQuery(term, { skip: term.length < MIN_QUERY_LENGTH });
  const results = data?.items ?? [];

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) setQuery("");
      }}
    >
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="Search"
          className="text-foreground/80 hover:bg-muted hover:text-foreground inline-flex size-9 items-center justify-center rounded-full transition-colors"
        >
          <Search className="size-4" />
        </button>
      </DialogTrigger>

      <DialogContent className="top-[12%] max-h-[76vh] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-lg">
        <div className="p-4">
          <div className="relative">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              autoFocus
              placeholder="Search perfumes, brands..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="border-border max-h-[55vh] overflow-y-auto border-t">
          {query.trim().length < MIN_QUERY_LENGTH ? (
            <p className="text-muted-foreground p-4 text-sm">
              Type at least {MIN_QUERY_LENGTH} characters to search.
            </p>
          ) : isFetching ? (
            <div className="flex flex-col gap-4 p-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="size-12 shrink-0 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <p className="text-muted-foreground p-4 text-sm">
              No results for &ldquo;{query.trim()}&rdquo;.
            </p>
          ) : (
            results.map((product) => {
              const image = product.images.find((img) => img.isPrimary) ?? product.images[0];

              return (
                <div
                  key={product.id}
                  className="hover:bg-muted/60 flex items-center gap-3 p-4 transition-colors"
                >
                  <DialogClose asChild>
                    <Link
                      href={`/product/${product.id}`}
                      className="flex min-w-0 flex-1 items-center gap-3"
                    >
                      <div className="bg-muted relative size-12 shrink-0 overflow-hidden rounded-lg">
                        {image ? (
                          <Image
                            src={image.url}
                            alt={image.altText ?? product.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : null}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-primary truncate text-xs font-semibold tracking-wider uppercase">
                          {product.brand.name}
                        </p>
                        <p className="text-foreground truncate text-sm font-medium">
                          {product.name}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {SIZE_LABELS[product.size]} · {formatPrice(product.price)}
                        </p>
                      </div>
                    </Link>
                  </DialogClose>

                  <AddToCartButton product={product} size="sm" />
                </div>
              );
            })
          )}
        </div>

        {term.length >= MIN_QUERY_LENGTH ? (
          <DialogClose asChild>
            <Link
              href={`/search?q=${encodeURIComponent(term)}`}
              className="border-border text-primary hover:bg-muted/60 block border-t p-4 text-center text-sm font-medium transition-colors"
            >
              See all results for &ldquo;{term}&rdquo;
            </Link>
          </DialogClose>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
