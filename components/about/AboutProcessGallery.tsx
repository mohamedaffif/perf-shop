import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Typography } from "@/components/ui/typography";

const PROCESS_ITEMS = [
  {
    title: "Sourcing",
    description:
      "We partner directly with fragrance houses and authorized distributors, so every bottle we stock has a traceable, trusted origin.",
  },
  {
    title: "Quality Checks",
    description:
      "Each incoming batch is inspected for seal integrity, batch codes, and packaging condition before it's added to our shelves.",
  },
  {
    title: "Curated Selection",
    description:
      "Our range is chosen by scent, not just brand recognition — we test and shortlist fragrances before they ever reach the shop.",
  },
  {
    title: "Careful Packaging",
    description:
      "Orders are wrapped and boxed to arrive exactly as they left the maker, protected from knocks, light, and temperature changes in transit.",
  },
  {
    title: "Authenticity Guarantee",
    description: "Every fragrance we sell is 100% authentic — no dupes, no decants, no exceptions.",
  },
  {
    title: "Customer Care",
    description:
      "From finding your first signature scent to reordering a favourite, our team is on hand for guidance before and after you buy.",
  },
];

export function AboutProcessGallery() {
  return (
    <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Typography variant="h2" className="mb-10">
          Behind Every Bottle
        </Typography>

        <div className="grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2">
          {PROCESS_ITEMS.map(({ title, description }) => (
            <div key={title} className="flex flex-row items-center gap-4 sm:gap-6">
              <div className="border-border w-24 shrink-0 overflow-hidden rounded-xl border sm:w-32">
                <AspectRatio ratio={1}>
                  <div className="bg-muted h-full w-full" />
                </AspectRatio>
              </div>
              <div className="flex-1">
                <Typography variant="h5">{title}</Typography>
                <Typography variant="body-small" className="text-muted-foreground mt-1">
                  {description}
                </Typography>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
