import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full min-w-0 rounded-input border border-input bg-input-background px-input-padding-x py-input-padding-y text-sm text-primary-foreground outline-none transition-[color,box-shadow] placeholder:text-primary-foreground/50 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-danger-foreground aria-invalid:ring-danger-foreground/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
