import { NextRequest, NextResponse } from "next/server";

import { subscribe } from "@/domain/newsletter";
import { handleApiError } from "@/lib/api-error";
import { enforceRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    await enforceRateLimit({
      key: `newsletter:${getClientIp(request)}`,
      limit: 5,
      windowSeconds: 60 * 10,
    });

    const body = await request.json();
    const result = await subscribe(body);

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
