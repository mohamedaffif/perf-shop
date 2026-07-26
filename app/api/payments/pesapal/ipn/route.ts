import { NextRequest, NextResponse } from "next/server";
import { confirmPesapalPayment } from "@/domain/payment";

// Registered as a GET IPN via scripts/register-pesapal-ipn.ts — must match
// the ipn_notification_type used at registration time.
export async function GET(request: NextRequest) {
  const orderTrackingId = request.nextUrl.searchParams.get("OrderTrackingId");
  const orderMerchantReference = request.nextUrl.searchParams.get("OrderMerchantReference");

  if (!orderTrackingId || !orderMerchantReference) {
    return NextResponse.json({ status: 500 }, { status: 500 });
  }

  try {
    await confirmPesapalPayment(orderTrackingId);
  } catch (err) {
    console.error("[pesapal-ipn] failed to confirm payment", err);
    return NextResponse.json(
      {
        orderNotificationType: "IPNCHANGE",
        orderTrackingId,
        orderMerchantReference,
        status: 500,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    orderNotificationType: "IPNCHANGE",
    orderTrackingId,
    orderMerchantReference,
    status: 200,
  });
}
