"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { formatPrice } from "@/lib/utils";
import { useGetCustomerStatsQuery, useListCustomersQuery } from "@/lib/api/customersApi";
import type { CustomerTier } from "@/domain/user/user.types";

const PAGE_SIZE = 20;

const TIER_BADGE_VARIANT: Record<CustomerTier, "success" | "info" | "secondary"> = {
  VIP: "success",
  NEW: "info",
  REGULAR: "secondary",
};

const TIER_LABEL: Record<CustomerTier, string> = {
  VIP: "VIP",
  NEW: "New",
  REGULAR: "Regular",
};

function initials(name: string | null, email: string | null): string {
  const source = name || email || "?";
  return source
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function AdminCustomersPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const { data, isLoading } = useListCustomersQuery({ page, pageSize: PAGE_SIZE, search });
  const { data: stats } = useGetCustomerStatsQuery();

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

  const statCards = [
    { label: "Total Customers", value: stats?.totalCustomers ?? "—" },
    { label: "New This Month", value: stats?.newThisMonth ?? "—" },
    { label: "VIP Customers", value: stats?.vipCustomers ?? "—" },
    { label: "Avg. Order Value", value: stats ? formatPrice(stats.avgOrderValue) : "—" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Typography variant="h1">Customers</Typography>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
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

      <div className="flex items-center justify-between">
        <Typography variant="body" className="text-muted-foreground">
          All customers
        </Typography>
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Search customers"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-56 pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <Typography variant="body" className="text-muted-foreground">
          Loading…
        </Typography>
      ) : (
        <div className="border-border divide-y rounded-lg border">
          {data?.items.map((customer) => (
            <div key={customer.id} className="flex items-center gap-4 p-4">
              <div className="bg-foreground text-background flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                {initials(customer.name, customer.email)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{customer.name || "Unnamed"}</p>
                <p className="text-muted-foreground truncate text-xs">{customer.email}</p>
              </div>
              <div className="hidden w-28 shrink-0 text-xs sm:block">
                {new Date(customer.createdAt).toLocaleDateString()}
              </div>
              <div className="hidden w-16 shrink-0 text-xs sm:block">{customer.orderCount}</div>
              <div className="w-28 shrink-0 text-sm font-medium">
                {formatPrice(customer.totalSpent)}
              </div>
              <div className="hidden w-28 shrink-0 text-xs md:block">
                {customer.lastOrderAt ? new Date(customer.lastOrderAt).toLocaleDateString() : "—"}
              </div>
              <Badge variant={TIER_BADGE_VARIANT[customer.tier]}>{TIER_LABEL[customer.tier]}</Badge>
            </div>
          ))}

          {data?.items.length === 0 ? (
            <p className="text-muted-foreground p-4 text-sm">No customers found.</p>
          ) : null}
        </div>
      )}

      {totalPages > 1 ? (
        <div className="flex items-center justify-center gap-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-muted-foreground text-sm">
            Page {page} of {totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      ) : null}
    </div>
  );
}
