import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/client";
import type {
  CreateProductInput,
  Product,
  ProductFilters,
  UpdateProductInput,
} from "./product.types";

const productInclude = {
  images: true,
  brand: true,
  category: true,
} satisfies Prisma.ProductInclude;

type ProductRow = Prisma.ProductGetPayload<{ include: typeof productInclude }>;

function toProduct(row: ProductRow): Product {
  return {
    ...row,
    price: Number(row.price),
  };
}

function buildWhere(filters: ProductFilters): Prisma.ProductWhereInput {
  const { status, brandId, categoryId, concentration, size, badge, minPrice, maxPrice, search } =
    filters;

  return {
    status,
    brandId,
    categoryId,
    concentration,
    size,
    badges: badge ? { has: badge } : undefined,
    price:
      minPrice !== undefined || maxPrice !== undefined
        ? { gte: minPrice, lte: maxPrice }
        : undefined,
    name: search ? { contains: search, mode: "insensitive" } : undefined,
  };
}

export async function findMany(
  filters: ProductFilters
): Promise<{ items: Product[]; total: number }> {
  const where = buildWhere(filters);
  const { page = 1, pageSize = 20 } = filters;

  const [rows, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: productInclude,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where }),
  ]);

  return { items: rows.map(toProduct), total };
}

export async function findById(id: string): Promise<Product | null> {
  const row = await prisma.product.findUnique({
    where: { id },
    include: productInclude,
  });

  return row ? toProduct(row) : null;
}

export async function create(data: CreateProductInput): Promise<Product> {
  const { images, ...product } = data;

  const row = await prisma.product.create({
    data: {
      ...product,
      images: images && images.length > 0 ? { create: images } : undefined,
    },
    include: productInclude,
  });

  return toProduct(row);
}

export async function update(id: string, data: UpdateProductInput): Promise<Product> {
  const { images, ...product } = data;

  const row = await prisma.product.update({
    where: { id },
    data: {
      ...product,
      images: images ? { deleteMany: {}, create: images } : undefined,
    },
    include: productInclude,
  });

  return toProduct(row);
}

export async function remove(id: string): Promise<void> {
  await prisma.product.delete({ where: { id } });
}
