import { ShieldCheck, User } from "lucide-react";
import Link from "next/link";

import { auth } from "@/auth";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SearchDialog } from "@/components/search/SearchDialog";
import { MegaMenu } from "./MegaMenu";
import { MobileMenu } from "./MobileMenu";

export type NavLink = {
  label: string;
  href: string;
  megaMenu?: {
    sections: { heading: string; links: { label: string; href: string }[] }[];
    featured?: { title: string; description: string; href: string; cta: string };
  };
};

export const NAV_LINKS: NavLink[] = [
  {
    label: "For Her",
    href: "/shop/for-her",
    megaMenu: {
      sections: [
        {
          heading: "Shop by Family",
          links: [
            { label: "Floral", href: "/shop/for-her?scentFamily=FLORAL" },
            { label: "Oriental", href: "/shop/for-her?scentFamily=ORIENTAL" },
            { label: "Fresh", href: "/shop/for-her?scentFamily=FRESH" },
            { label: "Woody", href: "/shop/for-her?scentFamily=WOODY" },
          ],
        },
        {
          heading: "Collections",
          links: [
            { label: "New Arrivals", href: "/shop/for-her?badge=NEW" },
            { label: "Best Sellers", href: "/shop/for-her?badge=BEST_SELLER" },
            { label: "Gift Sets", href: "/shop/gift-sets" },
            { label: "Travel Size", href: "/shop/for-her?size=ML_50" },
          ],
        },
      ],
      featured: {
        title: "New In",
        description: "Discover this season's signature scent.",
        href: "/shop/for-her?badge=NEW",
        cta: "Shop the edit",
      },
    },
  },
  {
    label: "For Him",
    href: "/shop/for-him",
    megaMenu: {
      sections: [
        {
          heading: "Shop by Family",
          links: [
            { label: "Woody", href: "/shop/for-him?scentFamily=WOODY" },
            { label: "Aromatic", href: "/shop/for-him?scentFamily=AROMATIC" },
            { label: "Citrus", href: "/shop/for-him?scentFamily=CITRUS" },
            { label: "Spicy", href: "/shop/for-him?scentFamily=SPICY" },
          ],
        },
        {
          heading: "Collections",
          links: [
            { label: "New Arrivals", href: "/shop/for-him?badge=NEW" },
            { label: "Best Sellers", href: "/shop/for-him?badge=BEST_SELLER" },
            { label: "Gift Sets", href: "/shop/gift-sets" },
            { label: "Travel Size", href: "/shop/for-him?size=ML_50" },
          ],
        },
      ],
      featured: {
        title: "Best Seller",
        description: "The fragrance everyone's asking about.",
        href: "/shop/for-him?badge=BEST_SELLER",
        cta: "Shop the edit",
      },
    },
  },
  { label: "Unisex", href: "/shop/unisex" },
  { label: "Gift Sets", href: "/shop/gift-sets" },
  {
    label: "Brands",
    href: "/brands",
    megaMenu: {
      sections: [
        {
          heading: "Designer",
          links: [
            { label: "Chanel", href: "/brands/chanel" },
            { label: "Dior", href: "/brands/dior" },
            { label: "Gucci", href: "/brands/gucci" },
            { label: "Versace", href: "/brands/versace" },
          ],
        },
        {
          heading: "Niche",
          links: [
            { label: "Tom Ford", href: "/brands/tom-ford" },
            { label: "Creed", href: "/brands/creed" },
            { label: "Maison Margiela", href: "/brands/maison-margiela" },
            { label: "All Brands", href: "/brands" },
          ],
        },
      ],
      featured: {
        title: "Featured Brand",
        description: "Explore the house behind this month's best seller.",
        href: "/brands",
        cta: "Shop all brands",
      },
    },
  },
  { label: "Sale", href: "/shop?badge=SALE" },
];

export async function Navbar() {
  const session = await auth();
  const role = session?.user?.role;

  return (
    <header className="border-border bg-background/95 supports-backdrop-filter:bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <MobileMenu links={NAV_LINKS} />
          <Link
            href="/"
            className="font-heading text-foreground text-xl font-semibold tracking-wide"
          >
            DE PERFUME SHOP
          </Link>
        </div>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <MegaMenu key={link.href} link={link} />
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <SearchDialog />
          {(role === "STAFF" || role === "ADMIN") && (
            <Link
              href="/admin"
              aria-label="Admin dashboard"
              className="text-foreground/80 hover:bg-muted hover:text-foreground inline-flex size-9 items-center justify-center rounded-full transition-colors"
            >
              <ShieldCheck className="size-4" />
            </Link>
          )}
          <Link
            href={session ? "/account" : "/login"}
            aria-label="Account"
            className="text-foreground/80 hover:bg-muted hover:text-foreground inline-flex size-9 items-center justify-center rounded-full transition-colors"
          >
            <User className="size-4" />
          </Link>
          <CartDrawer />
        </div>
      </div>
    </header>
  );
}
