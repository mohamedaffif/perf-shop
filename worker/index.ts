import "dotenv/config";
import { render } from "react-email";
import { consumeQueue, publishEvent, QUEUES } from "@/lib/rabbitmq";
import { resend } from "@/lib/resend";
import { getEnv } from "@/lib/env";
import { updateOrderStatus } from "@/domain/order";
import type { OrderConfirmedEvent, StockLowEvent } from "@/domain/order/order.events";
import OrderConfirmationEmail from "@/emails/order-confirmation";
import AdminNewOrderEmail from "@/emails/admin-new-order";

async function handleOrderConfirmed(payload: unknown): Promise<void> {
  const event = payload as OrderConfirmedEvent;
  console.log(`[worker] order confirmed: ${event.orderNumber}`);

  await updateOrderStatus(event.orderId, { status: "CONFIRMED" });

  await Promise.all([
    publishEvent("email.customer", event),
    publishEvent("notification.admin", event),
    publishEvent("invoice.generate", event),
  ]);
}

async function handleEmailCustomer(payload: unknown): Promise<void> {
  const event = payload as OrderConfirmedEvent;
  const html = await render(
    OrderConfirmationEmail({
      orderNumber: event.orderNumber,
      items: event.items,
      total: event.total,
    })
  );

  const { error } = await resend.emails.send({
    from: getEnv().RESEND_FROM_EMAIL,
    to: event.email,
    subject: `Order ${event.orderNumber} confirmed`,
    html,
  });
  if (error) throw new Error(`Resend send failed: ${error.message}`);

  console.log(`[worker] sent confirmation email to ${event.email} for order ${event.orderNumber}`);
}

async function handleNotificationAdmin(payload: unknown): Promise<void> {
  const event = payload as OrderConfirmedEvent;
  const html = await render(
    AdminNewOrderEmail({
      orderNumber: event.orderNumber,
      email: event.email,
      total: event.total,
      items: event.items,
    })
  );

  const { error } = await resend.emails.send({
    from: getEnv().RESEND_FROM_EMAIL,
    to: getEnv().ADMIN_NOTIFICATION_EMAIL,
    subject: `New order ${event.orderNumber}`,
    html,
  });
  if (error) throw new Error(`Resend send failed: ${error.message}`);

  console.log(`[worker] sent admin notification for order ${event.orderNumber}`);
}

async function handleInvoiceGenerate(payload: unknown): Promise<void> {
  const event = payload as OrderConfirmedEvent;
  console.log(`[worker] would generate invoice for order ${event.orderNumber}`);
}

async function handleStockLow(payload: unknown): Promise<void> {
  const event = payload as StockLowEvent;
  console.log(`[worker] low stock: ${event.productName} (${event.stockQuantity} left)`);
}

async function handlePaymentEvents(payload: unknown): Promise<void> {
  // Stub: no Pesapal webhook/IPN integration exists yet — this is where it plugs in once built.
  console.log("[worker] payment event received", payload);
}

async function main(): Promise<void> {
  await consumeQueue("order.confirmed", handleOrderConfirmed);
  await consumeQueue("email.customer", handleEmailCustomer);
  await consumeQueue("notification.admin", handleNotificationAdmin);
  await consumeQueue("invoice.generate", handleInvoiceGenerate);
  await consumeQueue("stock.low", handleStockLow);
  await consumeQueue("payment.events", handlePaymentEvents);

  console.log(`[worker] listening on queues: ${QUEUES.join(", ")}`);
}

main().catch((err) => {
  console.error("[worker] fatal error", err);
  process.exit(1);
});
