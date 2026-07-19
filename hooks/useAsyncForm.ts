"use client";

import * as React from "react";

type AsyncFormResult = { error?: string } | void;

export function useAsyncForm(handler: (e: React.FormEvent) => Promise<AsyncFormResult>) {
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await handler(e);
      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return { error, isSubmitting, handleSubmit };
}
