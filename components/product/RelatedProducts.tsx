import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/motion/Reveal";
import { Typography } from "@/components/ui/typography";
import { listProducts } from "@/domain/product";
import type { Product } from "@/domain/product/product.types";

interface RelatedProductsProps {
  categoryId: string;
  brandId: string;
  excludeId: string;
}

const LIMIT = 4;

async function fetchRelated(
  where: { categoryId?: string; brandId?: string },
  excludeId: string
): Promise<Product[]> {
  const { items } = await listProducts({
    status: "PUBLISHED",
    pageSize: LIMIT + 1,
    ...where,
  });

  return items.filter((product) => product.id !== excludeId).slice(0, LIMIT);
}

export async function RelatedProducts({ categoryId, brandId, excludeId }: RelatedProductsProps) {
  let items = await fetchRelated({ categoryId }, excludeId);

  if (items.length === 0) {
    items = await fetchRelated({ brandId }, excludeId);
  }

  if (items.length === 0) return null;

  return (
    <section className="mt-16">
      <Typography variant="h2" className="mb-8 text-balance">
        You May Also Like
      </Typography>
      <Reveal stagger className="grid grid-cols-2 items-stretch gap-3 sm:gap-5 lg:grid-cols-4">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </Reveal>
    </section>
  );
}
