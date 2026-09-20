import { prisma } from "@/lib/prisma";
import type { User } from "@/lib/generated/prisma/client";

export function findByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { email } });
}

export function createUser(data: {
  name: string;
  email: string;
  passwordHash: string;
}): Promise<User> {
  return prisma.user.create({
    data: { ...data, role: "CUSTOMER" },
  });
}

export function findById(id: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } });
}

export function findByIdWithAccounts(
  id: string
): Promise<(User & { accounts: { provider: string }[] }) | null> {
  return prisma.user.findUnique({
    where: { id },
    include: { accounts: { select: { provider: true } } },
  });
}

export function markEmailVerified(id: string, options: { clearPassword: boolean }): Promise<User> {
  return prisma.user.update({
    where: { id },
    data: {
      emailVerified: new Date(),
      ...(options.clearPassword ? { passwordHash: null } : {}),
    },
  });
}

export function updateUser(
  id: string,
  data: { name?: string; phone?: string | null }
): Promise<User> {
  return prisma.user.update({ where: { id }, data });
}

export function updatePasswordHash(id: string, passwordHash: string): Promise<User> {
  return prisma.user.update({ where: { id }, data: { passwordHash } });
}
