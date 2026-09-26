import { CategoryTiles } from "@/components/home/CategoryTiles";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Hero } from "@/components/home/Hero";
import { TeaserHome } from "@/components/home/TeaserHome";
import { SHOP_LIVE } from "@/lib/storefront";

// ISR: rendered once, then re-rendered in the background at most once a
// minute. Short enough that the build-time render (no featured products, see
// FeaturedProducts) is replaced right after a deploy; admin catalog edits
// refresh it immediately via revalidateStorefront().
export const revalidate = 60;

export default function Home() {
  return (
    <>
      <Hero />
      {SHOP_LIVE ? (
        <>
          <CategoryTiles />
          <FeaturedProducts />
        </>
      ) : (
        <TeaserHome />
      )}
    </>
  );
}
