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
