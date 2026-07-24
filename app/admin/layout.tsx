import type { Metadata } from "next";
import { Cormorant_Garamond, Geist_Mono, Montserrat } from "next/font/google";
import { redirect } from "next/navigation";
import Link from "next/link";

import "../globals.css";
import { cn } from "@/lib/utils";
import { auth } from "@/auth";
import Providers from "@/lib/provider";

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
  title: "Admin — DE PERFUME SHOP",
  description: "DE PERFUME SHOP admin dashboard",
};

const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Coupons", href: "/admin/coupons" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = session?.user?.role;

  if (!session?.user) {
    redirect("/login");
  }

  if (role !== "STAFF" && role !== "ADMIN") {
    redirect("/");
  }

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
          <header className="border-border bg-background/95 sticky top-0 z-40 border-b backdrop-blur">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
              <Link
                href="/admin"
                className="font-heading text-foreground text-xl font-semibold tracking-wide"
              >
                DE PERFUME SHOP ADMIN
              </Link>
              <Link href="/" className="text-muted-foreground hover:text-foreground text-sm">
                Back to store
              </Link>
            </div>
          </header>

          <div className="mx-auto flex w-full max-w-7xl flex-1 gap-10 px-4 py-10 sm:px-6 lg:px-8">
            <nav className="flex w-48 shrink-0 flex-col gap-1">
              {ADMIN_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-foreground/80 hover:bg-muted hover:text-foreground rounded-md px-3 py-2 text-sm font-medium transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <main className="min-w-0 flex-1">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
