import { notFound } from "next/navigation";

import { Typography } from "@/components/ui/typography";
import { CouponForm } from "@/components/admin/CouponForm";
import { CouponNotFoundError, getCoupon } from "@/domain/coupon";

type EditCouponPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCouponPage({ params }: EditCouponPageProps) {
  const { id } = await params;

  const coupon = await getCoupon(id).catch((err) => {
    if (err instanceof CouponNotFoundError) return null;
    throw err;
  });

  if (!coupon) notFound();

  return (
    <div className="flex flex-col gap-6">
      <Typography variant="h1">Edit Coupon</Typography>
      <CouponForm coupon={coupon} />
    </div>
  );
}
