import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <Typography variant="display">404</Typography>
      <Typography variant="h4" className="text-muted-foreground">
        We couldn&apos;t find that page.
      </Typography>
      <Button asChild className="mt-4">
        <Link href="/">Back to shop</Link>
      </Button>
    </div>
  );
}
