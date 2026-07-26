import { notFound } from "next/navigation";

import { Typography } from "@/components/ui/typography";
import { OrderSummaryCard } from "@/components/order/OrderSummaryCard";
import { OrderStatusForm } from "@/components/admin/OrderStatusForm";
import { getOrder, OrderNotFoundError } from "@/domain/order";

type AdminOrderDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const { id } = await params;

  const order = await getOrder(id).catch((err) => {
    if (err instanceof OrderNotFoundError) return null;
    throw err;
  });

  if (!order) notFound();

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div>
        <Typography variant="h1">Order {order.orderNumber}</Typography>
        <p className="text-muted-foreground text-sm">
          Placed {new Date(order.createdAt).toLocaleDateString()} · {order.email}
        </p>
      </div>

      <OrderStatusForm orderId={order.id} currentStatus={order.status} />

      <OrderSummaryCard order={order} showStatus />

      <div className="border-border rounded-lg border p-4 text-sm">
        <p className="text-foreground font-semibold">Payment</p>
        <div className="text-muted-foreground mt-1 flex flex-col gap-1">
          <p>
            Method: <span className="text-foreground">{order.paymentMethod ?? "—"}</span> · Status:{" "}
            <span className="text-foreground">{order.paymentStatus}</span>
          </p>
          {order.paymentReference ? <p>Reference: {order.paymentReference}</p> : null}
          {order.paidAt ? <p>Paid at: {new Date(order.paidAt).toLocaleString()}</p> : null}
          {order.failureReason ? (
            <p className="text-danger-foreground">Failure reason: {order.failureReason}</p>
          ) : null}
          {order.gatewayResponse != null ? (
            <details className="mt-1">
              <summary className="text-foreground cursor-pointer text-xs font-medium">
                Gateway response
              </summary>
              <pre className="bg-muted mt-2 max-h-64 overflow-auto rounded p-2 text-xs">
                {JSON.stringify(order.gatewayResponse, null, 2)}
              </pre>
            </details>
          ) : null}
        </div>
      </div>

      <div className="border-border rounded-lg border p-4 text-sm">
        <p className="text-foreground font-semibold">Shipping to</p>
        <p className="text-muted-foreground mt-1">
          {order.shippingFullName}
          <br />
          {order.shippingLine1}
          {order.shippingLine2 ? <>, {order.shippingLine2}</> : null}
          <br />
          {order.shippingCity}, {order.shippingState} {order.shippingPostalCode}
          <br />
          {order.shippingCountry}
          <br />
          {order.shippingPhone}
        </p>
      </div>
    </div>
  );
}
