"use client";

import * as React from "react";
import { signIn } from "next-auth/react";

import { GoogleLogo } from "@/components/auth/GoogleLogo";
import { Button } from "@/components/ui/button";

const OAUTH_ENABLED = process.env.NEXT_PUBLIC_OAUTH_ENABLED === "true";

const LABELS: Record<string, string> = {
  google: "Continue with Google",
  github: "Continue with GitHub",
};

interface OAuthButtonsProps {
  callbackUrl: string;
  providers?: ("google" | "github")[];
}

export function OAuthButtons({ callbackUrl, providers = ["google", "github"] }: OAuthButtonsProps) {
  // Set once a flow starts so a double-click can't kick off two redirects. Left set on
  // purpose: the page navigates away to the provider.
  const [pendingProvider, setPendingProvider] = React.useState<string | null>(null);

  if (!OAUTH_ENABLED) return null;

  return (
    <>
      <div className="mb-4 flex flex-col gap-3">
        {providers.map((provider) => (
          <Button
            key={provider}
            type="button"
            variant="outline"
            className="w-full"
            disabled={pendingProvider !== null}
            onClick={() => {
              setPendingProvider(provider);
              void signIn(provider, { callbackUrl });
            }}
          >
            {provider === "google" && <GoogleLogo className="size-4" />}
            {pendingProvider === provider ? "Redirecting…" : LABELS[provider]}
          </Button>
        ))}
      </div>

      <div className="mb-4 flex items-center gap-3">
        <div className="bg-border h-px flex-1" />
        <span className="text-muted-foreground text-xs">or</span>
        <div className="bg-border h-px flex-1" />
      </div>
    </>
  );
}
