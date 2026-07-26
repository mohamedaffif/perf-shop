"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { useDeleteBrandMutation, useListBrandsQuery } from "@/lib/api/brandsApi";

const PAGE_SIZE = 20;

export default function AdminBrandsPage() {
  const { data: session } = useSession();
  const canDelete = session?.user?.role === "ADMIN";
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const { data, isLoading } = useListBrandsQuery({ page, pageSize: PAGE_SIZE, search });
  const [deleteBrand] = useDeleteBrandMutation();

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;

    setDeleteError(null);
    try {
      await deleteBrand(id).unwrap();
    } catch (err) {
      const message =
        err && typeof err === "object" && "data" in err
          ? ((err.data as { error?: string } | undefined)?.error ?? "Failed to delete brand.")
          : "Failed to delete brand.";
      setDeleteError(message);
    }
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Typography variant="h1">Brands</Typography>
        <Button asChild size="sm">
          <Link href="/admin/brands/new">
            <Plus className="size-4" />
            New brand
          </Link>
        </Button>
      </div>

      <div className="relative w-64">
        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          placeholder="Search brands"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-9"
        />
      </div>

      {deleteError && <p className="text-danger-foreground text-sm">{deleteError}</p>}

      {isLoading ? (
        <Typography variant="body" className="text-muted-foreground">
          Loading…
        </Typography>
      ) : (
        <div className="border-border divide-y rounded-lg border">
          {data?.items.map((brand) => (
            <div key={brand.id} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{brand.name}</p>
                <p className="text-muted-foreground text-xs">{brand.slug}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <Button asChild size="icon" variant="ghost" aria-label="Edit brand">
                  <Link href={`/admin/brands/${brand.id}/edit`}>
                    <Pencil className="size-4" />
                  </Link>
                </Button>
                {canDelete ? (
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    aria-label="Delete brand"
                    onClick={() => handleDelete(brand.id, brand.name)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                ) : null}
              </div>
            </div>
          ))}

          {data?.items.length === 0 ? (
            <p className="text-muted-foreground p-4 text-sm">No brands yet.</p>
          ) : null}
        </div>
      )}

      {totalPages > 1 ? (
        <div className="flex items-center justify-center gap-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-muted-foreground text-sm">
            Page {page} of {totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      ) : null}
    </div>
  );
}
