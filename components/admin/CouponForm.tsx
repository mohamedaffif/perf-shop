"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAsyncForm } from "@/hooks/useAsyncForm";
import { useCreateCouponMutation, useUpdateCouponMutation } from "@/lib/api/couponsApi";
import type { Coupon, CouponType } from "@/domain/coupon/coupon.types";

function toDateInputValue(date: Date | null): string {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

interface CouponFormProps {
  coupon?: Coupon;
}

export function CouponForm({ coupon }: CouponFormProps) {
  const router = useRouter();
  const [createCoupon] = useCreateCouponMutation();
  const [updateCoupon] = useUpdateCouponMutation();

  const [code, setCode] = useState(coupon?.code ?? "");
  const [type, setType] = useState<CouponType>(coupon?.type ?? "PERCENTAGE");
  const [value, setValue] = useState(coupon ? String(coupon.value) : "");
  const [isActive, setIsActive] = useState(coupon?.isActive ?? true);
  const [minOrderValue, setMinOrderValue] = useState(
    coupon?.minOrderValue !== null && coupon?.minOrderValue !== undefined
      ? String(coupon.minOrderValue)
      : ""
  );
  const [maxDiscountAmount, setMaxDiscountAmount] = useState(
    coupon?.maxDiscountAmount !== null && coupon?.maxDiscountAmount !== undefined
      ? String(coupon.maxDiscountAmount)
      : ""
  );
  const [startsAt, setStartsAt] = useState(toDateInputValue(coupon?.startsAt ?? null));
  const [expiresAt, setExpiresAt] = useState(toDateInputValue(coupon?.expiresAt ?? null));
  const [usageLimit, setUsageLimit] = useState(coupon?.usageLimit ? String(coupon.usageLimit) : "");
  const [usageLimitPerUser, setUsageLimitPerUser] = useState(
    coupon?.usageLimitPerUser ? String(coupon.usageLimitPerUser) : ""
  );

  const { error, isSubmitting, handleSubmit } = useAsyncForm(async () => {
    const payload = {
      code,
      type,
      value: Number(value),
      isActive,
      minOrderValue: minOrderValue ? Number(minOrderValue) : undefined,
      maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : undefined,
      startsAt: startsAt || undefined,
      expiresAt: expiresAt || undefined,
      usageLimit: usageLimit ? Number(usageLimit) : undefined,
      usageLimitPerUser: usageLimitPerUser ? Number(usageLimitPerUser) : undefined,
    };

    try {
      if (coupon) {
        await updateCoupon({ id: coupon.id, data: payload }).unwrap();
      } else {
        await createCoupon(payload).unwrap();
      }
      router.push("/admin/coupons");
    } catch {
      return { error: "Something went wrong saving this coupon." };
    }
  });

  return (
    <form onSubmit={handleSubmit} className="flex max-w-lg flex-col gap-4">
      <div className="space-y-1.5">
        <Label htmlFor="code">Code</Label>
        <Input
          id="code"
          required
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Type</Label>
          <Select value={type} onValueChange={(v) => setType(v as CouponType)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PERCENTAGE">Percentage</SelectItem>
              <SelectItem value="FIXED_AMOUNT">Fixed amount</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="value">Value {type === "PERCENTAGE" ? "(%)" : "(KES)"}</Label>
          <Input
            id="value"
            type="number"
            min={0}
            step="0.01"
            required
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="minOrderValue">Min order value (optional)</Label>
          <Input
            id="minOrderValue"
            type="number"
            min={0}
            step="0.01"
            value={minOrderValue}
            onChange={(e) => setMinOrderValue(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="maxDiscountAmount">Max discount (optional)</Label>
          <Input
            id="maxDiscountAmount"
            type="number"
            min={0}
            step="0.01"
            value={maxDiscountAmount}
            onChange={(e) => setMaxDiscountAmount(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="startsAt">Starts (optional)</Label>
          <Input
            id="startsAt"
            type="date"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="expiresAt">Expires (optional)</Label>
          <Input
            id="expiresAt"
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="usageLimit">Total usage limit (optional)</Label>
          <Input
            id="usageLimit"
            type="number"
            min={1}
            value={usageLimit}
            onChange={(e) => setUsageLimit(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="usageLimitPerUser">Per-user limit (optional)</Label>
          <Input
            id="usageLimitPerUser"
            type="number"
            min={1}
            value={usageLimitPerUser}
            onChange={(e) => setUsageLimitPerUser(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="isActive"
          checked={isActive}
          onCheckedChange={(checked) => setIsActive(checked === true)}
        />
        <Label htmlFor="isActive">Active</Label>
      </div>

      {error && <p className="text-danger-foreground text-sm">{error}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : coupon ? "Save changes" : "Create coupon"}
      </Button>
    </form>
  );
}
