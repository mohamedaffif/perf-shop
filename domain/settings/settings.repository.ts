import { prisma } from "@/lib/prisma";
import type { StoreSettings as StoreSettingsRow } from "@/lib/generated/prisma/client";
import type { StoreSettings, UpdateStoreSettingsInput } from "./settings.types";

function toStoreSettings(row: StoreSettingsRow): StoreSettings {
  return { ...row };
}

async function getOrCreateRow(): Promise<StoreSettingsRow> {
  const existing = await prisma.storeSettings.findFirst();
  if (existing) return existing;

  return prisma.storeSettings.create({ data: {} });
}

export async function getSettings(): Promise<StoreSettings> {
  const row = await getOrCreateRow();
  return toStoreSettings(row);
}

export async function updateSettings(data: UpdateStoreSettingsInput): Promise<StoreSettings> {
  const row = await getOrCreateRow();
  const updated = await prisma.storeSettings.update({ where: { id: row.id }, data });
  return toStoreSettings(updated);
}
