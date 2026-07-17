import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/client";
import type { Brand, BrandFilters, CreateBrandInput, UpdateBrandInput } from "./brand.types";

function buildWhere(filters: BrandFilters): Prisma.BrandWhereInput {
  const { search } = filters;

  return {
    name: search ? { contains: search, mode: "insensitive" } : undefined,
  };
}

export async function findMany(filters: BrandFilters): Promise<{ items: Brand[]; total: number }> {
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
}

export async function findById(id: string): Promise<Brand | null> {
  return prisma.brand.findUnique({ where: { id } });
}

export async function findBySlug(slug: string): Promise<Brand | null> {
  return prisma.brand.findUnique({ where: { slug } });
}

export async function create(data: CreateBrandInput): Promise<Brand> {
  return prisma.brand.create({ data });
}

export async function update(id: string, data: UpdateBrandInput): Promise<Brand> {
  return prisma.brand.update({ where: { id }, data });
}

export async function remove(id: string): Promise<void> {
  await prisma.brand.delete({ where: { id } });
}
