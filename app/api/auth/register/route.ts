import { NextRequest, NextResponse } from "next/server";
import { registerCustomer } from "@/domain/auth";
import { handleApiError } from "@/lib/api-error";
import { enforceRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    await enforceRateLimit({ key: `register:${getClientIp(request)}`, limit: 5, windowSeconds: 60 * 10 });
    const body = await request.json();
    const user = await registerCustomer(body);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
