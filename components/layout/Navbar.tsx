import Link from "next/link"
import { Search, ShoppingBag, User } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { MegaMenu } from "./MegaMenu"
import { MobileMenu } from "./MobileMenu"

export type NavLink = {
  label: string
  href: string
  megaMenu?: {
    sections: { heading: string; links: { label: string; href: string }[] }[]
    featured?: { title: string; description: string; href: string; cta: string }
  }
}

export const NAV_LINKS: NavLink[] = [
  {
    label: "For Her",
    href: "/shop/for-her",
    megaMenu: {
      sections: [
        {
          heading: "Shop by Family",
          links: [
            { label: "Floral", href: "/shop/for-her/floral" },
            { label: "Oriental", href: "/shop/for-her/oriental" },
            { label: "Fresh", href: "/shop/for-her/fresh" },
            { label: "Woody", href: "/shop/for-her/woody" },
          ],
        },
        {
          heading: "Collections",
          links: [
            { label: "New Arrivals", href: "/shop/for-her/new" },
            { label: "Best Sellers", href: "/shop/for-her/best-sellers" },
            { label: "Gift Sets", href: "/shop/for-her/gift-sets" },
            { label: "Travel Size", href: "/shop/for-her/travel-size" },
          ],
        },
      ],
      featured: {
        title: "New In",
        description: "Discover this season's signature scent.",
        href: "/shop/for-her/new",
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
            { label: "Woody", href: "/shop/for-him/woody" },
            { label: "Aromatic", href: "/shop/for-him/aromatic" },
            { label: "Citrus", href: "/shop/for-him/citrus" },
            { label: "Spicy", href: "/shop/for-him/spicy" },
          ],
        },
        {
          heading: "Collections",
          links: [
            { label: "New Arrivals", href: "/shop/for-him/new" },
            { label: "Best Sellers", href: "/shop/for-him/best-sellers" },
            { label: "Gift Sets", href: "/shop/for-him/gift-sets" },
            { label: "Travel Size", href: "/shop/for-him/travel-size" },
          ],
        },
      ],
      featured: {
        title: "Best Seller",
        description: "The fragrance everyone's asking about.",
        href: "/shop/for-him/best-sellers",
        cta: "Shop the edit",
      },
    },
  },
  { label: "Unisex", href: "/shop/unisex" },
  { label: "Gift Sets", href: "/shop/gift-sets" },
  { label: "Brands", href: "/brands" },
  { label: "Sale", href: "/shop/sale" },
]

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <MobileMenu links={NAV_LINKS} />
          <Link
            href="/"
            className="font-heading text-xl font-semibold tracking-wide text-foreground"
          >
            PERF SHOP
          </Link>
        </div>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <MegaMenu key={link.href} link={link} />
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Search"
            className="inline-flex size-9 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
          >
            <Search className="size-4" />
          </button>
          <Link
            href="/account"
            aria-label="Account"
            className="inline-flex size-9 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
          >
            <User className="size-4" />
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative inline-flex size-9 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
          >
            <ShoppingBag className="size-4" />
            <Badge className="absolute -right-1 -top-1 size-4 justify-center rounded-full p-0 text-[10px]">
              0
            </Badge>
          </Link>
        </div>
      </div>
    </header>
  )
}
