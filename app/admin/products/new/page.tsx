import { Typography } from "@/components/ui/typography";
import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div className="flex flex-col gap-6">
      <Typography variant="h1">New Product</Typography>
      <ProductForm />
    </div>
  );
}
