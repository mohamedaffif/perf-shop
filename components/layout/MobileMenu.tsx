"use client";

import * as React from "react";
import Link from "next/link";
import { Dialog } from "radix-ui";
import { ChevronDown, Menu, ShieldCheck, User, X } from "lucide-react";

import { SignOutButton } from "@/components/account/SignOutButton";
import { UserAvatar } from "@/components/account/UserAvatar";
import { useDisclosure } from "@/hooks/useDisclosure";
import { ACCOUNT_NAV } from "@/lib/account-nav";
import type { MenuUser } from "@/lib/auth/menu-user";
import { isStaffRole } from "@/lib/auth/roles";
import { cn } from "@/lib/utils";
import { SHOP_LIVE } from "@/lib/storefront";
import type { NavLink } from "./Navbar";

const footerLinkClass =
  "text-foreground hover:bg-muted flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors";

export function MobileMenu({ links, user }: { links: NavLink[]; user: MenuUser | null }) {
  const { isOpen: open, close, setIsOpen } = useDisclosure();
  const [expanded, setExpanded] = React.useState<string | null>(null);

  return (
    <Dialog.Root open={open} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className="text-foreground/80 hover:bg-muted hover:text-foreground inline-flex size-9 items-center justify-center rounded-full transition-colors lg:hidden"
        >
          <Menu className="size-5" />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/60" />
        <Dialog.Content className="border-border bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left fixed inset-y-0 left-0 z-50 flex h-full w-[85vw] max-w-sm flex-col overflow-y-auto border-r p-6 shadow-(--shadow-card)">
          <div className="flex items-center justify-between">
            <Dialog.Title className="font-heading text-foreground text-lg font-semibold">
              Menu
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close menu"
                className="text-foreground/80 hover:bg-muted hover:text-foreground inline-flex size-9 items-center justify-center rounded-full transition-colors"
              >
                <X className="size-5" />
              </button>
            </Dialog.Close>
          </div>

          <nav className="mt-6 flex flex-col gap-1">
            {links.map((link) => {
              const hasMenu = Boolean(link.megaMenu);
              const isOpen = expanded === link.href;

              if (!hasMenu) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={close}
                    className="text-foreground hover:bg-muted rounded-md px-3 py-3 text-sm font-medium tracking-[0.2em] uppercase transition-colors"
                  >
                    {link.label}
                  </Link>
                );
              }

              return (
                <div key={link.href} className="border-border/60 border-b last:border-none">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setExpanded(isOpen ? null : link.href)}
                    className="text-foreground hover:bg-muted flex w-full items-center justify-between rounded-md px-3 py-3 text-sm font-medium tracking-[0.2em] uppercase transition-colors"
                  >
                    {link.label}
                    <ChevronDown
                      className={cn("size-4 transition-transform", isOpen && "rotate-180")}
                    />
                  </button>

                  {isOpen && (
                    <div className="grid grid-cols-2 gap-4 px-3 pb-4">
                      {link.megaMenu?.sections.map((section) => (
                        <div key={section.heading}>
                          <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-[0.15em] uppercase">
                            {section.heading}
                          </p>
                          <ul className="space-y-2">
                            {section.links.map((item) => (
                              <li key={item.href}>
                                <Link
                                  href={item.href}
                                  onClick={close}
                                  className="text-foreground/80 hover:text-primary text-sm transition-colors"
                                >
                                  {item.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {SHOP_LIVE && (
            <div className="border-border mt-auto flex flex-col gap-1 border-t pt-4">
              {user ? (
                <>
                  <div className="mb-2 flex items-center gap-3 px-3">
                    <UserAvatar name={user.name} email={user.email} image={user.image} />
                    <div className="min-w-0">
                      <p className="text-foreground truncate text-sm font-medium">
                        {user.name ?? "My account"}
                      </p>
                      <p className="text-muted-foreground truncate text-xs">{user.email}</p>
                    </div>
                  </div>
                  {ACCOUNT_NAV.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={close}
                      className={footerLinkClass}
                    >
                      {item.label}
                    </Link>
                  ))}
                  {isStaffRole(user.role) && (
                    <Link href="/admin" onClick={close} className={footerLinkClass}>
                      <ShieldCheck className="size-4" />
                      Admin dashboard
                    </Link>
                  )}
                  <SignOutButton className={footerLinkClass} />
                </>
              ) : (
                <Link href="/login" onClick={close} className={footerLinkClass}>
                  <User className="size-4" />
                  Sign in
                </Link>
              )}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
