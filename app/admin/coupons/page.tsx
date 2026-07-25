"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { formatPrice } from "@/lib/utils";
import { useDeleteCouponMutation, useListCouponsQuery } from "@/lib/api/couponsApi";

export default function AdminCouponsPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const { data, isLoading } = useListCouponsQuery({ pageSize: 100, search });
  const [deleteCoupon] = useDeleteCouponMutation();

  function handleDelete(id: string, code: string) {
    if (window.confirm(`Delete coupon "${code}"?`)) {
      deleteCoupon(id);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Typography variant="h1">Coupons</Typography>
        <Button asChild size="sm">
          <Link href="/admin/coupons/new">
            <Plus className="size-4" />
            New coupon
          </Link>
        </Button>
      </div>

      <div className="relative w-64">
        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          placeholder="Search coupons"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <Typography variant="body" className="text-muted-foreground">
          Loading…
        </Typography>
      ) : (
        <div className="border-border divide-y rounded-lg border">
          {data?.items.map((coupon) => (
            <div key={coupon.id} className="flex items-center justify-between gap-4 p-4">
              <div>
                <p className="text-sm font-medium">{coupon.code}</p>
                <p className="text-muted-foreground text-xs">
                  {coupon.type === "PERCENTAGE"
                    ? `${coupon.value}% off`
                    : `${formatPrice(coupon.value)} off`}{" "}
                  · Used {coupon.usedCount}
                  {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={coupon.isActive ? "success" : "secondary"}>
                  {coupon.isActive ? "Active" : "Inactive"}
                </Badge>
                <Button asChild size="icon" variant="ghost" aria-label="Edit coupon">
                  <Link href={`/admin/coupons/${coupon.id}/edit`}>
                    <Pencil className="size-4" />
                  </Link>
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  aria-label="Delete coupon"
                  onClick={() => handleDelete(coupon.id, coupon.code)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}

          {data?.items.length === 0 ? (
            <p className="text-muted-foreground p-4 text-sm">No coupons yet.</p>
          ) : null}
        </div>
      )}
    </div>
  );
}
