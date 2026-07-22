import Link from "next/link";
import { notFound } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ProductCard } from "@/components/product/ProductCard";
import { ShopPagination } from "@/components/shop/ShopPagination";
import { Typography } from "@/components/ui/typography";
import { Reveal } from "@/components/motion/Reveal";
import { getBrandBySlug } from "@/domain/brand";
import { listProducts } from "@/domain/product";
import { parseShopFilters } from "@/lib/shop-filters";

type BrandPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function BrandPage({ params, searchParams }: BrandPageProps) {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);

  if (!brand) notFound();

  const sp = await searchParams;
  const { items, total, page, pageSize } = await listProducts({
    status: "PUBLISHED",
    brandId: brand.id,
    ...parseShopFilters(sp),
  });

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
              <Link href="/brands">Brands</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{brand.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Typography variant="h1" className="mb-8">
        {brand.name}
      </Typography>

      {items.length > 0 ? (
        <>
          <Reveal stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Reveal>
          <ShopPagination
            page={page}
            pageSize={pageSize}
            total={total}
            searchParams={sp}
            basePath={`/brands/${slug}`}
          />
        </>
      ) : (
        <Typography variant="body" className="text-muted-foreground">
          No fragrances from {brand.name} yet.
        </Typography>
      )}
    </div>
  );
}
