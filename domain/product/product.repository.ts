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
  const {
    status,
    brandId,
    categoryId,
    concentration,
    scentFamily,
    size,
    badge,
    minPrice,
    maxPrice,
    search,
  } = filters;

  return {
    status,
    brandId,
    categoryId,
    concentration,
    scentFamily,
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

interface SearchHit {
  id: string;
}

// Trigram similarity (pg_trgm) gives typo tolerance and a relevance score in
// one primitive; the ILIKE fallback is OR'd in so exact/short substring
// matches never regress. Uses word_similarity rather than plain similarity:
// plain similarity compares the two full strings, which dilutes badly when
// a short query is matched against a longer multi-word field (e.g.
// "vaniila" vs "Smoked Vanilla" scores ~0.28) — word_similarity instead
// finds the best-matching substring within the longer field (~0.5 for the
// same pair). An explicit 0.3 threshold is used rather than the `<%`
// operator's default GUC (0.6, too strict for realistic typos, and a
// session-level override would be unreliable under Neon's pooled
// connections). Ranking can't be expressed via the query builder, so this
// drops to a parameterized raw query, then hydrates full rows through the
// normal include/mapper and reapplies the rank order in JS (findMany's
// `id: { in }` does not preserve list order).
const WORD_SIMILARITY_THRESHOLD = 0.3;

export async function searchPublished(query: string, limit: number): Promise<Product[]> {
  const hits = await prisma.$queryRaw<SearchHit[]>`
    SELECT p.id
    FROM "products" p
    JOIN "brands" b ON b.id = p."brandId"
    WHERE p.status = 'PUBLISHED'::"ProductStatus"
      AND (
        word_similarity(lower(${query}), lower(p.name)) > ${WORD_SIMILARITY_THRESHOLD}
        OR word_similarity(lower(${query}), lower(coalesce(p.description, ''))) > ${WORD_SIMILARITY_THRESHOLD}
        OR word_similarity(lower(${query}), lower(b.name)) > ${WORD_SIMILARITY_THRESHOLD}
        OR p.name ILIKE ${"%" + query + "%"}
        OR p.description ILIKE ${"%" + query + "%"}
        OR b.name ILIKE ${"%" + query + "%"}
      )
    ORDER BY GREATEST(
      word_similarity(lower(${query}), lower(p.name)),
      word_similarity(lower(${query}), lower(coalesce(p.description, ''))),
      word_similarity(lower(${query}), lower(b.name))
    ) DESC
    LIMIT ${limit}
  `;

  if (hits.length === 0) return [];

  const rows = await prisma.product.findMany({
    where: { id: { in: hits.map((hit) => hit.id) } },
    include: productInclude,
  });

  const rowsById = new Map(rows.map((row) => [row.id, row]));
  return hits
    .map((hit) => rowsById.get(hit.id))
    .filter((row): row is ProductRow => row !== undefined)
    .map(toProduct);
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
