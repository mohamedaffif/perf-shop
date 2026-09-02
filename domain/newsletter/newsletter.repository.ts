import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { ParsedSubscriberFilters, Subscriber } from "./newsletter.types";

const subscriberSelect = {
  id: true,
  email: true,
  source: true,
  unsubscribedAt: true,
  createdAt: true,
} satisfies Prisma.NewsletterSubscriberSelect;

/** Whether the email is already on the list (any subscription record, opted-out or not). */
export async function findByEmail(
  email: string
): Promise<{ id: string; unsubscribedAt: Date | null } | null> {
  return prisma.newsletterSubscriber.findUnique({
    where: { email },
    select: { id: true, unsubscribedAt: true },
  });
}

/** Idempotent: re-subscribing an existing email is a no-op that clears any prior opt-out. */
export async function upsert(email: string, source?: string): Promise<{ created: boolean }> {
  const existing = await prisma.newsletterSubscriber.findUnique({
    where: { email },
    select: { id: true },
  });

  await prisma.newsletterSubscriber.upsert({
    where: { email },
    create: { email, source },
    update: { unsubscribedAt: null },
  });

  return { created: !existing };
}

function buildWhere(filters: ParsedSubscriberFilters): Prisma.NewsletterSubscriberWhereInput {
  const { search } = filters;
  return search ? { email: { contains: search, mode: "insensitive" } } : {};
}

export async function findMany(
  filters: ParsedSubscriberFilters
): Promise<{ items: Subscriber[]; total: number }> {
  const { page = 1, pageSize = 20 } = filters;
  const where = buildWhere(filters);

  const [items, total] = await Promise.all([
    prisma.newsletterSubscriber.findMany({
      where,
      select: subscriberSelect,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.newsletterSubscriber.count({ where }),
  ]);

  return { items, total };
}

export async function findAll(): Promise<Subscriber[]> {
  return prisma.newsletterSubscriber.findMany({
    select: subscriberSelect,
    orderBy: { createdAt: "desc" },
  });
}
