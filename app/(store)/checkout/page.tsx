"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Typography } from "@/components/ui/typography";
import { useCart } from "@/hooks/useCart";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";

export default function CheckoutPage() {
  const { items } = useCart();
  const router = useRouter();

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
        <CheckoutForm />
        <CheckoutSummary />
      </div>
    </div>
  );
}
