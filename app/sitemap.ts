import type { MetadataRoute } from "next";

import { SHOP_LIVE } from "@/lib/storefront";
import { listProducts } from "@/domain/product";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

async function listPublishedProductIds(): Promise<string[]> {
  const ids: string[] = [];
  const pageSize = 100;
  let page = 1;

  while (true) {
    const { items, total } = await listProducts({ status: "PUBLISHED", page, pageSize });
    ids.push(...items.map((item) => item.id));

    if (ids.length >= total || items.length === 0) break;
    page += 1;
  }

  return ids;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const teaserRoutes = ["/", "/about", "/contact", "/privacy", "/terms"];
  const shopRoutes = SHOP_LIVE ? ["/shop", "/brands"] : [];
  const productIds = SHOP_LIVE ? await listPublishedProductIds() : [];

  const staticEntries: MetadataRoute.Sitemap = [...teaserRoutes, ...shopRoutes].map((path) => ({
    url: `${siteUrl}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency: path === "/" ? ("weekly" as const) : ("monthly" as const),
    priority: path === "/" ? 1 : 0.7,
  }));

  const productEntries = productIds.map((id) => ({
    url: `${siteUrl}/product/${id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...productEntries];
}
