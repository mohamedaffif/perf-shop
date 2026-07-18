import { ProductCard } from "@/components/product/ProductCard";
import { Typography } from "@/components/ui/typography";
import { listProducts } from "@/domain/product/product.service";

export async function FeaturedProducts() {
  const { items } = await listProducts({ status: "PUBLISHED", pageSize: 8 });

  return (
    <section id="featured" className="px-4 py-16 sm:px-6 lg:px-8">
      <Typography variant="h2" align="center" className="mb-8">
        Featured
      </Typography>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
