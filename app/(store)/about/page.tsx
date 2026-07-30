import Link from "next/link";

import { AboutConcentrationTable } from "@/components/about/AboutConcentrationTable";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutProcessGallery } from "@/components/about/AboutProcessGallery";
import { AboutStory } from "@/components/about/AboutStory";
import { AboutUsageGrid } from "@/components/about/AboutUsageGrid";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

export default function AboutPage() {
  return (
    <>
      <AboutHero />

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbPage>About</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <AboutStory />
      <AboutUsageGrid />
      <AboutProcessGallery />
      <AboutConcentrationTable />
    </>
  );
}
