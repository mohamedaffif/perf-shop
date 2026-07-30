import { Reveal } from "@/components/motion/Reveal";
import { Typography } from "@/components/ui/typography";

export function AboutHero() {
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-black">
      {/* Placeholder for hero photography — swap for a real image (e.g. next/image with fill, sourced from Cloudinary) */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-800/60 to-black" />

      <Reveal className="relative z-10 flex flex-col items-center gap-4 px-4 text-center">
        <Typography variant="display" className="text-neutral-50">
          The Art of Fragrance
        </Typography>
        <p className="text-sm font-semibold tracking-[0.3em] text-neutral-300 uppercase">
          De Perfume Shop
        </p>
      </Reveal>
    </section>
  );
}
