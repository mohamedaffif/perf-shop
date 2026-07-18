import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

export function Hero() {
  return (
    <section className="flex flex-col items-center gap-6 bg-background px-4 py-16 text-center sm:px-6 lg:px-8">
      <p className="text-xs font-semibold tracking-wider text-primary uppercase">
        Extrait de Parfum
      </p>
      <Typography variant="display" className="max-w-3xl">
        A Scent as Rare as the Moment You Wear It
      </Typography>
      <p className="max-w-xl text-muted-foreground">
        Small-batch fragrances crafted with rare ingredients — for those who prefer to be
        remembered, not just noticed.
      </p>
      <Button variant="secondary" asChild>
        <Link href="#featured">Shop the Collection</Link>
      </Button>
    </section>
  );
}
