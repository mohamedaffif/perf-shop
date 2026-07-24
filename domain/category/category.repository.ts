import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/client";
import { cached, cacheKey, invalidateKey, invalidateNamespace } from "@/lib/cache";
import type {
  Category,
  CategoryFilters,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "./category.types";

const LIST_NAMESPACE = "category:list";
const DETAIL_NAMESPACE = "category:detail";

function buildWhere(filters: CategoryFilters): Prisma.CategoryWhereInput {
  const { search } = filters;

  return {
    name: search ? { contains: search, mode: "insensitive" } : undefined,
  };
}

export async function findMany(
  filters: CategoryFilters
): Promise<{ items: Category[]; total: number }> {
  return cached(cacheKey(LIST_NAMESPACE, filters), 300, async () => {
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
  });
}

export async function findById(id: string): Promise<Category | null> {
  return cached(cacheKey(DETAIL_NAMESPACE, { id }), 300, () =>
    prisma.category.findUnique({ where: { id } })
  );
}

export async function findBySlug(slug: string): Promise<Category | null> {
  return cached(cacheKey(DETAIL_NAMESPACE, { slug }), 300, () =>
    prisma.category.findUnique({ where: { slug } })
  );
}

async function invalidateCategoryCaches(category?: { id: string; slug: string }): Promise<void> {
  await Promise.all([
    invalidateNamespace(LIST_NAMESPACE),
    category ? invalidateKey(cacheKey(DETAIL_NAMESPACE, { id: category.id })) : Promise.resolve(),
    category
      ? invalidateKey(cacheKey(DETAIL_NAMESPACE, { slug: category.slug }))
      : Promise.resolve(),
  ]);
}

export async function create(data: CreateCategoryInput): Promise<Category> {
  const category = await prisma.category.create({ data });
  await invalidateCategoryCaches();
  return category;
}

export async function update(id: string, data: UpdateCategoryInput): Promise<Category> {
  const category = await prisma.category.update({ where: { id }, data });
  await invalidateCategoryCaches(category);
  return category;
}

export async function remove(id: string): Promise<void> {
  const category = await prisma.category.delete({ where: { id } });
  await invalidateCategoryCaches(category);
}
