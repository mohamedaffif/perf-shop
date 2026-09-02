import type { MetadataRoute } from "next";

import { SHOP_LIVE } from "@/lib/storefront";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/account",
        "/api",
        "/checkout",
        ...(SHOP_LIVE ? [] : ["/shop", "/product", "/brands", "/search"]),
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
