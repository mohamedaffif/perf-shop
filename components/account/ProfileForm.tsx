"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAsyncForm } from "@/hooks/useAsyncForm";
import { useUpdateProfileMutation } from "@/lib/api/accountApi";
import { getApiErrorMessage } from "@/lib/api/error-message";
import type { AccountProfile } from "@/domain/auth/auth.types";

interface ProfileFormProps {
  profile: AccountProfile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [name, setName] = useState(profile.name ?? "");
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { update } = useSession();
  const [updateProfile] = useUpdateProfileMutation();

  const { error, isSubmitting, handleSubmit } = useAsyncForm(async () => {
    setSuccess(false);

    try {
      await updateProfile({ name, phone }).unwrap();
    } catch (err) {
      return { error: getApiErrorMessage(err, "Something went wrong updating your profile.") };
    }

    // Re-read the name/photo into the session, then refresh the server-rendered header and overview.
    await update();
    router.refresh();
    setSuccess(true);
  });

  return (
    <form
      onSubmit={handleSubmit}
      className="border-border max-w-md space-y-4 rounded-lg border p-6"
    >
      <div className="space-y-1.5">
        <Label htmlFor="name">Name</Label>
        <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={profile.email} disabled />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+254 700 000000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      {error && <p className="text-danger-foreground text-sm">{error}</p>}
      {success && <p className="text-success-foreground text-sm">Profile updated.</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
