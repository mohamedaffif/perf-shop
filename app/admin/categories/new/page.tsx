import { Typography } from "@/components/ui/typography";
import { CategoryForm } from "@/components/admin/CategoryForm";

export default function NewCategoryPage() {
  return (
    <div className="flex flex-col gap-6">
      <Typography variant="h1">New Category</Typography>
      <CategoryForm />
    </div>
  );
}
