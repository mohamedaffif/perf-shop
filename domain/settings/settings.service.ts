import * as settingsRepository from "./settings.repository";
import { updateStoreSettingsSchema } from "./settings.validator";
import type { StoreSettings } from "./settings.types";

export async function getStoreSettings(): Promise<StoreSettings> {
  return settingsRepository.getSettings();
}

export async function updateStoreSettings(rawInput: unknown): Promise<StoreSettings> {
  const input = updateStoreSettingsSchema.parse(rawInput);
  return settingsRepository.updateSettings(input);
}
