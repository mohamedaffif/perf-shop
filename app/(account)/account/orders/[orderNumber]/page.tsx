import { notFound } from "next/navigation";

import { Typography } from "@/components/ui/typography";
import { OrderSummaryCard } from "@/components/order/OrderSummaryCard";
import { auth } from "@/auth";
import { getOrderByOrderNumber, OrderNotFoundError } from "@/domain/order";

type AccountOrderDetailPageProps = {
  params: Promise<{ orderNumber: string }>;
};

export default async function AccountOrderDetailPage({ params }: AccountOrderDetailPageProps) {
  const session = await auth();
  const { orderNumber } = await params;

  const order = await getOrderByOrderNumber(orderNumber).catch((err) => {
    if (err instanceof OrderNotFoundError) return null;
    throw err;
  });

  if (!order || order.userId !== session!.user.id) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Typography variant="h4">Order {order.orderNumber}</Typography>
        <p className="text-muted-foreground text-sm">
          Placed {new Date(order.createdAt).toLocaleDateString()}
        </p>
      </div>

      <OrderSummaryCard order={order} showStatus />

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
        </p>
      </div>
    </div>
  );
}
