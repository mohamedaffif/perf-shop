import { prisma } from "@/lib/prisma";
import { cached, cacheKey, invalidateKey } from "@/lib/cache";
import type { StoreSettings as StoreSettingsRow } from "@/lib/generated/prisma/client";
import type { StoreSettings, UpdateStoreSettingsInput } from "./settings.types";

// Read on every checkout page view, order and payment initiation; changed
// only from the admin settings page, which invalidates it.
const SETTINGS_KEY = cacheKey("settings", "store");
const SETTINGS_TTL_SECONDS = 300;

function toStoreSettings(row: StoreSettingsRow): StoreSettings {
  return { ...row };
}

async function getOrCreateRow(): Promise<StoreSettingsRow> {
  const existing = await prisma.storeSettings.findFirst();
  if (existing) return existing;

  return prisma.storeSettings.create({ data: {} });
}

export async function getSettings(): Promise<StoreSettings> {
  const settings = await cached(SETTINGS_KEY, SETTINGS_TTL_SECONDS, async () =>
    toStoreSettings(await getOrCreateRow())
  );

  // The cache round-trips through JSON, which turns Dates into strings.
  return {
    ...settings,
    createdAt: new Date(settings.createdAt),
    updatedAt: new Date(settings.updatedAt),
  };
}

export async function updateSettings(data: UpdateStoreSettingsInput): Promise<StoreSettings> {
  const row = await getOrCreateRow();
  const updated = await prisma.storeSettings.update({ where: { id: row.id }, data });
  await invalidateKey(SETTINGS_KEY);
  return toStoreSettings(updated);
}
