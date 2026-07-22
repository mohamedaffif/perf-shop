"use client";

import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import type { ConsentState } from "@/lib/consent";

interface CookiePreferencesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  consent: ConsentState | null;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onSave: (prefs: { analytics: boolean; marketing: boolean }) => void;
}

export function CookiePreferencesDialog({
  open,
  onOpenChange,
  consent,
  onAcceptAll,
  onRejectAll,
  onSave,
}: CookiePreferencesDialogProps) {
  const [analytics, setAnalytics] = React.useState(consent?.analytics ?? false);
  const [marketing, setMarketing] = React.useState(consent?.marketing ?? false);

  // Reset the toggles to the current consent whenever the dialog opens.
  // Adjusted during render (not an effect) per https://react.dev/learn/you-might-not-need-an-effect
  const [prevOpen, setPrevOpen] = React.useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setAnalytics(consent?.analytics ?? false);
      setMarketing(consent?.marketing ?? false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cookie Preferences</DialogTitle>
          <DialogDescription>
            Choose which cookies you allow us to use. Necessary cookies keep the site working and
            can&apos;t be turned off.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Label>Necessary</Label>
              <p className="text-muted-foreground mt-1 text-sm">
                Required for core features like cart and checkout. Always active.
              </p>
            </div>
            <Switch checked disabled aria-label="Necessary cookies (always active)" />
          </div>

          <Separator />

          <div className="flex items-start justify-between gap-4">
            <div>
              <Label htmlFor="consent-analytics">Analytics</Label>
              <p className="text-muted-foreground mt-1 text-sm">
                Helps us understand site usage so we can improve it.
              </p>
            </div>
            <Switch id="consent-analytics" checked={analytics} onCheckedChange={setAnalytics} />
          </div>

          <Separator />

          <div className="flex items-start justify-between gap-4">
            <div>
              <Label htmlFor="consent-marketing">Marketing</Label>
              <p className="text-muted-foreground mt-1 text-sm">
                Used to show relevant offers and ads on and off our site.
              </p>
            </div>
            <Switch id="consent-marketing" checked={marketing} onCheckedChange={setMarketing} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onRejectAll}>
            Reject All
          </Button>
          <Button variant="outline" onClick={onAcceptAll}>
            Accept All
          </Button>
          <Button variant="secondary" onClick={() => onSave({ analytics, marketing })}>
            Save Preferences
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
