import { Typography } from "@/components/ui/typography";
import { Reveal } from "@/components/motion/Reveal";
import { NewsletterForm } from "@/components/layout/NewsletterForm";

const PILLARS = [
  {
    title: "Small batch",
    body: "Each fragrance is blended in limited runs, never mass-produced. Rarity is the point.",
  },
  {
    title: "Rare ingredients",
    body: "Sourced from growers we know by name — real oud, first-press citrus, aged resins.",
  },
  {
    title: "Made to linger",
    body: "Extrait-strength concentrations built to stay with you from morning to midnight.",
  },
];

export function TeaserHome() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <Reveal className="flex flex-col items-center gap-6">
          <Typography variant="overline" className="text-primary">
            Opening soon
          </Typography>
          <Typography variant="h2">A house of signature scents, arriving shortly.</Typography>
          <p className="text-muted-foreground max-w-xl">
            We&apos;re putting the finishing touches on the collection. Join the list to be the
            first to know when the doors open — and to receive an early-access offer reserved for
            our founding customers.
          </p>
        </Reveal>
      </section>

      <section className="bg-card border-border border-y px-4 py-16 sm:px-6 lg:px-8">
        <Reveal stagger className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          {PILLARS.map((pillar) => (
            <div key={pillar.title} className="flex flex-col gap-2 text-center md:text-left">
              <Typography variant="h5">{pillar.title}</Typography>
              <p className="text-muted-foreground text-sm">{pillar.body}</p>
            </div>
          ))}
        </Reveal>
      </section>

      <section
        id="newsletter"
        className="mx-auto max-w-xl scroll-mt-24 px-4 py-16 text-center sm:px-6 lg:px-8"
      >
        <Reveal className="flex flex-col items-center gap-4">
          <Typography variant="h3">Be first in line</Typography>
          <p className="text-muted-foreground text-sm">
            Early access to the launch, plus an offer for founding customers.
          </p>
          <div className="w-full max-w-sm text-left">
            <NewsletterForm />
          </div>
        </Reveal>
      </section>
    </>
  );
}
