import { Switch as SwitchPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "@/lib/utils";

function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer focus-visible:ring-ring/50 data-[state=checked]:bg-background data-[state=unchecked]:bg-input inline-flex h-5.5 w-10 shrink-0 items-center rounded-full transition-colors outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="bg-foreground data-[state=checked]:bg-primary pointer-events-none block size-5.5 translate-x-0.5 rounded-full transition-transform data-[state=checked]:translate-x-4.5"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
