"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Typography } from "@/components/ui/typography";
import { useAsyncForm } from "@/hooks/useAsyncForm";
import { useGetSettingsQuery, useUpdateSettingsMutation } from "@/lib/api/settingsApi";
import type { StoreSettings, UpdateStoreSettingsInput } from "@/domain/settings/settings.types";

const CURRENCIES = [
  { value: "KES", label: "KES — Kenyan Shilling" },
  { value: "USD", label: "USD — US Dollar" },
  { value: "EUR", label: "EUR — Euro" },
];

const TIMEZONES = [
  { value: "Africa/Nairobi", label: "East Africa Time (GMT+3)" },
  { value: "UTC", label: "UTC" },
];

export default function AdminSettingsPage() {
  const { data: settings, isLoading } = useGetSettingsQuery();

  if (isLoading || !settings) {
    return (
      <Typography variant="body" className="text-muted-foreground">
        Loading…
      </Typography>
    );
  }

  return <SettingsForm settings={settings} />;
}

function SettingsForm({ settings }: { settings: StoreSettings }) {
  const [updateSettings] = useUpdateSettingsMutation();
  const [form, setForm] = useState<UpdateStoreSettingsInput>(() => ({
    storeName: settings.storeName,
    supportEmail: settings.supportEmail ?? "",
    supportPhone: settings.supportPhone ?? "",
    storeAddress: settings.storeAddress ?? "",
    currency: settings.currency,
    timezone: settings.timezone,
    pesapalEnabled: settings.pesapalEnabled,
    codEnabled: settings.codEnabled,
    bankTransferEnabled: settings.bankTransferEnabled,
    newOrderAlerts: settings.newOrderAlerts,
    lowStockAlerts: settings.lowStockAlerts,
    marketingDigest: settings.marketingDigest,
  }));

  const { error, isSubmitting, handleSubmit } = useAsyncForm(async () => {
    await updateSettings(form).unwrap();
  });

  function setField<K extends keyof UpdateStoreSettingsInput>(
    key: K,
    value: UpdateStoreSettingsInput[K]
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-3xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <Typography variant="h1">Settings</Typography>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save Changes"}
        </Button>
      </div>

      {error && <p className="text-danger-foreground text-sm">{error}</p>}

      <Card>
        <CardHeader>
          <CardTitle>Store Details</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="storeName">Store Name</Label>
            <Input
              id="storeName"
              value={form.storeName ?? ""}
              onChange={(e) => setField("storeName", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input
                id="supportEmail"
                type="email"
                value={form.supportEmail ?? ""}
                onChange={(e) => setField("supportEmail", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="supportPhone">Support Phone</Label>
              <Input
                id="supportPhone"
                value={form.supportPhone ?? ""}
                onChange={(e) => setField("supportPhone", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="storeAddress">Store Address</Label>
            <Input
              id="storeAddress"
              value={form.storeAddress ?? ""}
              onChange={(e) => setField("storeAddress", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Currency &amp; Region</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="currency">Currency</Label>
            <Select value={form.currency} onValueChange={(value) => setField("currency", value)}>
              <SelectTrigger id="currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="timezone">Timezone</Label>
            <Select value={form.timezone} onValueChange={(value) => setField("timezone", value)}>
              <SelectTrigger id="timezone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col divide-y">
          <ToggleRow
            label="Pesapal"
            description="Card payments via Pesapal gateway"
            checked={form.pesapalEnabled ?? false}
            onCheckedChange={(v) => setField("pesapalEnabled", v)}
          />
          <ToggleRow
            label="Cash on Delivery"
            description="Pay when the order arrives"
            checked={form.codEnabled ?? false}
            onCheckedChange={(v) => setField("codEnabled", v)}
          />
          <ToggleRow
            label="Bank Transfer"
            description="Manual bank transfer for large orders"
            checked={form.bankTransferEnabled ?? false}
            onCheckedChange={(v) => setField("bankTransferEnabled", v)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col divide-y">
          <ToggleRow
            label="New Order Alerts"
            description="Email when a new order comes in"
            checked={form.newOrderAlerts ?? false}
            onCheckedChange={(v) => setField("newOrderAlerts", v)}
          />
          <ToggleRow
            label="Low Stock Alerts"
            description="Notify when inventory falls below 10 units"
            checked={form.lowStockAlerts ?? false}
            onCheckedChange={(v) => setField("lowStockAlerts", v)}
          />
          <ToggleRow
            label="Marketing Digest"
            description="Weekly summary of newsletter signups"
            checked={form.marketingDigest ?? false}
            onCheckedChange={(v) => setField("marketingDigest", v)}
          />
        </CardContent>
      </Card>
    </form>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
