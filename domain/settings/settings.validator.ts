import { z } from "zod";

export const updateStoreSettingsSchema = z.object({
  storeName: z.string().min(1).optional(),
  supportEmail: z.string().email().optional(),
  supportPhone: z.string().min(1).optional(),
  storeAddress: z.string().min(1).optional(),
  currency: z.string().min(1).optional(),
  timezone: z.string().min(1).optional(),
  pesapalEnabled: z.boolean().optional(),
  codEnabled: z.boolean().optional(),
  bankTransferEnabled: z.boolean().optional(),
  newOrderAlerts: z.boolean().optional(),
  lowStockAlerts: z.boolean().optional(),
  marketingDigest: z.boolean().optional(),
});
