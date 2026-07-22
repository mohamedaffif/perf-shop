"use client";

import Link from "next/link";

import { useConsentPreferences } from "@/hooks/useConsentPreferences";
import { Button } from "@/components/ui/button";
import { CookiePreferencesDialog } from "@/components/consent/CookiePreferencesDialog";
import type { ConsentState } from "@/lib/consent";

interface CookieConsentBannerProps {
  initialConsent: ConsentState | null;
}

export function CookieConsentBanner({ initialConsent }: CookieConsentBannerProps) {
  const { hasDecided, openPreferences, dialogProps } = useConsentPreferences(initialConsent);

  return (
    <>
      {!hasDecided && (
        <div className="border-border bg-card text-card-foreground fixed inset-x-0 bottom-0 z-50 border-t shadow-lg">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-4 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
            <p className="text-muted-foreground text-sm">
              We use cookies to run the site and, with your permission, for analytics and marketing.
              See our{" "}
              <Link href="/privacy-policy" className="text-primary underline underline-offset-2">
                Privacy Policy
              </Link>{" "}
              for details.
            </p>
            <div className="flex shrink-0 items-center gap-2">
              <Button variant="ghost" size="sm" onClick={openPreferences}>
                Manage Preferences
              </Button>
              <Button variant="outline" size="sm" onClick={dialogProps.onRejectAll}>
                Reject All
              </Button>
              <Button variant="secondary" size="sm" onClick={dialogProps.onAcceptAll}>
                Accept All
              </Button>
            </div>
          </div>
        </div>
      )}

      <CookiePreferencesDialog {...dialogProps} />
    </>
  );
}
