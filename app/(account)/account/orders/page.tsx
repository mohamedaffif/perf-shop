import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { ShopPagination } from "@/components/shop/ShopPagination";
import { formatPrice } from "@/lib/utils";
import { auth } from "@/auth";
import { listOrders } from "@/domain/order";
import type { Order } from "@/domain/order/order.types";

const STATUS_LABELS: Record<Order["status"], string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

type AccountOrdersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AccountOrdersPage({ searchParams }: AccountOrdersPageProps) {
  const session = await auth();
  const sp = await searchParams;
  const page = Array.isArray(sp.page) ? sp.page[0] : sp.page;

  const { items, total, page: currentPage, pageSize } = await listOrders({
    userId: session!.user.id,
    page,
  });

  if (items.length === 0) {
    return (
      <Typography variant="body" className="text-muted-foreground">
        You haven&apos;t placed any orders yet.
      </Typography>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {items.map((order) => (
        <Link
          key={order.id}
          href={`/account/orders/${order.orderNumber}`}
          className="border-border hover:border-primary/40 flex items-center justify-between rounded-lg border p-4 transition-colors"
        >
          <div>
            <p className="text-sm font-medium">{order.orderNumber}</p>
            <p className="text-muted-foreground text-xs">
              {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} item
              {order.items.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold">{formatPrice(order.total)}</span>
            <Badge>{STATUS_LABELS[order.status]}</Badge>
          </div>
        </Link>
      ))}

      <ShopPagination
        page={currentPage}
        pageSize={pageSize}
        total={total}
        searchParams={sp}
        basePath="/account/orders"
      />
    </div>
  );
}
