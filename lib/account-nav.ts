import type { DashboardNavLinkItem } from "@/components/layout/DashboardNav";

export const ACCOUNT_NAV: DashboardNavLinkItem[] = [
  { label: "Profile", href: "/account", icon: "profile", exact: true },
  { label: "Orders", href: "/account/orders", icon: "orders" },
  { label: "Addresses", href: "/account/addresses", icon: "addresses" },
];
