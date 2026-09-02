import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

export const metadata: Metadata = {
  title: "Newsletter confirmation",
  robots: { index: false, follow: false },
};

type NewsletterConfirmedPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function NewsletterConfirmedPage({
  searchParams,
}: NewsletterConfirmedPageProps) {
  const { state } = await searchParams;
  const isInvalid = state === "invalid";

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      {isInvalid ? (
        <>
          <Typography variant="h1" className="text-balance">
            This link has expired
          </Typography>
          <p className="text-muted-foreground mt-2 text-pretty">
            Confirmation links are valid for 24 hours and can only be used once. Subscribe again
            from the form in the footer and we&apos;ll send a fresh link.
          </p>
        </>
      ) : (
        <>
          <Typography variant="h1" className="text-balance">
            You&apos;re on the list
          </Typography>
          <p className="text-muted-foreground mt-2 text-pretty">
            Your subscription is confirmed. As a founding subscriber you&apos;ll receive an
            early-access offer with the launch announcement.
          </p>
        </>
      )}

      <Button asChild className="mt-8">
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
