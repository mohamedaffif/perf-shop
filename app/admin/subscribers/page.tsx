"use client";

import { useEffect, useState } from "react";
import { Download, Search } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { useListSubscribersQuery } from "@/lib/api/subscribersApi";

const PAGE_SIZE = 20;

export default function AdminSubscribersPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const { data, isLoading } = useListSubscribersQuery({ page, pageSize: PAGE_SIZE, search });

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Typography variant="h1">Subscribers</Typography>
        <Button variant="outline" size="sm" asChild>
          <a href="/api/admin/subscribers?export=csv" download>
            <Download className="size-4" />
            Download CSV
          </a>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Total subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="font-heading text-3xl font-semibold">{data?.total ?? "—"}</span>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <Typography variant="body" className="text-muted-foreground">
          Newsletter list
        </Typography>
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Search by email"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-56 pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <Typography variant="body" className="text-muted-foreground">
          Loading…
        </Typography>
      ) : (
        <div className="border-border divide-y rounded-lg border">
          {data?.items.map((subscriber) => (
            <div key={subscriber.id} className="flex items-center gap-4 p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{subscriber.email}</p>
                {subscriber.unsubscribedAt ? (
                  <p className="text-muted-foreground text-xs">Unsubscribed</p>
                ) : null}
              </div>
              <div className="hidden w-24 shrink-0 text-xs sm:block">
                {subscriber.source ?? "—"}
              </div>
              <div className="w-28 shrink-0 text-right text-xs">
                {new Date(subscriber.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}

          {data?.items.length === 0 ? (
            <p className="text-muted-foreground p-4 text-sm">No subscribers yet.</p>
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
