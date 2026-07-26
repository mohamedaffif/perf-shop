import { Typography } from "@/components/ui/typography";
import { BrandForm } from "@/components/admin/BrandForm";

export default function NewBrandPage() {
  return (
    <div className="flex flex-col gap-6">
      <Typography variant="h1">New Brand</Typography>
      <BrandForm />
    </div>
  );
}
