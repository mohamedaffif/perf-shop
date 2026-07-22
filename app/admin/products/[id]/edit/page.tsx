import { notFound } from "next/navigation";

import { Typography } from "@/components/ui/typography";
import { ProductForm } from "@/components/admin/ProductForm";
import { getProduct, ProductNotFoundError } from "@/domain/product";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  const product = await getProduct(id).catch((err) => {
    if (err instanceof ProductNotFoundError) return null;
    throw err;
  });

  if (!product) notFound();

  return (
    <div className="flex flex-col gap-6">
      <Typography variant="h1">Edit Product</Typography>
      <ProductForm product={product} />
    </div>
  );
}
