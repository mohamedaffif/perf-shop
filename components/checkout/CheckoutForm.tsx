"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAsyncForm } from "@/hooks/useAsyncForm";
import { useCart } from "@/hooks/useCart";

const initialForm = {
  email: "",
  phone: "",
  shippingFullName: "",
  shippingLine1: "",
  shippingLine2: "",
  shippingCity: "",
  shippingState: "",
  shippingPostalCode: "",
  shippingCountry: "Kenya",
};

type FormField = keyof typeof initialForm;

export function CheckoutForm() {
  const [form, setForm] = useState(initialForm);
  const { items, clear } = useCart();
  const router = useRouter();

  const set = (field: FormField) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const { error, isSubmitting, handleSubmit } = useAsyncForm(async () => {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        phone: form.phone || undefined,
        shippingFullName: form.shippingFullName,
        shippingPhone: form.phone,
        shippingLine1: form.shippingLine1,
        shippingLine2: form.shippingLine2 || undefined,
        shippingCity: form.shippingCity,
        shippingState: form.shippingState,
        shippingPostalCode: form.shippingPostalCode,
        shippingCountry: form.shippingCountry,
        items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
      }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      return { error: body?.error ?? "Something went wrong placing your order." };
    }

    const order = await response.json();
    clear();
    router.push(`/order/${order.orderNumber}`);
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" required value={form.email} onChange={set("email")} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" type="tel" required value={form.phone} onChange={set("phone")} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="shippingFullName">Full name</Label>
        <Input
          id="shippingFullName"
          required
          value={form.shippingFullName}
          onChange={set("shippingFullName")}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="shippingLine1">Address</Label>
        <Input
          id="shippingLine1"
          required
          value={form.shippingLine1}
          onChange={set("shippingLine1")}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="shippingLine2">Apartment, suite, etc. (optional)</Label>
        <Input id="shippingLine2" value={form.shippingLine2} onChange={set("shippingLine2")} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="shippingCity">City</Label>
          <Input
            id="shippingCity"
            required
            value={form.shippingCity}
            onChange={set("shippingCity")}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="shippingState">State / Region</Label>
          <Input
            id="shippingState"
            required
            value={form.shippingState}
            onChange={set("shippingState")}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="shippingPostalCode">Postal code</Label>
          <Input
            id="shippingPostalCode"
            required
            value={form.shippingPostalCode}
            onChange={set("shippingPostalCode")}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="shippingCountry">Country</Label>
          <Input
            id="shippingCountry"
            required
            value={form.shippingCountry}
            onChange={set("shippingCountry")}
          />
        </div>
      </div>

      {error && <p className="text-danger-foreground text-sm">{error}</p>}

      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Placing order…" : "Place order"}
      </Button>
    </form>
  );
}
