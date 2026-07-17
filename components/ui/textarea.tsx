import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "rounded-input border-input bg-input-background px-input-padding-x py-input-padding-y text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-danger-foreground aria-invalid:ring-danger-foreground/20 w-full min-w-0 resize-none border text-sm transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
