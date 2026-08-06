"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Typography } from "@/components/ui/typography";
import { useCart } from "@/hooks/useCart";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";
import { PAYMENT_METHOD_LABELS } from "@/components/order/order-meta";
import type { PaymentMethod } from "@/domain/order/order.types";

interface CheckoutPageClientProps {
  pesapalEnabled: boolean;
  codEnabled: boolean;
  bankTransferEnabled: boolean;
  initialEmail: string;
  initialFullName: string;
}

export function CheckoutPageClient({
  pesapalEnabled,
  codEnabled,
  bankTransferEnabled,
  initialEmail,
  initialFullName,
}: CheckoutPageClientProps) {
  const { items } = useCart();
  const router = useRouter();

  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [shippingCity, setShippingCity] = useState("");

  useEffect(() => {
    if (items.length === 0) router.replace("/shop");
  }, [items.length, router]);

  if (items.length === 0) return null;

  const availablePaymentMethods: { value: PaymentMethod; label: string }[] = [
    ...(pesapalEnabled
      ? [{ value: "PESAPAL" as const, label: PAYMENT_METHOD_LABELS.PESAPAL }]
      : []),
    ...(codEnabled ? [{ value: "COD" as const, label: PAYMENT_METHOD_LABELS.COD }] : []),
    ...(bankTransferEnabled
      ? [{ value: "BANK_TRANSFER" as const, label: PAYMENT_METHOD_LABELS.BANK_TRANSFER }]
      : []),
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <Typography variant="h1" className="mb-8">
        Checkout
      </Typography>
      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <CheckoutForm
          couponCode={couponCode}
          onCityChange={setShippingCity}
          availablePaymentMethods={availablePaymentMethods}
          initialEmail={initialEmail}
          initialFullName={initialFullName}
        />
        <CheckoutSummary
          couponCode={couponCode}
          discountAmount={discountAmount}
          onApplyCoupon={(code, discount) => {
            setCouponCode(code);
            setDiscountAmount(discount);
          }}
          onRemoveCoupon={() => {
            setCouponCode(null);
            setDiscountAmount(0);
          }}
          shippingCity={shippingCity}
        />
      </div>
    </div>
  );
}
