"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAsyncForm } from "@/hooks/useAsyncForm";
import { useSendContactMessageMutation } from "@/lib/api/contactApi";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [sendContactMessage] = useSendContactMessageMutation();

  const { error, isSubmitting, handleSubmit } = useAsyncForm(async () => {
    try {
      await sendContactMessage({ name, email, message }).unwrap();
      setSent(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      return { error: "Something went wrong. Please try again." };
    }
  });

  if (sent) {
    return (
      <p className="text-foreground text-sm">
        Thanks for reaching out — we&apos;ll get back to you shortly.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact-name">Name</Label>
        <Input
          id="contact-name"
          required
          maxLength={120}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact-email">Email</Label>
        <Input
          id="contact-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea
          id="contact-message"
          required
          rows={5}
          minLength={10}
          maxLength={4000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      {error && <p className="text-danger-foreground text-xs">{error}</p>}
      <Button type="submit" variant="secondary" disabled={isSubmitting} className="self-start">
        {isSubmitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
