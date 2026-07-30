import type { z } from "zod";
import type { updateStoreSettingsSchema } from "./settings.validator";

export interface StoreSettings {
  id: string;
  storeName: string;
  supportEmail: string | null;
  supportPhone: string | null;
  storeAddress: string | null;
  currency: string;
  timezone: string;
  pesapalEnabled: boolean;
  codEnabled: boolean;
  bankTransferEnabled: boolean;
  newOrderAlerts: boolean;
  lowStockAlerts: boolean;
  marketingDigest: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// No .default() fields, so input and output are identical.
export type UpdateStoreSettingsInput = z.infer<typeof updateStoreSettingsSchema>;
