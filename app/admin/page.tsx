import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { listProducts } from "@/domain/product";
import { listOrders } from "@/domain/order";

export default async function AdminDashboardPage() {
  const [products, orders, pendingOrders] = await Promise.all([
    listProducts({ pageSize: 1 }),
    listOrders({ pageSize: 1 }),
    listOrders({ status: "PENDING", pageSize: 1 }),
  ]);

  const stats = [
    { label: "Total Products", value: products.total },
    { label: "Total Orders", value: orders.total },
    { label: "Pending Orders", value: pendingOrders.total },
  ];

  return (
    <div className="flex flex-col gap-8">
      <Typography variant="h1">Dashboard</Typography>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardTitle>{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="font-heading text-3xl font-semibold">{stat.value}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
