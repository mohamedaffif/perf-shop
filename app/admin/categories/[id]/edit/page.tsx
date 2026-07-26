import { notFound } from "next/navigation";

import { Typography } from "@/components/ui/typography";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { getCategory, CategoryNotFoundError } from "@/domain/category";

type EditCategoryPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params;

  const category = await getCategory(id).catch((err) => {
    if (err instanceof CategoryNotFoundError) return null;
    throw err;
  });

  if (!category) notFound();

  return (
    <div className="flex flex-col gap-6">
      <Typography variant="h1">Edit Category</Typography>
      <CategoryForm category={category} />
    </div>
  );
}
