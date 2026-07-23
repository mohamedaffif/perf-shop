"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { AddressFormDialog } from "@/components/account/AddressFormDialog";
import { useDeleteAddressMutation, useListAddressesQuery } from "@/lib/api/addressesApi";

export function AddressesManager() {
  const { data: addresses = [], isLoading } = useListAddressesQuery();
  const [deleteAddress] = useDeleteAddressMutation();

  function handleDelete(id: string) {
    if (window.confirm("Delete this address?")) {
      deleteAddress(id);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Typography variant="h4">Saved addresses</Typography>
        <AddressFormDialog
          trigger={
            <Button type="button" size="sm">
              <Plus className="size-4" />
              Add address
            </Button>
          }
        />
      </div>

      {isLoading ? (
        <Typography variant="body" className="text-muted-foreground">
          Loading…
        </Typography>
      ) : addresses.length === 0 ? (
        <Typography variant="body" className="text-muted-foreground">
          You haven&apos;t saved any addresses yet.
        </Typography>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="border-border flex flex-col gap-2 rounded-lg border p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">{address.label || address.fullName}</p>
                  {address.isDefault ? <Badge className="mt-1">Default</Badge> : null}
                </div>
                <div className="flex items-center gap-1">
                  <AddressFormDialog
                    address={address}
                    trigger={
                      <Button type="button" size="icon" variant="ghost" aria-label="Edit address">
                        <Pencil className="size-4" />
                      </Button>
                    }
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    aria-label="Delete address"
                    onClick={() => handleDelete(address.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>

              <p className="text-muted-foreground text-sm">
                {address.fullName}
                <br />
                {address.line1}
                {address.line2 ? <>, {address.line2}</> : null}
                <br />
                {address.city}, {address.state} {address.postalCode}
                <br />
                {address.country}
                <br />
                {address.phone}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
