import { Typography } from "@/components/ui/typography";
import { CouponForm } from "@/components/admin/CouponForm";

export default function NewCouponPage() {
  return (
    <div className="flex flex-col gap-6">
      <Typography variant="h1">New Coupon</Typography>
      <CouponForm />
    </div>
  );
}
