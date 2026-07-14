"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { cn } from "@/lib/utils";
import type { NavLink } from "./Navbar";

export function MegaMenu({ link }: { link: NavLink }) {
  const [open, setOpen] = React.useState(false);
  const closeTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setOpen(true);
  };

  const hide = () => {
    closeTimeout.current = setTimeout(() => setOpen(false), 120);
  };

  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (!link.megaMenu) {
    return (
      <Link
        href={link.href}
        className="text-foreground/80 hover:text-foreground text-sm font-medium tracking-[0.2em] uppercase transition-colors"
      >
        {link.label}
      </Link>
    );
  }

  const { sections, featured } = link.megaMenu;

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="text-foreground/80 hover:text-foreground flex items-center gap-1 text-sm font-medium tracking-[0.2em] uppercase transition-colors"
      >
        {link.label}
        <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          className="absolute top-full left-1/2 z-50 w-screen max-w-xl -translate-x-1/2 pt-3"
          onMouseEnter={show}
          onMouseLeave={hide}
        >
          <div className="border-border bg-card shadow-(--shadow-card) grid grid-cols-[2fr_1fr] gap-6 rounded-xl border p-6">
            <div className="grid grid-cols-2 gap-6">
              {sections.map((section) => (
                <div key={section.heading}>
                  <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-[0.15em] uppercase">
                    {section.heading}
                  </p>
                  <ul className="space-y-2">
                    {section.links.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="text-card-foreground/80 hover:text-primary text-sm transition-colors"
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
                className="border-border bg-muted hover:border-primary/40 flex flex-col justify-end rounded-lg border p-4 transition-colors"
              >
                <p className="text-primary text-xs font-semibold tracking-[0.15em] uppercase">
                  {featured.title}
                </p>
                <p className="text-muted-foreground mt-1 text-sm">{featured.description}</p>
                <span className="text-foreground mt-3 text-sm font-medium">{featured.cta} →</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
