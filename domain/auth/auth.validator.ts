import { z } from "zod";

import { phoneSchema } from "@/lib/validation/phone";

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const registerSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(8),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1),
  // An empty string clears the phone number.
  phone: z.union([z.literal("").transform(() => null), phoneSchema]).optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8),
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "New password must be different from your current password",
    path: ["newPassword"],
  });
