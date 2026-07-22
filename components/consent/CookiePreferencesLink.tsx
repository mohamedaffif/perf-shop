"use client";

import { useConsentPreferences } from "@/hooks/useConsentPreferences";
import { CookiePreferencesDialog } from "@/components/consent/CookiePreferencesDialog";

export function CookiePreferencesLink() {
  const { openPreferences, dialogProps } = useConsentPreferences();

  return (
    <>
      <button type="button" onClick={openPreferences} className="hover:text-primary">
        Cookie Preferences
      </button>

      <CookiePreferencesDialog {...dialogProps} />
    </>
  );
}
