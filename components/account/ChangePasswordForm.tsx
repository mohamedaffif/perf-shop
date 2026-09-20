"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAsyncForm } from "@/hooks/useAsyncForm";
import { useChangePasswordMutation } from "@/lib/api/accountApi";
import { getApiErrorMessage } from "@/lib/api/error-message";

const emptyForm = { currentPassword: "", newPassword: "", confirmPassword: "" };

export function ChangePasswordForm() {
  const [form, setForm] = useState(emptyForm);
  const [success, setSuccess] = useState(false);
  const [changePassword] = useChangePasswordMutation();

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const { error, isSubmitting, handleSubmit } = useAsyncForm(async () => {
    setSuccess(false);

    if (form.newPassword !== form.confirmPassword) {
      return { error: "The new passwords don't match." };
    }

    try {
      await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      }).unwrap();
    } catch (err) {
      return { error: getApiErrorMessage(err, "Something went wrong changing your password.") };
    }

    setForm(emptyForm);
    setSuccess(true);
  });

  return (
    <form
      onSubmit={handleSubmit}
      className="border-border max-w-md space-y-4 rounded-lg border p-6"
    >
      <h2 className="text-foreground text-base font-medium">Change password</h2>

      <div className="space-y-1.5">
        <Label htmlFor="currentPassword">Current password</Label>
        <Input
          id="currentPassword"
          type="password"
          autoComplete="current-password"
          required
          value={form.currentPassword}
          onChange={set("currentPassword")}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="newPassword">New password</Label>
        <Input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          value={form.newPassword}
          onChange={set("newPassword")}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          value={form.confirmPassword}
          onChange={set("confirmPassword")}
        />
      </div>

      {error && <p className="text-danger-foreground text-sm">{error}</p>}
      {success && <p className="text-success-foreground text-sm">Password updated.</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Updating…" : "Update password"}
      </Button>
    </form>
  );
}
