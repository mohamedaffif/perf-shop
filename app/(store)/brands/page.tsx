import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { Typography } from "@/components/ui/typography";
import { listBrands } from "@/domain/brand";

export default async function BrandsPage() {
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
          <BreadcrumbPage>Brands</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      <Typography variant="h1" className="mb-8">
        All Brands
      </Typography>

      {brands.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.slug}`}
              className="border-border hover:border-primary/40 hover:text-primary flex items-center justify-center rounded-lg border p-6 text-center text-sm font-medium transition-colors"
            >
              {brand.name}
            </Link>
          ))}
        </div>
      ) : (
        <Typography variant="body" className="text-muted-foreground">
          No brands available yet.
        </Typography>
      )}
    </div>
  );
}
