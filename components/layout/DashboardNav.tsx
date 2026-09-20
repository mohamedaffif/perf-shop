"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Layers,
  LayoutDashboard,
  Mail,
  MapPin,
  Package,
  Settings,
  ShoppingBag,
  Tags,
  Ticket,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

const ICONS = {
  dashboard: LayoutDashboard,
  products: Package,
  brands: Tags,
  categories: Layers,
  orders: ShoppingBag,
  customers: Users,
  subscribers: Mail,
  coupons: Ticket,
  settings: Settings,
  profile: User,
  addresses: MapPin,
} satisfies Record<string, LucideIcon>;

export type DashboardNavIconName = keyof typeof ICONS;

export type DashboardNavLinkItem = {
  label: string;
  href: string;
  icon: DashboardNavIconName;
  /** Match the pathname exactly (for root routes like /admin that prefix every child route). */
  exact?: boolean;
};

function isActive(pathname: string, { href, exact }: DashboardNavLinkItem) {
  return pathname === href || (!exact && pathname.startsWith(`${href}/`));
}

export function DashboardNavLink({
  item,
  className,
  onClick,
}: {
  item: DashboardNavLinkItem;
  className?: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active = isActive(pathname, item);
  const Icon = ICONS[item.icon];

  return (
    <Link
      href={item.href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "hover:bg-muted hover:text-foreground inline-flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active ? "bg-muted text-foreground" : "text-foreground/80",
        className
      )}
    >
      <Icon className={cn("size-4 shrink-0", active && "text-primary")} />
      {item.label}
    </Link>
  );
}

export function DashboardNav({
  links,
  className,
  children,
}: {
  links: DashboardNavLinkItem[];
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <nav className={className}>
      {links.map((item) => (
        <DashboardNavLink key={item.href} item={item} />
      ))}
      {children}
    </nav>
  );
}
