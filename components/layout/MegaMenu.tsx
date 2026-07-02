"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import type { NavLink } from "./Navbar"

export function MegaMenu({ link }: { link: NavLink }) {
  const [open, setOpen] = React.useState(false)
  const closeTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current)
    setOpen(true)
  }

  const hide = () => {
    closeTimeout.current = setTimeout(() => setOpen(false), 120)
  }

  React.useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open])

  if (!link.megaMenu) {
    return (
      <Link
        href={link.href}
        className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
      >
        {link.label}
      </Link>
    )
  }

  const { sections, featured } = link.megaMenu

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
      >
        {link.label}
        <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          className="absolute left-1/2 top-full z-50 w-screen max-w-xl -translate-x-1/2 pt-3"
          onMouseEnter={show}
          onMouseLeave={hide}
        >
          <div className="grid grid-cols-[2fr_1fr] gap-6 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <div className="grid grid-cols-2 gap-6">
              {sections.map((section) => (
                <div key={section.heading}>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {section.heading}
                  </p>
                  <ul className="space-y-2">
                    {section.links.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="text-sm text-card-foreground/80 transition-colors hover:text-primary"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {featured && (
              <Link
                href={featured.href}
                onClick={() => setOpen(false)}
                className="flex flex-col justify-end rounded-2xl border border-border bg-muted p-4 transition-colors hover:border-primary/40"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  {featured.title}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{featured.description}</p>
                <span className="mt-3 text-sm font-medium text-foreground">
                  {featured.cta} →
                </span>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
