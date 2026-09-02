import type { MetadataRoute } from "next";

import { SHOP_LIVE } from "@/lib/storefront";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const teaserRoutes = ["/", "/about", "/contact", "/privacy", "/terms"];
  const shopRoutes = SHOP_LIVE ? ["/shop", "/brands"] : [];

  return [...teaserRoutes, ...shopRoutes].map((path) => ({
    url: `${siteUrl}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
