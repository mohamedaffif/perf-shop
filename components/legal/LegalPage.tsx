import type { ReactNode } from "react";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Typography } from "@/components/ui/typography";

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}

export function LegalPage({ title, lastUpdated, children }: LegalPageProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbPage>{title}</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      <Typography variant="h1" className="mt-8">
        {title}
      </Typography>
      <p className="text-muted-foreground mt-2 text-sm">Last updated {lastUpdated}</p>

      <div className="[&_h2]:font-heading [&_h2]:text-foreground [&_p]:text-muted-foreground [&_ul]:text-muted-foreground mt-8 flex flex-col gap-6 text-sm leading-relaxed [&_a]:underline [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-semibold [&_li]:ml-4 [&_li]:list-disc [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1">
        {children}
      </div>
    </div>
  );
}
