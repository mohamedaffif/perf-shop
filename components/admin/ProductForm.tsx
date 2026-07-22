"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAsyncForm } from "@/hooks/useAsyncForm";
import { useListBrandsQuery } from "@/lib/api/brandsApi";
import { useListCategoriesQuery } from "@/lib/api/categoriesApi";
import { useUploadImageMutation } from "@/lib/api/uploadApi";
import { useCreateProductMutation, useUpdateProductMutation } from "@/lib/api/productsApi";
import type {
  Badge,
  Concentration,
  Product,
  ProductImageInput,
  ScentFamily,
  Size,
} from "@/domain/product/product.types";

const CONCENTRATION_OPTIONS: Concentration[] = [
  "EXTRAIT_DE_PARFUM",
  "EAU_DE_PARFUM",
  "EAU_DE_TOILETTE",
  "EAU_DE_COLOGNE",
  "EAU_FRAICHE",
];

const SCENT_FAMILY_OPTIONS: ScentFamily[] = [
  "FLORAL",
  "ORIENTAL",
  "FRESH",
  "WOODY",
  "AROMATIC",
  "CITRUS",
  "SPICY",
];

const SIZE_OPTIONS: Size[] = ["ML_50", "ML_75", "ML_100"];
const BADGE_OPTIONS: Badge[] = ["NEW", "BEST_SELLER", "LIMITED_EDITION", "SALE"];

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

  const [name, setName] = useState(product?.name ?? "");
  const [brandId, setBrandId] = useState(product?.brandId ?? "");
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");
  const [concentration, setConcentration] = useState<Concentration>(
    product?.concentration ?? "EAU_DE_PARFUM"
  );
  const [scentFamily, setScentFamily] = useState<ScentFamily>(product?.scentFamily ?? "FLORAL");
  const [size, setSize] = useState<Size>(product?.size ?? "ML_50");
  const [description, setDescription] = useState(product?.description ?? "");
  const [topNotes, setTopNotes] = useState(product?.topNotes.join(", ") ?? "");
  const [heartNotes, setHeartNotes] = useState(product?.heartNotes.join(", ") ?? "");
  const [baseNotes, setBaseNotes] = useState(product?.baseNotes.join(", ") ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [stockQuantity, setStockQuantity] = useState(
    product ? String(product.stockQuantity) : "0"
  );
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">(product?.status ?? "DRAFT");
  const [badges, setBadges] = useState<Badge[]>(product?.badges ?? []);
  const [images, setImages] = useState<ProductImageInput[]>(
    product?.images.map((img) => ({
      url: img.url,
      publicId: img.publicId,
      altText: img.altText ?? undefined,
      isPrimary: img.isPrimary,
      order: img.order,
    })) ?? []
  );

  function toggleBadge(badge: Badge) {
    setBadges((prev) => (prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]));
  }

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const uploaded = await uploadImage(file).unwrap();
    setImages((prev) => [
      ...prev,
      { url: uploaded.url, publicId: uploaded.publicId, isPrimary: prev.length === 0, order: prev.length },
    ]);
  }

  function removeImage(publicId: string) {
    setImages((prev) => prev.filter((img) => img.publicId !== publicId));
  }

  function setPrimaryImage(publicId: string) {
    setImages((prev) => prev.map((img) => ({ ...img, isPrimary: img.publicId === publicId })));
  }

  const { error, isSubmitting, handleSubmit } = useAsyncForm(async () => {
    const payload = {
      name,
      brandId,
      categoryId,
      concentration,
      scentFamily,
      description: description || undefined,
      topNotes: topNotes ? topNotes.split(",").map((n) => n.trim()).filter(Boolean) : [],
      heartNotes: heartNotes ? heartNotes.split(",").map((n) => n.trim()).filter(Boolean) : [],
      baseNotes: baseNotes ? baseNotes.split(",").map((n) => n.trim()).filter(Boolean) : [],
      size,
      price: Number(price),
      stockQuantity: Number(stockQuantity),
      status,
      badges,
      images,
    };

    try {
      if (product) {
        await updateProduct({ id: product.id, data: payload }).unwrap();
      } else {
        await createProduct(payload).unwrap();
      }
      router.push("/admin/products");
    } catch {
      return { error: "Something went wrong saving this product." };
    }
  });

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Name</Label>
        <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Brand</Label>
          <Select value={brandId} onValueChange={setBrandId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a brand" />
            </SelectTrigger>
            <SelectContent>
              {brandsData?.items.map((brand) => (
                <SelectItem key={brand.id} value={brand.id}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Category</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categoriesData?.items.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label>Concentration</Label>
          <Select value={concentration} onValueChange={(v) => setConcentration(v as Concentration)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CONCENTRATION_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option.replaceAll("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Scent Family</Label>
          <Select value={scentFamily} onValueChange={(v) => setScentFamily(v as ScentFamily)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SCENT_FAMILY_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Size</Label>
          <Select value={size} onValueChange={(v) => setSize(v as Size)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SIZE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option.replace("ML_", "")}ML
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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

      <div className="space-y-1.5">
        <Label htmlFor="topNotes">Top notes (comma-separated)</Label>
        <Input id="topNotes" value={topNotes} onChange={(e) => setTopNotes(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="heartNotes">Heart notes (comma-separated)</Label>
        <Input id="heartNotes" value={heartNotes} onChange={(e) => setHeartNotes(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="baseNotes">Base notes (comma-separated)</Label>
        <Input id="baseNotes" value={baseNotes} onChange={(e) => setBaseNotes(e.target.value)} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="price">Price (KES)</Label>
          <Input
            id="price"
            type="number"
            min={0}
            step="0.01"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="stockQuantity">Stock quantity</Label>
          <Input
            id="stockQuantity"
            type="number"
            min={0}
            required
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as "DRAFT" | "PUBLISHED")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Badges</Label>
        <div className="flex flex-wrap gap-4">
          {BADGE_OPTIONS.map((badge) => (
            <div key={badge} className="flex items-center gap-2">
              <Checkbox
                id={`badge-${badge}`}
                checked={badges.includes(badge)}
                onCheckedChange={() => toggleBadge(badge)}
              />
              <Label htmlFor={`badge-${badge}`}>{badge.replaceAll("_", " ")}</Label>
            </div>
          ))}
        </div>
      </div>

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

      {error && <p className="text-danger-foreground text-sm">{error}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : product ? "Save changes" : "Create product"}
      </Button>
    </form>
  );
}
