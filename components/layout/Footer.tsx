import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { Facebook01Icon, InstagramIcon, NewTwitterIcon } from "@hugeicons/core-free-icons"

import { Separator } from "@/components/ui/separator"

const FOOTER_COLUMNS = [
  {
    heading: "Shop",
    links: [
      { label: "For Her", href: "/shop/for-her" },
      { label: "For Him", href: "/shop/for-him" },
      { label: "Unisex", href: "/shop/unisex" },
      { label: "Gift Sets", href: "/shop/gift-sets" },
      { label: "Sale", href: "/shop/sale" },
    ],
  },
  {
    heading: "Help",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Shipping & Returns", href: "/shipping-returns" },
      { label: "FAQs", href: "/faqs" },
      { label: "Track Order", href: "/track-order" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Our Brands", href: "/brands" },
      { label: "Careers", href: "/careers" },
      { label: "Privacy Policy", href: "/privacy-policy" },
    ],
  },
]

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com", icon: InstagramIcon },
  { label: "Facebook", href: "https://facebook.com", icon: Facebook01Icon },
  { label: "Twitter", href: "https://twitter.com", icon: NewTwitterIcon },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_2fr_1.5fr]">
          <div className="max-w-sm">
            <Link href="/" className="font-heading text-xl font-semibold text-card-foreground">
              PERF SHOP
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Signature fragrances, curated for every occasion. Discover scents that stay with
              you.
            </p>
            <div className="mt-4 flex items-center gap-3">
              {SOCIAL_LINKS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="inline-flex size-9 items-center justify-center rounded-full border border-border text-card-foreground/80 transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <HugeiconsIcon icon={icon} size={16} />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.heading}>
                <p className="text-sm font-semibold text-card-foreground">{column.heading}</p>
                <ul className="mt-3 space-y-2">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="max-w-sm">
            <p className="text-sm font-semibold text-card-foreground">Stay in the loop</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Get early access to new arrivals and exclusive offers.
            </p>
            <form className="mt-4 flex items-center gap-2">
              <input
                type="email"
                required
                placeholder="Your email"
                className="h-10 flex-1 rounded-full border border-border bg-input/30 px-4 text-sm text-card-foreground placeholder:text-muted-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
              <button
                type="submit"
                className="inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Perf Shop. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-primary">
              Terms of Service
            </Link>
            <Link href="/privacy-policy" className="hover:text-primary">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
