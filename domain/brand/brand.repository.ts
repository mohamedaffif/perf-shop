import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/client";
import { cached, cacheKey, invalidateKey, invalidateNamespace } from "@/lib/cache";
import type { Brand, BrandFilters, CreateBrandInput, UpdateBrandInput } from "./brand.types";

const LIST_NAMESPACE = "brand:list";
const DETAIL_NAMESPACE = "brand:detail";

function buildWhere(filters: BrandFilters): Prisma.BrandWhereInput {
  const { search } = filters;

  return {
    name: search ? { contains: search, mode: "insensitive" } : undefined,
  };
}

export async function findMany(filters: BrandFilters): Promise<{ items: Brand[]; total: number }> {
  return cached(cacheKey(LIST_NAMESPACE, filters), 300, async () => {
    const where = buildWhere(filters);
    const { page = 1, pageSize = 20 } = filters;

    const [items, total] = await Promise.all([
      prisma.brand.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { name: "asc" },
      }),
      prisma.brand.count({ where }),
    ]);

    return { items, total };
  });
}

export async function findById(id: string): Promise<Brand | null> {
  return cached(cacheKey(DETAIL_NAMESPACE, { id }), 300, () => prisma.brand.findUnique({ where: { id } }));
}

export async function findBySlug(slug: string): Promise<Brand | null> {
  return cached(cacheKey(DETAIL_NAMESPACE, { slug }), 300, () => prisma.brand.findUnique({ where: { slug } }));
}

async function invalidateBrandCaches(brand?: { id: string; slug: string }): Promise<void> {
  await Promise.all([
    invalidateNamespace(LIST_NAMESPACE),
    brand ? invalidateKey(cacheKey(DETAIL_NAMESPACE, { id: brand.id })) : Promise.resolve(),
    brand ? invalidateKey(cacheKey(DETAIL_NAMESPACE, { slug: brand.slug })) : Promise.resolve(),
  ]);
}

export async function create(data: CreateBrandInput): Promise<Brand> {
  const brand = await prisma.brand.create({ data });
  await invalidateBrandCaches();
  return brand;
}

export async function update(id: string, data: UpdateBrandInput): Promise<Brand> {
  const brand = await prisma.brand.update({ where: { id }, data });
  await invalidateBrandCaches(brand);
  return brand;
}

export async function remove(id: string): Promise<void> {
  const brand = await prisma.brand.delete({ where: { id } });
  await invalidateBrandCaches(brand);
}
