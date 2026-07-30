import type { z } from "zod";
import type { UserRole } from "@/lib/generated/prisma/client";
import type { loginSchema, registerSchema } from "./auth.validator";

export type { UserRole };

// NextAuth session shape, not a raw form-validation shape — no schema to derive from.
export interface AuthUser {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
}

// No .default() fields on either schema, so input and output are identical.
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
