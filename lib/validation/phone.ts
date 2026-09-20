import { z } from "zod";

export const phoneSchema = z.string().min(7);
