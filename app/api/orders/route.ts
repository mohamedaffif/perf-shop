import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { placeOrder } from "@/domain/order";
import { handleApiError } from "@/lib/api-error";
import { enforceRateLimit, getClientIp } from "@/lib/rate-limit";
import { withIdempotency } from "@/lib/idempotency";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const identifier = session?.user?.id ? `user:${session.user.id}` : `ip:${getClientIp(request)}`;
    await enforceRateLimit({ key: `orders:${identifier}`, limit: 20, windowSeconds: 60 * 10 });

    const body = await request.json();
    const idempotencyKey = request.headers.get("idempotency-key");

    const order = await withIdempotency(idempotencyKey, () =>
      placeOrder(body, session?.user?.id ?? null)
    );
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
