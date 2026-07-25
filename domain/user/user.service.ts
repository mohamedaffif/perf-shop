import * as userRepository from "./user.repository";
import { customerFiltersSchema } from "./user.validator";
import type { CustomerStats, PaginatedCustomers } from "./user.types";

export async function listCustomers(rawFilters: unknown): Promise<PaginatedCustomers> {
  const filters = customerFiltersSchema.parse(rawFilters);
  const { items, total } = await userRepository.findMany(filters);

  return { items, total, page: filters.page, pageSize: filters.pageSize };
}

export async function getCustomerStats(): Promise<CustomerStats> {
  return userRepository.getStats();
}
