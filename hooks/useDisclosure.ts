"use client";

import * as React from "react";

interface UseDisclosureOptions {
  defaultOpen?: boolean;
  closeDelay?: number;
  closeOnEscape?: boolean;
}

export function useDisclosure({
  defaultOpen = false,
  closeDelay = 0,
  closeOnEscape = false,
}: UseDisclosureOptions = {}) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const closeTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPending = React.useCallback(() => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
  }, []);

  const open = React.useCallback(() => {
    clearPending();
    setIsOpen(true);
  }, [clearPending]);

  const close = React.useCallback(() => {
    if (closeDelay > 0) {
      closeTimeout.current = setTimeout(() => setIsOpen(false), closeDelay);
    } else {
      setIsOpen(false);
    }
  }, [closeDelay]);

  const toggle = React.useCallback(() => setIsOpen((v) => !v), []);

  React.useEffect(() => clearPending, [clearPending]);

  React.useEffect(() => {
    if (!closeOnEscape || !isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeOnEscape, isOpen]);

  return { isOpen, open, close, toggle, setIsOpen };
}
