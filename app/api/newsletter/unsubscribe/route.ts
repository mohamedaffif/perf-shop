import { NextRequest, NextResponse } from "next/server";

import { unsubscribe } from "@/domain/newsletter";
import { getEnv } from "@/lib/env";

// Public, no auth: mail clients call it without cookies. Two callers:
// - RFC 8058 one-click (Gmail/Yahoo): token in the query, body `List-Unsubscribe=One-Click`.
//   Unsubscribes immediately and answers with a plain status, never a redirect.
// - The /newsletter/unsubscribe page's form: token in the body, redirected back to the page.
export async function POST(request: NextRequest) {
  const form = await request.formData().catch(() => null);
  const isOneClick = form?.get("List-Unsubscribe") === "One-Click";

  const bodyToken = form?.get("token");
  const token =
    request.nextUrl.searchParams.get("token") ?? (typeof bodyToken === "string" ? bodyToken : "");

  const { ok } = await unsubscribe(token);

  if (isOneClick) {
    return new NextResponse(null, { status: ok ? 200 : 400 });
  }

  const destination = ok
    ? "/newsletter/unsubscribe?state=done"
    : "/newsletter/unsubscribe?state=invalid";
  return NextResponse.redirect(new URL(destination, getEnv().NEXT_PUBLIC_APP_URL), 303);
}
