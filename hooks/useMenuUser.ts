"use client";

import { useSession } from "next-auth/react";

import { toMenuUser, type MenuUser } from "@/lib/auth/menu-user";

/**
 * The signed-in user for navigation menus, read client-side from the
 * SessionProvider so shared layouts never call auth() on the server (which
 * would make every storefront page render per request).
 */
export function useMenuUser(): { user: MenuUser | null; loading: boolean } {
  const { data, status } = useSession();
  return { user: toMenuUser(data?.user), loading: status === "loading" };
}
