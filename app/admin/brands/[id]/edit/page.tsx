import { notFound } from "next/navigation";

import { Typography } from "@/components/ui/typography";
import { BrandForm } from "@/components/admin/BrandForm";
import { getBrand, BrandNotFoundError } from "@/domain/brand";

type EditBrandPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBrandPage({ params }: EditBrandPageProps) {
  const { id } = await params;

  const brand = await getBrand(id).catch((err) => {
    if (err instanceof BrandNotFoundError) return null;
    throw err;
  });

  if (!brand) notFound();

  return (
    <div className="flex flex-col gap-6">
      <Typography variant="h1">Edit Brand</Typography>
      <BrandForm brand={brand} />
    </div>
  );
}
