import { z } from "zod";

export const searchQuerySchema = z.object({
  q: z.string().trim().min(1, "Search term is required"),
  limit: z.coerce.number().int().positive().max(20).default(8),
});
