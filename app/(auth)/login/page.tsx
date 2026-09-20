"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { useAsyncForm } from "@/hooks/useAsyncForm";
import { getAuthErrorMessage } from "@/lib/auth/auth-errors";
import { sanitizeCallbackUrl } from "@/lib/auth/callback-url";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = sanitizeCallbackUrl(searchParams.get("callbackUrl"));
  const redirectError = getAuthErrorMessage(searchParams.get("error"));

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const { error, isSubmitting, handleSubmit } = useAsyncForm(async () => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { error: "Invalid email or password." };
    }

    window.location.href = callbackUrl;
  });

  return (
    <div className="border-border bg-card rounded-lg border p-6">
      <h1 className="font-heading text-card-foreground mb-6 text-xl font-semibold">Sign in</h1>

      {redirectError && <p className="text-danger-foreground mb-4 text-sm">{redirectError}</p>}

      <OAuthButtons callbackUrl={callbackUrl} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-danger-foreground text-sm">{error}</p>}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="text-muted-foreground mt-6 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link
          href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          className="text-primary hover:underline"
        >
          Register
        </Link>
      </p>
    </div>
  );
}
