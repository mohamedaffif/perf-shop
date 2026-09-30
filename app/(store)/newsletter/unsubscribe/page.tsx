import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false },
};

type NewsletterUnsubscribePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

// Rendering this page never unsubscribes: mail scanners pre-open links, so the
// opt-out only happens when the visitor submits the form (a POST).
export default async function NewsletterUnsubscribePage({
  searchParams,
}: NewsletterUnsubscribePageProps) {
  const { state, token } = await searchParams;

  let content: React.ReactNode;
  if (state === "done") {
    content = (
      <>
        <Typography variant="h1" className="text-balance">
          You&apos;ve been unsubscribed
        </Typography>
        <p className="text-muted-foreground mt-2 text-pretty">
          You won&apos;t receive any more newsletter emails from us. You can re-join from the form
          in the footer anytime. We&apos;ll ask you to confirm your email again.
        </p>
      </>
    );
  } else if (state === "invalid" || typeof token !== "string" || !token) {
    content = (
      <>
        <Typography variant="h1" className="text-balance">
          This link isn&apos;t valid
        </Typography>
        <p className="text-muted-foreground mt-2 text-pretty">
          Use the unsubscribe link from one of our newsletter emails, or contact us and we&apos;ll
          remove you from the list.
        </p>
      </>
    );
  } else {
    content = (
      <>
        <Typography variant="h1" className="text-balance">
          Unsubscribe from our newsletter?
        </Typography>
        <p className="text-muted-foreground mt-2 text-pretty">
          You&apos;ll stop receiving DE PERFUME SHOP newsletter emails. Order and account emails
          aren&apos;t affected.
        </p>
        <form method="post" action="/api/newsletter/unsubscribe" className="mt-8">
          <input type="hidden" name="token" value={token} />
          <Button type="submit">Unsubscribe</Button>
        </form>
      </>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      {content}

      <Button asChild variant={state === "done" ? "default" : "outline"} className="mt-8">
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
