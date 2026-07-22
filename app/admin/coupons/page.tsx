"use client";

import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { formatPrice } from "@/lib/utils";
import { useDeleteCouponMutation, useListCouponsQuery } from "@/lib/api/couponsApi";

export default function AdminCouponsPage() {
  const { data, isLoading } = useListCouponsQuery({ pageSize: 100 });
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
