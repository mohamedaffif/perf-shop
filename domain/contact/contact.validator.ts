import { z } from "zod";

export const contactMessageSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.email().transform((value) => value.trim().toLowerCase()),
  message: z.string().trim().min(10, "Please add a little more detail").max(4000),
});

export type ContactMessageInput = z.output<typeof contactMessageSchema>;
