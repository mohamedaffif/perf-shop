import { NextRequest, NextResponse } from "next/server";

import { confirmSubscription } from "@/domain/newsletter";
import { getEnv } from "@/lib/env";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const { ok } = token ? await confirmSubscription(token) : { ok: false };

  const destination = ok ? "/newsletter/confirmed" : "/newsletter/confirmed?state=invalid";
  return NextResponse.redirect(new URL(destination, getEnv().NEXT_PUBLIC_APP_URL));
}
