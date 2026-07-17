"use client";

import * as React from "react";
import { X } from "lucide-react";

const MESSAGES = [
  "Free shipping on all orders over $75",
  "New arrivals just dropped — shop the latest scents",
  "Buy 2 fragrances, get 15% off with code PERF15",
];

export function AnnouncementBar() {
  const [visible, setVisible] = React.useState(true);
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="bg-primary text-primary-foreground relative flex h-9 items-center justify-center px-8">
      <p className="text-xs font-medium tracking-wide">{MESSAGES[index]}</p>
      <button
        type="button"
        aria-label="Dismiss announcement"
        onClick={() => setVisible(false)}
        className="hover:bg-primary-foreground/10 absolute right-3 inline-flex size-6 items-center justify-center rounded-full transition-colors"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}
