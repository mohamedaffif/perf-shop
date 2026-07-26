import type { UserRole } from "@/lib/generated/prisma/client";

export type { UserRole };

export interface AuthUser {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}
