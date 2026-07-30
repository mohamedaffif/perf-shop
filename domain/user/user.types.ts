import type { z } from "zod";
import type { customerFiltersSchema } from "./user.validator";
import type { Paginated } from "@/domain/pagination";

export type CustomerTier = "VIP" | "REGULAR" | "NEW";

// Computed application model (VIP-tier/spend-aggregation logic in
// user.repository.ts's toCustomer()) — not 1:1 with any schema or Prisma row.
export interface Customer {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  createdAt: Date;
  orderCount: number;
  totalSpent: number;
  lastOrderAt: Date | null;
  tier: CustomerTier;
}

// Pre-parse shape used by RTK Query callers (page/pageSize are optional).
export type CustomerFilters = z.input<typeof customerFiltersSchema>;
// Post-parse shape the repository receives (page/pageSize are defaulted).
export type ParsedCustomerFilters = z.output<typeof customerFiltersSchema>;

export type PaginatedCustomers = Paginated<Customer>;

export interface CustomerStats {
  totalCustomers: number;
  newThisMonth: number;
  vipCustomers: number;
  avgOrderValue: number;
}
