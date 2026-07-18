import { CategoryTiles } from "@/components/home/CategoryTiles";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Hero } from "@/components/home/Hero";

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryTiles />
      <FeaturedProducts />
    </>
  );
}
