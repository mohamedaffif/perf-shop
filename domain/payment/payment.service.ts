import { randomBytes } from "crypto";
import { getEnv } from "@/lib/env";
import { Prisma } from "@/lib/generated/prisma/client";
import * as pesapal from "@/lib/pesapal";
import * as orderRepository from "@/domain/order/order.repository";
import { publishOrderConfirmed } from "@/domain/order/order.events";
import { getStoreSettings } from "@/domain/settings";
import type { Order } from "@/domain/order/order.types";

// The shop currently only ships within Kenya (single currency, single
// WhatsApp country code) — Pesapal requires an ISO 3166-1 country code and
// the checkout form only collects a free-text country name, so default to KE
// rather than guessing a mapping for a market this store doesn't serve yet.
function toCountryCode(shippingCountry: string): string {
  return shippingCountry.trim().toUpperCase() === "KENYA" || shippingCountry.trim().length !== 2
    ? "KE"
    : shippingCountry.trim().toUpperCase();
}

function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts[0] ?? fullName;
  const lastName = parts.slice(1).join(" ") || firstName;
  return { firstName, lastName };
}

export async function initiatePesapalPayment(order: Order): Promise<{ redirectUrl: string }> {
  const settings = await getStoreSettings();
  const { firstName, lastName } = splitName(order.shippingFullName);

  // Pesapal requires the merchant reference to be unique for every order
  // request, including retries of the same order — a bare orderNumber would
  // collide with whatever was already submitted on a prior attempt.
  const merchantReference = `${order.orderNumber}-${randomBytes(3).toString("hex")}`;

  const { orderTrackingId, redirectUrl, raw } = await pesapal.submitOrder({
    merchantReference,
    amount: order.total,
    currency: settings.currency,
    description: `DE PERFUME SHOP order ${order.orderNumber}`,
    callbackUrl: `${getEnv().NEXT_PUBLIC_APP_URL}/order/${order.orderNumber}`,
    billingAddress: {
      email: order.email,
      phone: order.shippingPhone,
      firstName,
      lastName,
      line1: order.shippingLine1,
      line2: order.shippingLine2 ?? undefined,
      city: order.shippingCity,
      state: order.shippingState,
      postalCode: order.shippingPostalCode,
      countryCode: toCountryCode(order.shippingCountry),
    },
  });

  await orderRepository.updatePaymentTracking(order.orderNumber, {
    paymentReference: orderTrackingId,
    gatewayResponse: raw as Prisma.InputJsonValue,
  });

  return { redirectUrl };
}

/**
 * Idempotent payment confirmation, driven by either the IPN callback or the
 * customer's browser redirect back from Pesapal — both carry the same
 * orderTrackingId, and either can arrive first. Looked up by tracking id
 * (not merchant reference — that's regenerated fresh on every retry, so it
 * can't be used to find the order). Treats Pesapal's GetTransactionStatus
 * (a server-to-server call authenticated with our own token) as the sole
 * source of truth rather than trusting the unauthenticated callback/IPN
 * params directly.
 */
export async function confirmPesapalPayment(orderTrackingId: string): Promise<void> {
  const order = await orderRepository.findByPaymentReference(orderTrackingId);
  if (!order) {
    console.warn(`[pesapal] confirmation received for unknown tracking id ${orderTrackingId}`);
    return;
  }
  if (order.paymentStatus !== "PENDING") return;

  const { status, message, raw } = await pesapal.getTransactionStatus(orderTrackingId);

  const updatedOrder = await orderRepository.updatePaymentStatusIfPending(order.orderNumber, {
    paymentStatus: status,
    paidAt: status === "PAID" ? new Date() : null,
    failureReason: status === "PAID" ? null : message,
    gatewayResponse: raw as Prisma.InputJsonValue,
  });

  if (updatedOrder && status === "PAID") {
    await publishOrderConfirmed(updatedOrder);
  }
}
