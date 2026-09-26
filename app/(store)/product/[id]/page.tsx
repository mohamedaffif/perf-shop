import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { CONCENTRATION_LABELS, SIZE_LABELS } from "@/components/product/product-meta";
import { getProduct, ProductNotFoundError } from "@/domain/product";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

// ISR: each product page is rendered on its first visit, then served from
// cache and re-rendered in the background at most every 5 minutes. Admin
// edits refresh it immediately via revalidateStorefront(). Stock is never
// part of this cached HTML — ProductInfo loads it live in the browser.
export const revalidate = 300;

// Empty list = nothing prerendered at build (no database there); every
// product page is generated on demand instead.
export function generateStaticParams(): { id: string }[] {
  return [];
}

const loadProduct = cache(async (id: string) => {
  return getProduct(id).catch((err) => {
    if (err instanceof ProductNotFoundError) return null;
    throw err;
  });
});

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await loadProduct(id);

  if (!product) return {};

  const image = product.images.find((img) => img.isPrimary) ?? product.images[0];
  const title = `${product.brand.name} ${product.name}`;
  const description =
    product.description ??
    `${product.brand.name} ${product.name} — ${SIZE_LABELS[product.size]}, ${CONCENTRATION_LABELS[product.concentration].oil}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image.url }] : undefined,
    },
    twitter: {
      title,
      description,
      images: image ? [image.url] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  const product = await loadProduct(id);

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/shop">Shop</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
        <div className="lg:w-1/2">
          <ProductGallery
            images={product.images}
            brandName={product.brand.name}
            productName={product.name}
          />
        </div>
        <div className="lg:w-1/2">
          <ProductInfo product={product} />
        </div>
      </div>

      <RelatedProducts
        categoryId={product.categoryId}
        brandId={product.brandId}
        excludeId={product.id}
      />
    </div>
  );
}
