"use client"

import * as React from "react"
import Link from "next/link"
import { Dialog } from "radix-ui"
import { ChevronDown, Menu, User, X } from "lucide-react"

import { cn } from "@/lib/utils"
import type { NavLink } from "./Navbar"

export function MobileMenu({ links }: { links: NavLink[] }) {
  const [open, setOpen] = React.useState(false)
  const [expanded, setExpanded] = React.useState<string | null>(null)

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className="inline-flex size-9 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-muted hover:text-foreground lg:hidden"
        >
          <Menu className="size-5" />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed inset-y-0 left-0 z-50 flex h-full w-[85vw] max-w-sm flex-col overflow-y-auto border-r border-border bg-background p-6 shadow-[var(--shadow-card)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left">
          <div className="flex items-center justify-between">
            <Dialog.Title className="font-heading text-lg font-semibold text-foreground">
              Menu
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close menu"
                className="inline-flex size-9 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </Dialog.Close>
          </div>

          <nav className="mt-6 flex flex-col gap-1">
            {links.map((link) => {
              const hasMenu = Boolean(link.megaMenu)
              const isOpen = expanded === link.href

              if (!hasMenu) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    {link.label}
                  </Link>
                )
              }

              return (
                <div key={link.href} className="border-b border-border/60 last:border-none">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setExpanded(isOpen ? null : link.href)}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
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
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            {section.heading}
                          </p>
                          <ul className="space-y-2">
                            {section.links.map((item) => (
                              <li key={item.href}>
                                <Link
                                  href={item.href}
                                  onClick={() => setOpen(false)}
                                  className="text-sm text-foreground/80 transition-colors hover:text-primary"
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
              )
            })}
          </nav>

          <div className="mt-auto flex items-center gap-2 border-t border-border pt-4">
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <User className="size-4" />
              Account
            </Link>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
