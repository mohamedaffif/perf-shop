import type { z } from "zod";
import type { createAddressSchema, updateAddressSchema } from "./address.validator";

export interface Address {
  id: string;
  label: string | null;
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// No .default() fields on either schema, so input and output are identical.
export type CreateAddressInput = z.infer<typeof createAddressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
