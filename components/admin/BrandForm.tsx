"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAsyncForm } from "@/hooks/useAsyncForm";
import { slugify } from "@/lib/utils";
import { useCreateBrandMutation, useUpdateBrandMutation } from "@/lib/api/brandsApi";
import type { Brand } from "@/domain/brand/brand.types";

interface BrandFormProps {
  brand?: Brand;
}

export function BrandForm({ brand }: BrandFormProps) {
  const router = useRouter();

  const [createBrand] = useCreateBrandMutation();
  const [updateBrand] = useUpdateBrandMutation();

  const [name, setName] = useState(brand?.name ?? "");
  const [slug, setSlug] = useState(brand?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(brand));
  const [description, setDescription] = useState(brand?.description ?? "");

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
      if (brand) {
        await updateBrand({ id: brand.id, data: payload }).unwrap();
      } else {
        await createBrand(payload).unwrap();
      }
      router.push("/admin/brands");
    } catch {
      return { error: "Something went wrong saving this brand." };
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
        {isSubmitting ? "Saving…" : brand ? "Save changes" : "Create brand"}
      </Button>
    </form>
  );
}
