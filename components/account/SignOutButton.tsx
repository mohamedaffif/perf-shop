"use client";

import { LogOut } from "lucide-react";

import { useSignOut } from "@/hooks/useSignOut";
import { cn } from "@/lib/utils";

export function SignOutButton({ className }: { className?: string }) {
  const signOut = useSignOut();

  return (
    <button
      type="button"
      onClick={signOut}
      className={cn("inline-flex items-center gap-2", className)}
    >
      <LogOut className="size-4" />
      Sign out
    </button>
  );
}
