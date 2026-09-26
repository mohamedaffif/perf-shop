"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * False during SSR and hydration, true once running in the browser. Use it to
 * hold back UI that depends on browser-only state (cookies, session) so a
 * cached, user-agnostic page never paints the wrong thing first.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
