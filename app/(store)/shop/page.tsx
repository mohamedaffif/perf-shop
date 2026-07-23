import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ProductCard } from "@/components/product/ProductCard";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { ShopPagination } from "@/components/shop/ShopPagination";
import { Typography } from "@/components/ui/typography";
import { Reveal } from "@/components/motion/Reveal";
import { listBrands } from "@/domain/brand";
import { listProducts } from "@/domain/product";
import { parseShopFilters } from "@/lib/shop-filters";

type ShopPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const sp = await searchParams;
  const { items, total, page, pageSize } = await listProducts({
    status: "PUBLISHED",
    ...parseShopFilters(sp),
  });

  const { items: brands } = await listBrands({ pageSize: 100 });

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
            <BreadcrumbPage>Shop</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Typography variant="h1" className="mb-8">
        Shop All
      </Typography>

      <div className="flex flex-col gap-10 lg:flex-row">
        <FilterSidebar brands={brands} />

        <div className="flex-1">
          {items.length > 0 ? (
            <>
              <Reveal
                stagger
                className="grid grid-cols-2 items-stretch gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4"
              >
                {items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </Reveal>
              <ShopPagination
                page={page}
                pageSize={pageSize}
                total={total}
                searchParams={sp}
                basePath="/shop"
              />
            </>
          ) : (
            <Typography variant="body" className="text-muted-foreground">
              No fragrances match these filters.
            </Typography>
          )}
        </div>
      </div>
    </div>
  );
}
