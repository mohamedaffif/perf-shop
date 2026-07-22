import { notFound } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { OrderSummaryCard } from "@/components/order/OrderSummaryCard";
import { getOrderByOrderNumber, OrderNotFoundError } from "@/domain/order";
import { buildOrderWhatsAppUrl } from "@/lib/whatsapp";

type OrderConfirmationPageProps = {
  params: Promise<{ orderNumber: string }>;
};

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const { orderNumber } = await params;

  const order = await getOrderByOrderNumber(orderNumber).catch((err) => {
    if (err instanceof OrderNotFoundError) return null;
    throw err;
  });

  if (!order) notFound();

  const whatsappUrl = buildOrderWhatsAppUrl(order);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <Typography variant="h1">Thank you!</Typography>
      <p className="text-muted-foreground mt-2">
        Order <span className="text-foreground font-semibold">{order.orderNumber}</span> has been
        received and is <span className="font-semibold">pending payment confirmation</span>.
      </p>

      <div className="mt-8">
        <OrderSummaryCard order={order} />
      </div>

      {whatsappUrl ? (
        <Button asChild className="mt-8 w-full" size="lg">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            Confirm payment on WhatsApp
          </a>
        </Button>
      ) : null}

      <Button asChild variant="outline" className="mt-3 w-full">
        <Link href="/shop">Continue shopping</Link>
      </Button>
    </div>
  );
}
