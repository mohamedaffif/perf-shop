import { prisma } from "@/lib/prisma";
import type { Address, CreateAddressInput, UpdateAddressInput } from "./address.types";

export function findManyByUserId(userId: string): Promise<Address[]> {
  return prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
}

export function findById(id: string): Promise<Address | null> {
  return prisma.address.findUnique({ where: { id } });
}

export function createWithDefaultFlip(userId: string, data: CreateAddressInput): Promise<Address> {
  return prisma.$transaction(async (tx) => {
    if (data.isDefault) {
      await tx.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return tx.address.create({ data: { ...data, userId } });
  });
}

export function updateWithDefaultFlip(
  id: string,
  userId: string,
  data: UpdateAddressInput
): Promise<Address> {
  return prisma.$transaction(async (tx) => {
    if (data.isDefault) {
      await tx.address.updateMany({
        where: { userId, isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
    }

    return tx.address.update({ where: { id }, data });
  });
}

export async function remove(id: string): Promise<void> {
  await prisma.address.delete({ where: { id } });
}
