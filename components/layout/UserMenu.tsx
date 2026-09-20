"use client";

import Link from "next/link";
import { LogOut, ShieldCheck } from "lucide-react";

import { UserAvatar } from "@/components/account/UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSignOut } from "@/hooks/useSignOut";
import { ACCOUNT_NAV } from "@/lib/account-nav";
import type { MenuUser } from "@/lib/auth/menu-user";
import { isStaffRole } from "@/lib/auth/roles";

export function UserMenu({ user }: { user: MenuUser }) {
  const signOut = useSignOut();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Account menu"
          className="hover:bg-muted focus-visible:ring-ring/50 inline-flex size-9 items-center justify-center rounded-full transition-colors outline-none focus-visible:ring-[3px]"
        >
          <UserAvatar name={user.name} email={user.email} image={user.image} className="size-7" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>
          <p className="text-foreground truncate font-medium">{user.name ?? "My account"}</p>
          <p className="text-muted-foreground truncate text-xs font-normal">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {ACCOUNT_NAV.map((item) => (
          <DropdownMenuItem key={item.href} asChild>
            <Link href={item.href}>{item.label}</Link>
          </DropdownMenuItem>
        ))}

        {isStaffRole(user.role) && (
          <DropdownMenuItem asChild>
            <Link href="/admin">
              <ShieldCheck />
              Admin dashboard
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={signOut}>
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
