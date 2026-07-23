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
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { ShopPagination } from "@/components/shop/ShopPagination";
import { Typography } from "@/components/ui/typography";
import { Reveal } from "@/components/motion/Reveal";
import { listBrands } from "@/domain/brand";
import { getCategoryBySlug } from "@/domain/category";
import { listProducts } from "@/domain/product";
import { parseShopFilters } from "@/lib/shop-filters";

const CATEGORY_LABELS: Record<string, string> = {
  "for-her": "For Her",
  "for-him": "For Him",
  unisex: "Unisex",
  "gift-sets": "Gift Sets",
};

const CATEGORY_SLUG_MAP: Record<string, string | null> = {
  "for-her": "womens-fragrance",
  "for-him": "mens-fragrance",
  unisex: "unisex-fragrance",
  "gift-sets": null,
};

type ShopCategoryPageProps = {
  params: Promise<{ category: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ShopCategoryPage({ params, searchParams }: ShopCategoryPageProps) {
  const { category } = await params;

  if (!(category in CATEGORY_SLUG_MAP)) {
    notFound();
  }

  const categorySlug = CATEGORY_SLUG_MAP[category];
  const categoryRecord = categorySlug ? await getCategoryBySlug(categorySlug) : null;

  const sp = await searchParams;
  const { items, total, page, pageSize } = await listProducts({
    status: "PUBLISHED",
    categoryId: categoryRecord?.id,
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
            <BreadcrumbLink asChild>
              <Link href="/shop">Shop</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{CATEGORY_LABELS[category]}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Typography variant="h1" className="mb-8">
        {CATEGORY_LABELS[category]}
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
                basePath={`/shop/${category}`}
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
