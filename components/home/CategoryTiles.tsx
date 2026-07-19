import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";

const CATEGORY_TILES = [
  { label: "For Her", href: "/shop/for-her" },
  { label: "For Him", href: "/shop/for-him" },
  { label: "Unisex", href: "/shop/unisex" },
  { label: "Gift Sets", href: "/shop/gift-sets" },
] as const;

export function CategoryTiles() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <Reveal stagger className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {CATEGORY_TILES.map((tile) => (
          <Link
            key={tile.href}
            href={tile.href}
            className="rounded-2xl border border-primary/40 bg-background p-6 text-center font-heading text-foreground"
          >
            {tile.label}
          </Link>
        ))}
      </Reveal>
    </section>
  );
}
