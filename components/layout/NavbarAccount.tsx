"use client";

import Link from "next/link";
import { ShieldCheck, User } from "lucide-react";

import { useMenuUser } from "@/hooks/useMenuUser";
import { isStaffRole } from "@/lib/auth/roles";
import { SHOP_LIVE } from "@/lib/storefront";
import { UserMenu } from "./UserMenu";

const iconLinkClass =
  "text-foreground/80 hover:bg-muted hover:text-foreground inline-flex size-9 items-center justify-center rounded-full transition-colors";

export function NavbarAccount() {
  const { user, loading } = useMenuUser();

  // Same footprint as the icon button so the header doesn't shift on load.
  if (loading) return <span aria-hidden className="size-9" />;

  if (SHOP_LIVE) {
    return user ? (
      <UserMenu user={user} />
    ) : (
      <Link href="/login" aria-label="Sign in" className={iconLinkClass}>
        <User className="size-4" />
      </Link>
    );
  }

  // Teaser site has no account area, but staff still need a way into the admin.
  return isStaffRole(user?.role) ? (
    <Link href="/admin" aria-label="Admin dashboard" className={iconLinkClass}>
      <ShieldCheck className="size-4" />
    </Link>
  ) : null;
}
