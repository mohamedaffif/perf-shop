"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAsyncForm } from "@/hooks/useAsyncForm";
import { slugify } from "@/lib/utils";
import { useCreateCategoryMutation, useUpdateCategoryMutation } from "@/lib/api/categoriesApi";
import type { Category } from "@/domain/category/category.types";

interface CategoryFormProps {
  category?: Category;
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(category));
  const [description, setDescription] = useState(category?.description ?? "");

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  }

  const { error, isSubmitting, handleSubmit } = useAsyncForm(async () => {
    const payload = {
      name,
      slug,
      description: description || undefined,
    };

    try {
      if (category) {
        await updateCategory({ id: category.id, data: payload }).unwrap();
      } else {
        await createCategory(payload).unwrap();
      }
      router.push("/admin/categories");
    } catch {
      return { error: "Something went wrong saving this category." };
    }
  });

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Name</Label>
        <Input id="name" required value={name} onChange={(e) => handleNameChange(e.target.value)} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          required
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {error && <p className="text-danger-foreground text-sm">{error}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : category ? "Save changes" : "Create category"}
      </Button>
    </form>
  );
}
