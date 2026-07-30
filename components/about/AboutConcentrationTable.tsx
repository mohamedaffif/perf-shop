import { ArrowRight, Droplet, Droplets, FlaskConical } from "lucide-react";

import { Typography } from "@/components/ui/typography";

const CONCENTRATIONS = [
  {
    icon: Droplet,
    name: "Eau de Toilette",
    percentage: "5–15% oil",
    longevity: "3–5 hours",
  },
  {
    icon: Droplets,
    name: "Eau de Parfum",
    percentage: "15–20% oil",
    longevity: "5–8 hours",
  },
  {
    icon: FlaskConical,
    name: "Extrait de Parfum",
    percentage: "20–30% oil",
    longevity: "8+ hours",
  },
];

export function AboutConcentrationTable() {
  return (
    <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Typography variant="h2" className="mb-10">
          Understanding Concentration
        </Typography>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-4">
          {CONCENTRATIONS.map(({ icon: Icon, name, percentage, longevity }, index) => (
            <div key={name} className="relative">
              <div className="border-border flex flex-col items-center gap-3 rounded-2xl border p-6 text-center sm:border-0 sm:p-0">
                <span className="border-border text-primary inline-flex size-14 items-center justify-center rounded-full border">
                  <Icon className="size-6" />
                </span>
                <Typography variant="h6">{name}</Typography>
                <Typography variant="body-small" className="text-muted-foreground">
                  {percentage}
                </Typography>
                <Typography variant="caption" className="text-muted-foreground">
                  {longevity} wear
                </Typography>
              </div>
              {index < CONCENTRATIONS.length - 1 && (
                <ArrowRight className="text-muted-foreground absolute top-7 -right-3 hidden size-5 sm:block" />
              )}
            </div>
          ))}
        </div>

        <Typography variant="body-small" className="text-muted-foreground mt-10 max-w-2xl">
          Choosing a concentration: a lighter Eau de Toilette suits warm climates and daytime wear,
          while Eau de Parfum and Extrait de Parfum carry further and last longer — ideal for
          evenings, cooler weather, or when you want your signature scent to linger.
        </Typography>
      </div>
    </section>
  );
}
