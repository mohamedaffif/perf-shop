"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAsyncForm } from "@/hooks/useAsyncForm";

interface CouponInputProps {
  subtotal: number;
  appliedCode: string | null;
  onApply: (code: string, discountAmount: number) => void;
  onRemove: () => void;
}

export function CouponInput({ subtotal, appliedCode, onApply, onRemove }: CouponInputProps) {
  const [code, setCode] = useState("");

  const { error, isSubmitting, handleSubmit } = useAsyncForm(async () => {
    const response = await fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, subtotal }),
    });

    const body = await response.json().catch(() => null);

    if (!response.ok || !body?.valid) {
      return { error: body?.error ?? "Invalid coupon code." };
    }

    onApply(body.coupon.code, body.discountAmount);
    setCode("");
  });

  if (appliedCode) {
    return (
      <div className="border-border flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
        <span>
          Coupon <span className="font-semibold">{appliedCode}</span> applied
        </span>
        <button type="button" onClick={onRemove} className="text-muted-foreground hover:text-foreground">
          Remove
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1.5">
      <div className="flex gap-2">
        <Input
          placeholder="Coupon code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
        />
        <Button type="submit" variant="outline" disabled={isSubmitting || !code}>
          {isSubmitting ? "Checking…" : "Apply"}
        </Button>
      </div>
      {error && <p className="text-danger-foreground text-xs">{error}</p>}
    </form>
  );
}
