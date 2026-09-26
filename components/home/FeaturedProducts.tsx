import { ProductCard } from "@/components/product/ProductCard";
import { Typography } from "@/components/ui/typography";
import { Reveal } from "@/components/motion/Reveal";
import { listProducts } from "@/domain/product/product.service";
import { IS_BUILD_PHASE } from "@/lib/build-phase";

export async function FeaturedProducts() {
  // No database at build time; the home page's ISR revalidation fills this in.
  if (IS_BUILD_PHASE) return null;

  const { items } = await listProducts({ status: "PUBLISHED", pageSize: 8 });

  return (
    <section id="featured" className="px-4 py-16 sm:px-6 lg:px-8">
      <Typography variant="h2" align="center" className="mb-8">
        Featured
      </Typography>
      <Reveal
        stagger
        className="grid grid-cols-2 items-stretch gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4"
      >
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </Reveal>
    </section>
  );
}
