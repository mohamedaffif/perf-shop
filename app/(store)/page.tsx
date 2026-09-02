import { CategoryTiles } from "@/components/home/CategoryTiles";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Hero } from "@/components/home/Hero";
import { TeaserHome } from "@/components/home/TeaserHome";
import { SHOP_LIVE } from "@/lib/storefront";

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
