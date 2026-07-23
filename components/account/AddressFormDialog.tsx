"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAsyncForm } from "@/hooks/useAsyncForm";
import { useCreateAddressMutation, useUpdateAddressMutation } from "@/lib/api/addressesApi";
import type { Address } from "@/domain/address/address.types";

interface AddressFormDialogProps {
  address?: Address;
  trigger: React.ReactNode;
}

const emptyForm = {
  label: "",
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "Kenya",
  isDefault: false,
};

export function AddressFormDialog({ address, trigger }: AddressFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(
    address
      ? { ...emptyForm, ...address, label: address.label ?? "", line2: address.line2 ?? "" }
      : emptyForm
  );

  const [createAddress] = useCreateAddressMutation();
  const [updateAddress] = useUpdateAddressMutation();

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const { error, isSubmitting, handleSubmit } = useAsyncForm(async () => {
    const payload = {
      label: form.label || undefined,
      fullName: form.fullName,
      phone: form.phone,
      line1: form.line1,
      line2: form.line2 || undefined,
      city: form.city,
      state: form.state,
      postalCode: form.postalCode,
      country: form.country,
      isDefault: form.isDefault,
    };

    try {
      if (address) {
        await updateAddress({ id: address.id, data: payload }).unwrap();
      } else {
        await createAddress(payload).unwrap();
      }
      setOpen(false);
    } catch {
      return { error: "Something went wrong saving this address." };
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{address ? "Edit address" : "Add address"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="label">Label (optional)</Label>
            <Input
              id="label"
              placeholder="Home, Office…"
              value={form.label}
              onChange={set("label")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" required value={form.fullName} onChange={set("fullName")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" required value={form.phone} onChange={set("phone")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="line1">Address</Label>
            <Input id="line1" required value={form.line1} onChange={set("line1")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="line2">Apartment, suite, etc. (optional)</Label>
            <Input id="line2" value={form.line2} onChange={set("line2")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="city">City</Label>
              <Input id="city" required value={form.city} onChange={set("city")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="state">State / Region</Label>
              <Input id="state" required value={form.state} onChange={set("state")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="postalCode">Postal code</Label>
              <Input
                id="postalCode"
                required
                value={form.postalCode}
                onChange={set("postalCode")}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="country">Country</Label>
              <Input id="country" required value={form.country} onChange={set("country")} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="isDefault"
              checked={form.isDefault}
              onCheckedChange={(checked) => setForm((f) => ({ ...f, isDefault: checked === true }))}
            />
            <Label htmlFor="isDefault">Set as default address</Label>
          </div>

          {error && <p className="text-danger-foreground text-sm">{error}</p>}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save address"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
