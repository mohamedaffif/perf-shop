"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAsyncForm } from "@/hooks/useAsyncForm";
import { useCart } from "@/hooks/useCart";
import { useCreateOrderMutation, type PlaceOrderResponse } from "@/lib/api/ordersApi";
import { isOneOf } from "@/lib/type-guards";
import { paymentMethodSchema } from "@/domain/order/order.validator";
import type { PaymentMethod } from "@/domain/order/order.types";

type FormField =
  | "email"
  | "phone"
  | "shippingFullName"
  | "shippingLine1"
  | "shippingLine2"
  | "shippingCity"
  | "shippingState"
  | "shippingPostalCode"
  | "shippingCountry";

interface CheckoutFormProps {
  couponCode: string | null;
  onCityChange: (city: string) => void;
  availablePaymentMethods: { value: PaymentMethod; label: string }[];
  initialEmail: string;
  initialFullName: string;
}

export function CheckoutForm({
  couponCode,
  onCityChange,
  availablePaymentMethods,
  initialEmail,
  initialFullName,
}: CheckoutFormProps) {
  const [form, setForm] = useState({
    email: initialEmail,
    phone: "",
    shippingFullName: initialFullName,
    shippingLine1: "",
    shippingLine2: "",
    shippingCity: "",
    shippingState: "",
    shippingPostalCode: "",
    shippingCountry: "Kenya",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | undefined>(
    availablePaymentMethods[0]?.value
  );
  const { items, clear } = useCart();
  const router = useRouter();
  const [createOrder] = useCreateOrderMutation();

  const set = (field: FormField) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const { error, isSubmitting, handleSubmit } = useAsyncForm(async () => {
    if (!paymentMethod) {
      return { error: "Please select a payment method." };
    }

    let body: PlaceOrderResponse;
    try {
      body = await createOrder({
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
        couponCode: couponCode || undefined,
        paymentMethod,
        items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
      }).unwrap();
    } catch (err) {
      const message =
        err && typeof err === "object" && "data" in err
          ? ((err.data as { error?: string } | undefined)?.error ??
            "Something went wrong placing your order.")
          : "Something went wrong placing your order.";
      return { error: message };
    }

    clear();

    if (body.paymentRedirectUrl) {
      // External Pesapal-hosted page, not a Next.js route.
      window.location.href = body.paymentRedirectUrl;
      return;
    }

    if (body.paymentError) {
      router.push(`/order/${body.order.orderNumber}?paymentError=1`);
      return;
    }

    router.push(`/order/${body.order.orderNumber}`);
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
            onChange={(e) => {
              setForm((f) => ({ ...f, shippingCity: e.target.value }));
              onCityChange(e.target.value);
            }}
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

      <div className="space-y-1.5">
        <Label>Payment method</Label>
        {availablePaymentMethods.length > 0 ? (
          <RadioGroup
            value={paymentMethod}
            onValueChange={(value) => {
              if (isOneOf(paymentMethodSchema.options, value)) setPaymentMethod(value);
            }}
          >
            {availablePaymentMethods.map((method) => (
              <div key={method.value} className="flex items-center gap-2">
                <RadioGroupItem value={method.value} id={`payment-${method.value}`} />
                <Label htmlFor={`payment-${method.value}`} className="font-normal">
                  {method.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        ) : (
          <p className="text-danger-foreground text-sm">
            No payment methods are currently available.
          </p>
        )}
      </div>

      {error && <p className="text-danger-foreground text-sm">{error}</p>}

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={isSubmitting || availablePaymentMethods.length === 0}
      >
        {isSubmitting ? "Placing order…" : "Place order"}
      </Button>
    </form>
  );
}
