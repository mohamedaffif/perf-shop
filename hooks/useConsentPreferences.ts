"use client";

import { useConsent } from "@/hooks/useConsent";
import { useDisclosure } from "@/hooks/useDisclosure";
import type { ConsentState } from "@/lib/consent";

export function useConsentPreferences(initialConsent?: ConsentState | null) {
  const { consent, hasDecided, acceptAll, rejectAll, savePreferences } = useConsent(initialConsent);
  const { isOpen, open, close } = useDisclosure();

  return {
    hasDecided,
    openPreferences: open,
    dialogProps: {
      open: isOpen,
      onOpenChange: (next: boolean) => {
        if (!next) close();
      },
      consent,
      onAcceptAll: () => {
        acceptAll();
        close();
      },
      onRejectAll: () => {
        rejectAll();
        close();
      },
      onSave: (prefs: { analytics: boolean; marketing: boolean }) => {
        savePreferences(prefs);
        close();
      },
    },
  };
}
