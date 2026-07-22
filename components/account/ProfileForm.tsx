"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAsyncForm } from "@/hooks/useAsyncForm";
import type { AuthUser } from "@/domain/auth/auth.types";

interface ProfileFormProps {
  profile: AuthUser;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [name, setName] = useState(profile.name ?? "");
  const [success, setSuccess] = useState(false);

  const { error, isSubmitting, handleSubmit } = useAsyncForm(async () => {
    setSuccess(false);
    const response = await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      return { error: body?.error ?? "Something went wrong updating your profile." };
    }

    setSuccess(true);
  });

  return (
    <form onSubmit={handleSubmit} className="border-border max-w-md space-y-4 rounded-lg border p-6">
      <div className="space-y-1.5">
        <Label htmlFor="name">Name</Label>
        <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={profile.email} disabled />
      </div>

      {error && <p className="text-danger-foreground text-sm">{error}</p>}
      {success && <p className="text-success-foreground text-sm">Profile updated.</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
