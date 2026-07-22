import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
import { CookieConsentBanner } from "@/components/consent/CookieConsentBanner";
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

export const metadata: Metadata = {
  title: "Sign in — Perf Shop",
  description: "Sign in to your Perf Shop account",
};

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialConsent = await readConsentCookieServer();

  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        cormorantGaramond.variable,
        montserrat.variable,
        "font-sans"
      )}
    >
      <body className="bg-background text-foreground flex min-h-full items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <p className="font-heading text-foreground mb-8 text-center text-2xl font-semibold tracking-wide">
            PERF SHOP
          </p>
          {children}
        </div>
        <CookieConsentBanner initialConsent={initialConsent} />
      </body>
    </html>
  );
}
