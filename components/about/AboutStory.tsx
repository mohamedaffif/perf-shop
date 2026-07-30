import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import { Typography } from "@/components/ui/typography";

export function AboutStory() {
  return (
    <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <p className="text-muted-foreground text-xs font-medium tracking-wide">
            deperfumeshop.com
          </p>
          <Typography variant="h1" className="mt-2">
            About Us
          </Typography>
          <Separator className="my-6 max-w-24" />
          <div className="space-y-4">
            <Typography variant="body" className="text-muted-foreground">
              DE PERFUME SHOP is a curated fragrance destination for those who believe a scent
              should be as memorable as the moment it&apos;s worn. We bring together signature and
              niche perfumes from houses we trust, chosen for quality, not just a name on the box.
            </Typography>
            <Typography variant="body" className="text-muted-foreground">
              Every fragrance in our collection is selected for its craftsmanship — long-lasting
              compositions, honest ingredients, and a story worth wearing. We work directly with
              brands and authorized distributors to make sure what reaches you is exactly what left
              the maker&apos;s hands.
            </Typography>
            <Typography variant="body" className="text-muted-foreground">
              Today, we serve customers who want more than a bottle on a shelf: real guidance,
              honest recommendations, and a shop that treats fragrance as personal. Whatever the
              occasion, we&apos;re here to help you find the scent that&apos;s unmistakably yours.
            </Typography>
          </div>
        </div>

        <div className="mx-auto w-full max-w-sm">
          <AspectRatio
            ratio={3 / 4}
            className="border-border overflow-hidden rounded-t-full border"
          >
            <div className="bg-muted h-full w-full" />
          </AspectRatio>
        </div>
      </div>
    </section>
  );
}
