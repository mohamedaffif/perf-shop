import type { Metadata } from "next";
import { Cormorant_Garamond, Geist_Mono, Montserrat } from "next/font/google";
import { redirect } from "next/navigation";
import Link from "next/link";

import "../../globals.css";
import { cn } from "@/lib/utils";
import { auth } from "@/auth";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SearchDialog } from "@/components/search/SearchDialog";
import { CookieConsentBanner } from "@/components/consent/CookieConsentBanner";
import { Typography } from "@/components/ui/typography";
import Providers from "@/lib/provider";
import { readConsentCookieServer } from "@/lib/consent.server";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Account — DE PERFUME SHOP",
  description: "Manage your DE PERFUME SHOP profile, orders, and addresses",
};

const ACCOUNT_NAV = [
  { label: "Profile", href: "/account" },
  { label: "Orders", href: "/account/orders" },
  { label: "Addresses", href: "/account/addresses" },
];

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const initialConsent = await readConsentCookieServer();

  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        cormorantGaramond.variable,
        montserrat.variable,
        geistMono.variable,
        "font-sans"
      )}
    >
      <body className="flex min-h-full flex-col">
        <Providers>
          <header className="border-border bg-background/95 supports-backdrop-filter:bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
              <Link
                href="/"
                className="font-heading text-foreground text-xl font-semibold tracking-wide"
              >
                DE PERFUME SHOP
              </Link>
              <div className="flex items-center gap-1">
                <SearchDialog />
                <CartDrawer />
              </div>
            </div>
          </header>

          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
            <Typography variant="h1" className="mb-8">
              My Account
            </Typography>

            <div className="flex flex-col gap-10 lg:flex-row">
              <nav className="flex shrink-0 flex-row gap-1 lg:w-48 lg:flex-col">
                {ACCOUNT_NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-foreground/80 hover:bg-muted hover:text-foreground rounded-md px-3 py-2 text-sm font-medium transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="min-w-0 flex-1">{children}</div>
            </div>
          </main>
        </Providers>
        <CookieConsentBanner initialConsent={initialConsent} />
      </body>
    </html>
  );
}
