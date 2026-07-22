"use client";

import * as React from "react";

import {
  buildConsentState,
  hasConsent as checkConsent,
  readConsentCookieClient,
  writeConsentCookieClient,
  type ConsentCategory,
  type ConsentState,
} from "@/lib/consent";

function subscribeToConsentChanges(callback: () => void) {
  window.addEventListener("ps:consent-changed", callback);
  return () => window.removeEventListener("ps:consent-changed", callback);
}

export function useConsent(initialConsent?: ConsentState | null) {
  // No server-provided value (e.g. the standalone Footer link) falls back to
  // null for the SSR/hydration snapshot, since `document` isn't available server-side.
  const getServerSnapshot = React.useCallback(() => initialConsent ?? null, [initialConsent]);

  const consent = React.useSyncExternalStore(
    subscribeToConsentChanges,
    readConsentCookieClient,
    getServerSnapshot
  );

  const savePreferences = React.useCallback((prefs: { analytics: boolean; marketing: boolean }) => {
    writeConsentCookieClient(buildConsentState(prefs));
  }, []);

  const acceptAll = React.useCallback(
    () => savePreferences({ analytics: true, marketing: true }),
    [savePreferences]
  );

  const rejectAll = React.useCallback(
    () => savePreferences({ analytics: false, marketing: false }),
    [savePreferences]
  );

  return {
    consent,
    hasDecided: consent !== null,
    hasConsent: (category: ConsentCategory) => checkConsent(category, consent),
    acceptAll,
    rejectAll,
    savePreferences,
  };
}
