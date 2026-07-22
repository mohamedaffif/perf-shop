"use client";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

export default function StoreError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
      <Typography variant="h2">Something went wrong</Typography>
      <Typography variant="body" className="text-muted-foreground">
        An unexpected error occurred while loading this page.
      </Typography>
      <Button onClick={reset} className="mt-2">
        Try again
      </Button>
    </div>
  );
}
