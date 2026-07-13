import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/client";
import type {
  Category,
  CategoryFilters,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "./category.types";

function buildWhere(filters: CategoryFilters): Prisma.CategoryWhereInput {
  const { search } = filters;

  return {
    name: search ? { contains: search, mode: "insensitive" } : undefined,
  };
}

export async function findMany(
  filters: CategoryFilters
): Promise<{ items: Category[]; total: number }> {
  const where = buildWhere(filters);
  const { page = 1, pageSize = 20 } = filters;

  const [items, total] = await Promise.all([
    prisma.category.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { name: "asc" },
    }),
    prisma.category.count({ where }),
  ]);

  return { items, total };
}

export async function findById(id: string): Promise<Category | null> {
  return prisma.category.findUnique({ where: { id } });
}

export async function findBySlug(slug: string): Promise<Category | null> {
  return prisma.category.findUnique({ where: { slug } });
}

export async function create(data: CreateCategoryInput): Promise<Category> {
  return prisma.category.create({ data });
}

export async function update(id: string, data: UpdateCategoryInput): Promise<Category> {
  return prisma.category.update({ where: { id }, data });
}

export async function remove(id: string): Promise<void> {
  await prisma.category.delete({ where: { id } });
}
