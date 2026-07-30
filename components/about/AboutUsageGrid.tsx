import { Box, Car, Clock, Gift, Home, Layers, Shirt, Sparkles } from "lucide-react";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Typography } from "@/components/ui/typography";

const USAGE_LABELS = [
  "Layering",
  "Home Fragrance",
  "On-the-Go",
  "Gifting",
  "Skin vs. Fabric",
  "Longevity",
  "Storage",
  "Occasions",
];

const USAGE_ITEMS = [
  {
    icon: Layers,
    title: "Layering",
    description:
      "Pair a lighter eau de toilette with a richer extrait underneath to build a scent that evolves through the day.",
  },
  {
    icon: Home,
    title: "Home Fragrance",
    description:
      "Bring your signature scent into your space with matching candles and reed diffusers from the same fragrance family.",
  },
  {
    icon: Car,
    title: "On-the-Go",
    description:
      "Travel-size atomizers make it easy to reapply your fragrance between meetings, flights, or evening plans.",
  },
  {
    icon: Gift,
    title: "Gifting",
    description:
      "Gift sets and discovery sizes let you introduce someone to a new scent without committing to a full bottle.",
  },
  {
    icon: Shirt,
    title: "Skin vs. Fabric",
    description:
      "Fragrance reads differently on skin than on clothing — test on skin first, since body chemistry changes how a scent develops.",
  },
  {
    icon: Clock,
    title: "Longevity Tips",
    description:
      "Apply to pulse points — wrists, neck, behind the ears — where body heat helps a fragrance project throughout the day.",
  },
  {
    icon: Box,
    title: "Storage",
    description:
      "Keep bottles away from direct sunlight and heat; a cool, dark drawer preserves a fragrance's composition far longer than a bathroom shelf.",
  },
  {
    icon: Sparkles,
    title: "Occasion Pairing",
    description:
      "Lighter, fresher scents suit daytime and warm weather, while deeper, spicier compositions come into their own at night.",
  },
];

export function AboutUsageGrid() {
  return (
    <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:items-center">
        <div className="border-border flex-1 rounded-3xl border p-8 md:p-12">
          <div className="flex items-start justify-between gap-4">
            <Typography variant="overline" className="text-primary">
              How to Get the Most From Your Fragrance.
            </Typography>
            <div className="flex flex-wrap justify-end gap-x-4 gap-y-1">
              {USAGE_LABELS.map((label) => (
                <span key={label} className="text-muted-foreground text-xs font-medium">
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
            {USAGE_ITEMS.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex gap-4">
                <span className="border-border text-primary inline-flex size-10 shrink-0 items-center justify-center rounded-full border">
                  <Icon className="size-4" />
                </span>
                <div>
                  <Typography variant="h6">{title}</Typography>
                  <Typography variant="body-small" className="text-muted-foreground mt-1">
                    {description}
                  </Typography>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center justify-between">
            <span className="border-border text-muted-foreground inline-flex size-9 items-center justify-center rounded-full border text-xs">
              DP
            </span>
            <span className="font-heading text-sm font-semibold">De Perfume Shop</span>
          </div>
        </div>

        <div className="mx-auto w-full max-w-xs lg:w-64 lg:shrink-0">
          <AspectRatio ratio={1} className="border-border overflow-hidden rounded-full border">
            <div className="bg-muted h-full w-full" />
          </AspectRatio>
        </div>
      </div>
    </section>
  );
}
