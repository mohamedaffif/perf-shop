import { cookies } from "next/headers";

import { COOKIE_NAME, parseConsentCookie, type ConsentState } from "@/lib/consent";

export async function readConsentCookieServer(): Promise<ConsentState | null> {
  const store = await cookies();
  return parseConsentCookie(store.get(COOKIE_NAME)?.value);
}
