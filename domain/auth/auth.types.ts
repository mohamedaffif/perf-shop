import type { z } from "zod";
import type { UserRole } from "@/lib/generated/prisma/client";
import type { changePasswordSchema, loginSchema, registerSchema } from "./auth.validator";

export type { UserRole };

// NextAuth session shape, not a raw form-validation shape — no schema to derive from.
export interface AuthUser {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
}

// What the account pages show. Derived from the User row, so it never carries the password hash —
// only whether one is set.
export interface AccountProfile extends AuthUser {
  image: string | null;
  phone: string | null;
  emailVerified: boolean;
  createdAt: string;
  hasPassword: boolean;
  providers: string[];
}

// No .default() fields on these schemas, so input and output are identical.
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

// Profile form values as the client sends them ("" clears the phone). Written by hand because the
// schema's output type (phone: string | null) differs from its input type.
export interface UpdateProfileInput {
  name: string;
  phone?: string;
}
