import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const typographyVariants = cva("text-foreground", {
  variants: {
    variant: {
      display:
        "font-heading font-medium tracking-normal text-display md:text-display-tablet lg:text-display-desktop",
      h1: "font-heading font-semibold tracking-normal text-h1 md:text-h1-tablet lg:text-h1-desktop",
      h2: "font-heading font-semibold tracking-normal text-h2 md:text-h2-tablet lg:text-h2-desktop",
      h3: "font-sans font-bold tracking-normal text-h3 md:text-h3-tablet lg:text-h3-desktop",
      h4: "font-sans font-bold tracking-normal text-h4 md:text-h4-tablet lg:text-h4-desktop",
      h5: "font-sans font-semibold tracking-normal text-h5 md:text-h5-tablet lg:text-h5-desktop",
      h6: "font-sans font-semibold tracking-normal text-h6 md:text-h6-tablet lg:text-h6-desktop",
      "body-large":
        "font-sans font-normal tracking-normal text-body-large md:text-body-large-tablet lg:text-body-large-desktop",
      body: "font-sans font-normal tracking-normal text-body md:text-body-tablet lg:text-body-desktop",
      "body-small":
        "font-sans font-normal tracking-normal text-body-small md:text-body-small-tablet lg:text-body-small-desktop",
      caption: "font-sans font-medium tracking-wide text-caption",
      overline:
        "font-sans font-semibold uppercase tracking-widest text-overline md:text-overline-tablet lg:text-overline-desktop",
      label: "font-sans font-semibold tracking-normal text-label",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },
  defaultVariants: {
    variant: "body",
  },
});

type TypographyVariant = NonNullable<VariantProps<typeof typographyVariants>["variant"]>;

const defaultElement: Record<TypographyVariant, React.ElementType> = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  "body-large": "p",
  body: "p",
  "body-small": "p",
  caption: "span",
  overline: "span",
  label: "label",
};

function Typography({
  className,
  variant = "body",
  align,
  weight,
  asChild = false,
  as,
  ...props
}: React.ComponentProps<"p"> &
  VariantProps<typeof typographyVariants> & {
    asChild?: boolean;
    as?: React.ElementType;
  }) {
  const Comp = asChild ? Slot.Root : (as ?? defaultElement[variant ?? "body"]);

  return (
    <Comp
      data-slot="typography"
      data-variant={variant}
      className={cn(typographyVariants({ variant, align, weight, className }))}
      {...props}
    />
  );
}

export { Typography, typographyVariants };
