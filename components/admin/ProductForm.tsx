"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useListBrandsQuery } from "@/lib/api/brandsApi";
import { useListCategoriesQuery } from "@/lib/api/categoriesApi";
import { useUploadImageMutation } from "@/lib/api/uploadApi";
import { getApiErrorIssues, getApiErrorMessage } from "@/lib/api/error-message";
import { useCreateProductMutation, useUpdateProductMutation } from "@/lib/api/productsApi";
import {
  badgeSchema,
  concentrationSchema,
  productStatusSchema,
  scentFamilySchema,
  sizeSchema,
} from "@/domain/product/product.validator";
import type { Product, ProductImageInput } from "@/domain/product/product.types";

const CONCENTRATION_OPTIONS = concentrationSchema.options;
const SCENT_FAMILY_OPTIONS = scentFamilySchema.options;
const SIZE_OPTIONS = sizeSchema.options;
const BADGE_OPTIONS = badgeSchema.options;

// What the admin edits, shaped for inputs (price/stock/notes stay text while
// typing). The API re-validates the converted payload with product.validator.
const productFormSchema = z.object({
  name: z.string().trim().min(1, "Enter a product name."),
  brandId: z.string().min(1, "Choose a brand."),
  categoryId: z.string().min(1, "Choose a category."),
  concentration: concentrationSchema,
  scentFamily: scentFamilySchema,
  size: sizeSchema,
  description: z.string(),
  topNotes: z.string(),
  heartNotes: z.string(),
  baseNotes: z.string(),
  price: z.string().refine((v) => v.trim() !== "" && Number(v) > 0, "Enter a price above 0."),
  stockQuantity: z
    .string()
    .refine((v) => /^\d+$/.test(v.trim()), "Enter a whole number, 0 or more."),
  status: productStatusSchema,
  badges: z.array(badgeSchema),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

const FORM_FIELDS = new Set(Object.keys(productFormSchema.shape));

function isFormField(field: string): field is keyof ProductFormValues {
  return FORM_FIELDS.has(field);
}

function splitNotes(notes: string): string[] {
  return notes
    .split(",")
    .map((note) => note.trim())
    .filter(Boolean);
}

function toDefaultValues(product?: Product): ProductFormValues {
  return {
    name: product?.name ?? "",
    brandId: product?.brandId ?? "",
    categoryId: product?.categoryId ?? "",
    concentration: product?.concentration ?? "EAU_DE_PARFUM",
    scentFamily: product?.scentFamily ?? "FLORAL",
    size: product?.size ?? "ML_50",
    description: product?.description ?? "",
    topNotes: product?.topNotes.join(", ") ?? "",
    heartNotes: product?.heartNotes.join(", ") ?? "",
    baseNotes: product?.baseNotes.join(", ") ?? "",
    price: product ? String(product.price) : "",
    stockQuantity: product ? String(product.stockQuantity) : "0",
    status: product?.status ?? "DRAFT",
    badges: product?.badges ?? [],
  };
}

interface ProductFormProps {
  product?: Product;
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: brandsData } = useListBrandsQuery({ pageSize: 100 });
  const { data: categoriesData } = useListCategoriesQuery({ pageSize: 100 });
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  // Invalid fields get a red border and a message underneath, focus moves to
  // the first one, and each clears as soon as it's corrected.
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: toDefaultValues(product),
  });

  // Images upload to Cloudinary as they're added, so they live outside the form fields.
  const [images, setImages] = useState<ProductImageInput[]>(
    product?.images.map((img) => ({
      url: img.url,
      publicId: img.publicId,
      altText: img.altText ?? undefined,
      isPrimary: img.isPrimary,
      order: img.order,
    })) ?? []
  );

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const uploaded = await uploadImage(file).unwrap();
    setImages((prev) => [
      ...prev,
      {
        url: uploaded.url,
        publicId: uploaded.publicId,
        isPrimary: prev.length === 0,
        order: prev.length,
      },
    ]);
  }

  function removeImage(publicId: string) {
    setImages((prev) => prev.filter((img) => img.publicId !== publicId));
  }

  function setPrimaryImage(publicId: string) {
    setImages((prev) => prev.map((img) => ({ ...img, isPrimary: img.publicId === publicId })));
  }

  async function onSubmit(values: ProductFormValues) {
    const payload = {
      ...values,
      description: values.description || undefined,
      topNotes: splitNotes(values.topNotes),
      heartNotes: splitNotes(values.heartNotes),
      baseNotes: splitNotes(values.baseNotes),
      price: Number(values.price),
      stockQuantity: Number(values.stockQuantity),
      images,
    };

    try {
      if (product) {
        await updateProduct({ id: product.id, data: payload }).unwrap();
      } else {
        await createProduct(payload).unwrap();
      }
      router.push("/admin/products");
    } catch (err) {
      // Anything the server rejects that the form checks missed: highlight
      // those fields the same way; otherwise show the API's message.
      let highlighted = false;
      for (const { path, message } of getApiErrorIssues(err)) {
        const field = path.split(".")[0];
        if (isFormField(field)) {
          form.setError(field, { message }, { shouldFocus: !highlighted });
          highlighted = true;
        }
      }
      form.setError("root", {
        message: highlighted
          ? "Please fix the highlighted fields."
          : getApiErrorMessage(err, "Something went wrong saving this product."),
      });
    }
  }

  const { isSubmitting, errors } = form.formState;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="flex max-w-2xl flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="brandId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger ref={field.ref}>
                      <SelectValue placeholder="Select a brand" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {brandsData?.items.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger ref={field.ref}>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categoriesData?.items.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="concentration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Concentration</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger ref={field.ref}>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CONCENTRATION_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option.replaceAll("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="scentFamily"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Scent Family</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger ref={field.ref}>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SCENT_FAMILY_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Size</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger ref={field.ref}>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SIZE_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option.replace("ML_", "")}ML
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {(
          [
            ["topNotes", "Top notes (comma-separated)"],
            ["heartNotes", "Heart notes (comma-separated)"],
            ["baseNotes", "Base notes (comma-separated)"],
          ] as const
        ).map(([name, label]) => (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (KES)</FormLabel>
                <FormControl>
                  <Input type="number" min={0} step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stockQuantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock quantity</FormLabel>
                <FormControl>
                  <Input type="number" min={0} step={1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger ref={field.ref}>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="badges"
          render={({ field }) => (
            <FormItem>
              <Label>Badges</Label>
              <div className="flex flex-wrap gap-4">
                {BADGE_OPTIONS.map((badge) => (
                  <div key={badge} className="flex items-center gap-2">
                    <Checkbox
                      id={`badge-${badge}`}
                      checked={field.value.includes(badge)}
                      onCheckedChange={(checked) =>
                        field.onChange(
                          checked ? [...field.value, badge] : field.value.filter((b) => b !== badge)
                        )
                      }
                    />
                    <Label htmlFor={`badge-${badge}`}>{badge.replaceAll("_", " ")}</Label>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-1.5">
          <Label>Images</Label>
          <div className="flex flex-wrap gap-3">
            {images.map((image) => (
              <div key={image.publicId} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt={image.altText ?? ""}
                  className="border-border size-20 rounded-lg border object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(image.publicId)}
                  aria-label="Remove image"
                  className="bg-background border-border absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full border"
                >
                  <X className="size-3" />
                </button>
                <button
                  type="button"
                  onClick={() => setPrimaryImage(image.publicId)}
                  className={
                    image.isPrimary
                      ? "bg-primary text-primary-foreground absolute bottom-1 left-1 rounded px-1 text-[9px] font-semibold uppercase"
                      : "bg-background/80 text-muted-foreground absolute bottom-1 left-1 rounded px-1 text-[9px] font-semibold uppercase"
                  }
                >
                  {image.isPrimary ? "Primary" : "Set primary"}
                </button>
              </div>
            ))}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelected}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? "Uploading…" : "Add image"}
          </Button>
        </div>

        {errors.root?.message && (
          <p className="text-danger-foreground text-sm">{errors.root.message}</p>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : product ? "Save changes" : "Create product"}
        </Button>
      </form>
    </Form>
  );
}
