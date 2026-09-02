import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Facebook01Icon,
  InstagramIcon,
  NewTwitterIcon,
  TiktokIcon,
  WhatsappIcon,
} from "@hugeicons/core-free-icons";

import { Separator } from "@/components/ui/separator";
import { CookiePreferencesLink } from "@/components/consent/CookiePreferencesLink";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { SHOP_LIVE } from "@/lib/storefront";
import { BUSINESS } from "@/lib/business";

const SHOP_COLUMN = {
  heading: "Shop",
  links: [
    { label: "For Her", href: "/shop/for-her" },
    { label: "For Him", href: "/shop/for-him" },
    { label: "Unisex", href: "/shop/unisex" },
    { label: "Gift Sets", href: "/shop/gift-sets" },
    { label: "Sale", href: "/shop?badge=SALE" },
    { label: "Our Brands", href: "/brands" },
  ],
};

const COMPANY_COLUMN = {
  heading: "Company",
  links: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

const FOOTER_COLUMNS = SHOP_LIVE ? [SHOP_COLUMN, COMPANY_COLUMN] : [COMPANY_COLUMN];

const SOCIAL_LINKS = [
  { label: "Instagram", href: BUSINESS.socials.instagram, icon: InstagramIcon },
  { label: "TikTok", href: BUSINESS.socials.tiktok, icon: TiktokIcon },
  { label: "Facebook", href: BUSINESS.socials.facebook, icon: Facebook01Icon },
  { label: "X (Twitter)", href: BUSINESS.socials.twitter, icon: NewTwitterIcon },
  { label: "WhatsApp", href: `https://wa.me/${BUSINESS.whatsapp}`, icon: WhatsappIcon },
];

export function Footer() {
  return (
    <footer className="border-border bg-card border-t">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_2fr_1.5fr]">
          <div className="max-w-sm">
            <Link href="/" className="font-heading text-card-foreground text-xl font-semibold">
              DE PERFUME SHOP
            </Link>
            <p className="text-muted-foreground mt-3 text-sm">
              Signature fragrances, curated for every occasion. Discover scents that stay with you.
            </p>
            <address className="text-muted-foreground mt-3 text-sm not-italic">
              {BUSINESS.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
              <a href={`tel:${BUSINESS.phoneE164}`} className="hover:text-primary mt-1 block">
                {BUSINESS.phone}
              </a>
              <a href={`mailto:${BUSINESS.email}`} className="hover:text-primary block">
                {BUSINESS.email}
              </a>
            </address>
            <div className="mt-4 flex items-center gap-3">
              {SOCIAL_LINKS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="border-border text-card-foreground/80 hover:border-primary/40 hover:text-primary inline-flex size-9 items-center justify-center rounded-full border transition-colors"
                >
                  <HugeiconsIcon icon={icon} size={16} />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.heading}>
                <p className="text-card-foreground text-sm font-semibold">{column.heading}</p>
                <ul className="mt-3 space-y-2">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-muted-foreground hover:text-primary text-sm transition-colors"
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
            <p className="text-card-foreground text-sm font-semibold">Stay in the loop</p>
            <p className="text-muted-foreground mt-2 text-sm">
              Get early access to new arrivals and exclusive offers.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <Separator className="my-8" />

        <div className="text-muted-foreground flex flex-col items-center justify-between gap-4 text-xs sm:flex-row">
          <p>© {new Date().getFullYear()} DE PERFUME SHOP. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <CookiePreferencesLink />
          </div>
        </div>
      </div>
    </footer>
  );
}
