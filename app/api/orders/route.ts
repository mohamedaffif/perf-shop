import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { placeOrder } from "@/domain/order";
import { initiatePesapalPayment } from "@/domain/payment";
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

    if (order.paymentMethod !== "PESAPAL") {
      return NextResponse.json({ order }, { status: 201 });
    }

    // The order already exists (PENDING) at this point regardless of what
    // happens next, so a Pesapal failure here shouldn't look like the order
    // itself failed — the client can offer to retry payment on the same order.
    try {
      const { redirectUrl } = await initiatePesapalPayment(order);
      return NextResponse.json({ order, paymentRedirectUrl: redirectUrl }, { status: 201 });
    } catch (err) {
      console.error("[orders] Pesapal payment initiation failed", err);
      return NextResponse.json(
        {
          order,
          paymentError:
            "We couldn't start your Pesapal payment. You can retry from your order page.",
        },
        { status: 201 }
      );
    }
  } catch (error) {
    return handleApiError(error);
  }
}
