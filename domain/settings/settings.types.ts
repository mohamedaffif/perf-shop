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

export interface UpdateStoreSettingsInput {
  storeName?: string;
  supportEmail?: string;
  supportPhone?: string;
  storeAddress?: string;
  currency?: string;
  timezone?: string;
  pesapalEnabled?: boolean;
  codEnabled?: boolean;
  bankTransferEnabled?: boolean;
  newOrderAlerts?: boolean;
  lowStockAlerts?: boolean;
  marketingDigest?: boolean;
}
