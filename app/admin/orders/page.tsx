import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { ShopPagination } from "@/components/shop/ShopPagination";
import { formatPrice } from "@/lib/utils";
import { listOrders } from "@/domain/order";
import type { Order, OrderStatus } from "@/domain/order/order.types";

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

const STATUS_FILTERS: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
];

type AdminOrdersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const sp = await searchParams;
  const status = Array.isArray(sp.status) ? sp.status[0] : sp.status;
  const page = Array.isArray(sp.page) ? sp.page[0] : sp.page;

  const {
    items,
    total,
    page: currentPage,
    pageSize,
  } = await listOrders({
    status: status as OrderStatus | undefined,
    page,
  });

  return (
    <div className="flex flex-col gap-6">
      <Typography variant="h1">Orders</Typography>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/orders"
          className={`rounded-full border px-3 py-1 text-xs font-medium ${
            !status ? "border-primary text-primary" : "border-border text-muted-foreground"
          }`}
        >
          All
        </Link>
        {STATUS_FILTERS.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              status === s ? "border-primary text-primary" : "border-border text-muted-foreground"
            }`}
          >
            {STATUS_LABELS[s]}
          </Link>
        ))}
      </div>

      <div className="border-border divide-y rounded-lg border">
        {items.map((order: Order) => (
          <Link
            key={order.id}
            href={`/admin/orders/${order.id}`}
            className="hover:bg-muted/40 flex items-center justify-between gap-4 p-4 transition-colors"
          >
            <div>
              <p className="text-sm font-medium">{order.orderNumber}</p>
              <p className="text-muted-foreground text-xs">
                {order.email} · {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold">{formatPrice(order.total)}</span>
              <Badge>{STATUS_LABELS[order.status]}</Badge>
            </div>
          </Link>
        ))}

        {items.length === 0 ? (
          <p className="text-muted-foreground p-4 text-sm">No orders found.</p>
        ) : null}
      </div>

      <ShopPagination
        page={currentPage}
        pageSize={pageSize}
        total={total}
        searchParams={sp}
        basePath="/admin/orders"
      />
    </div>
  );
}
