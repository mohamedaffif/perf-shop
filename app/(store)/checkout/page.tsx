"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Typography } from "@/components/ui/typography";
import { useCart } from "@/hooks/useCart";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";

export default function CheckoutPage() {
  const { items } = useCart();
  const router = useRouter();

  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [shippingCity, setShippingCity] = useState("");

  useEffect(() => {
    if (items.length === 0) router.replace("/shop");
  }, [items.length, router]);

  if (items.length === 0) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <Typography variant="h1" className="mb-8">
        Checkout
      </Typography>
      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <CheckoutForm couponCode={couponCode} onCityChange={setShippingCity} />
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
