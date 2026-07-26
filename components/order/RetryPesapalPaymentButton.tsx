"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useRetryPesapalPaymentMutation } from "@/lib/api/ordersApi";

interface RetryPesapalPaymentButtonProps {
  orderNumber: string;
}

export function RetryPesapalPaymentButton({ orderNumber }: RetryPesapalPaymentButtonProps) {
  const [retryPayment, { isLoading }] = useRetryPesapalPaymentMutation();
  const [error, setError] = useState<string | null>(null);

  async function handleRetry() {
    setError(null);
    try {
      const { redirectUrl } = await retryPayment(orderNumber).unwrap();
      window.location.href = redirectUrl;
    } catch (err) {
      const message =
        err && typeof err === "object" && "data" in err
          ? ((err.data as { error?: string } | undefined)?.error ?? "Failed to restart payment.")
          : "Failed to restart payment.";
      setError(message);
    }
  }

  return (
    <div className="mt-8">
      <Button className="w-full" size="lg" disabled={isLoading} onClick={handleRetry}>
        {isLoading ? "Redirecting…" : "Retry payment"}
      </Button>
      {error && <p className="text-danger-foreground mt-2 text-sm">{error}</p>}
    </div>
  );
}
