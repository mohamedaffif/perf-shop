"use client";

import { useState } from "react";

import { useAsyncForm } from "@/hooks/useAsyncForm";
import { useSubscribeMutation } from "@/lib/api/newsletterApi";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscribe] = useSubscribeMutation();

  const { error, isSubmitting, handleSubmit } = useAsyncForm(async () => {
    try {
      await subscribe(email).unwrap();
      setSubscribed(true);
      setEmail("");
    } catch {
      return { error: "Something went wrong. Please try again." };
    }
  });

  if (subscribed) {
    return <p className="text-card-foreground mt-4 text-sm">You&apos;re subscribed. Thank you!</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <input
          type="email"
          required
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border-border bg-input/30 text-card-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 flex-1 rounded-full border px-4 text-sm outline-none focus-visible:ring-[3px]"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary text-primary-foreground hover:bg-primary/80 inline-flex h-10 shrink-0 items-center justify-center rounded-full px-4 text-sm font-medium transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Subscribing…" : "Subscribe"}
        </button>
      </div>
      {error && <p className="text-danger-foreground text-xs">{error}</p>}
    </form>
  );
}
