import { z } from "zod";

export type ConsentCategory = "analytics" | "marketing";

export const CONSENT_VERSION = 1;
export const COOKIE_NAME = "ps_consent";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;

const consentSchema = z.object({
  necessary: z.literal(true),
  analytics: z.boolean(),
  marketing: z.boolean(),
  version: z.literal(CONSENT_VERSION),
  decidedAt: z.string(),
});

export type ConsentState = z.infer<typeof consentSchema>;

export function parseConsentCookie(raw: string | undefined | null): ConsentState | null {
  if (!raw) return null;

  try {
    const parsed = consentSchema.safeParse(JSON.parse(decodeURIComponent(raw)));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function serializeConsent(consent: ConsentState): string {
  return encodeURIComponent(JSON.stringify(consent));
}

export function buildConsentState(prefs: { analytics: boolean; marketing: boolean }): ConsentState {
  return {
    necessary: true,
    analytics: prefs.analytics,
    marketing: prefs.marketing,
    version: CONSENT_VERSION,
    decidedAt: new Date().toISOString(),
  };
}

let hasCachedCookieRead = false;
let cachedRawCookie: string | null = null;
let cachedConsent: ConsentState | null = null;

/**
 * Returns a referentially-stable value when the underlying cookie hasn't
 * changed, so this is safe to use as a `useSyncExternalStore` getSnapshot.
 */
export function readConsentCookieClient(): ConsentState | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  const raw = match?.[1] ?? null;

  if (hasCachedCookieRead && raw === cachedRawCookie) {
    return cachedConsent;
  }

  hasCachedCookieRead = true;
  cachedRawCookie = raw;
  cachedConsent = parseConsentCookie(raw);
  return cachedConsent;
}

export function writeConsentCookieClient(consent: ConsentState): void {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE_NAME}=${serializeConsent(consent)}; Path=/; Max-Age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
  window.dispatchEvent(new CustomEvent<ConsentState>("ps:consent-changed", { detail: consent }));
}

export function hasConsent(category: ConsentCategory, consent: ConsentState | null): boolean {
  if (!consent) return false;
  return consent[category];
}
