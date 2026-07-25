"use client";

import Link from "next/link";
import { Dialog } from "radix-ui";
import { Menu, X } from "lucide-react";

import { useDisclosure } from "@/hooks/useDisclosure";

type AdminNavLink = { label: string; href: string };

export function AdminMobileNav({ links }: { links: AdminNavLink[] }) {
  const { isOpen: open, close, setIsOpen } = useDisclosure();

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
              Admin Menu
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
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className="text-foreground hover:bg-muted rounded-md px-3 py-3 text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
