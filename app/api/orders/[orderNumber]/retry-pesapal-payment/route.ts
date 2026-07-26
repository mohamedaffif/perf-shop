import { NextRequest, NextResponse } from "next/server";
import { getOrderByOrderNumber } from "@/domain/order";
import { initiatePesapalPayment } from "@/domain/payment";
import { handleApiError } from "@/lib/api-error";
import { enforceRateLimit, getClientIp } from "@/lib/rate-limit";

type RouteParams = { params: Promise<{ orderNumber: string }> };

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    await enforceRateLimit({
      key: `pesapal-retry:${getClientIp(request)}`,
      limit: 10,
      windowSeconds: 60 * 10,
    });

    const { orderNumber } = await params;
    const order = await getOrderByOrderNumber(orderNumber);

    if (order.paymentMethod !== "PESAPAL" || order.paymentStatus === "PAID") {
      return NextResponse.json({ error: "This order cannot be retried." }, { status: 400 });
    }

    const { redirectUrl } = await initiatePesapalPayment(order);
    return NextResponse.json({ redirectUrl });
  } catch (error) {
    return handleApiError(error);
  }
}
