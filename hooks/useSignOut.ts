"use client";

import { signOut } from "next-auth/react";

// signOut() ends with a full-page navigation, so in-memory RTK Query data is dropped on its own.
// The persisted cart is deliberately kept.
export function useSignOut() {
  return () => signOut({ callbackUrl: "/" });
}
