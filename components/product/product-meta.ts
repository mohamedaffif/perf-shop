import { Crown, Gem, Sparkles, Tag as TagIcon, type LucideIcon } from "lucide-react";

import type { Badge, Concentration, Size } from "@/domain/product/product.types";

export const SIZE_LABELS: Record<Size, string> = {
  ML_50: "50ML",
  ML_75: "75ML",
  ML_100: "100ML",
};

export const CONCENTRATION_LABELS: Record<Concentration, { oil: string; longevity: string }> = {
  EXTRAIT_DE_PARFUM: { oil: "20-30% Oil", longevity: "Long Lasting" },
  EAU_DE_PARFUM: { oil: "15-20% Oil", longevity: "Long Lasting" },
  EAU_DE_TOILETTE: { oil: "5-15% Oil", longevity: "Moderate" },
  EAU_DE_COLOGNE: { oil: "2-4% Oil", longevity: "Light" },
  EAU_FRAICHE: { oil: "1-3% Oil", longevity: "Light" },
};

export const BADGE_META: Record<Badge, { icon: LucideIcon; label: string }> = {
  NEW: { icon: Sparkles, label: "New" },
  BEST_SELLER: { icon: Crown, label: "Best Seller" },
  LIMITED_EDITION: { icon: Gem, label: "Limited Edition" },
  SALE: { icon: TagIcon, label: "Sale" },
};
