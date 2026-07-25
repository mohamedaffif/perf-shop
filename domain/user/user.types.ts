export type CustomerTier = "VIP" | "REGULAR" | "NEW";

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

export interface CustomerFilters {
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedCustomers {
  items: Customer[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CustomerStats {
  totalCustomers: number;
  newThisMonth: number;
  vipCustomers: number;
  avgOrderValue: number;
}
