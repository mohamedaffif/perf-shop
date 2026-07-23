import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/motion/Reveal";
import { Typography } from "@/components/ui/typography";
import { search } from "@/domain/search";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const { items } = query.length >= 2 ? await search({ q: query, limit: 24 }) : { items: [] };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Typography variant="h1" className="mb-8">
        {query ? `Results for “${query}”` : "Search"}
      </Typography>

      {query.length < 2 ? (
        <Typography variant="body" className="text-muted-foreground">
          Enter at least 2 characters to search.
        </Typography>
      ) : items.length > 0 ? (
        <Reveal
          stagger
          className="grid grid-cols-2 items-stretch gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4"
        >
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Reveal>
      ) : (
        <Typography variant="body" className="text-muted-foreground">
          No fragrances match &ldquo;{query}&rdquo;.
        </Typography>
      )}
    </div>
  );
}
