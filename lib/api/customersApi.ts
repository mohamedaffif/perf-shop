import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { CustomerFilters, CustomerStats, PaginatedCustomers } from "@/domain/user/user.types";

export const customersApi = createApi({
  reducerPath: "customersApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/admin" }),
  tagTypes: ["Customer"],
  endpoints: (builder) => ({
    listCustomers: builder.query<PaginatedCustomers, CustomerFilters | void>({
      query: (filters) => ({ url: "/customers", params: filters ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: "Customer" as const, id })),
              { type: "Customer" as const, id: "LIST" },
            ]
          : [{ type: "Customer" as const, id: "LIST" }],
    }),
    getCustomerStats: builder.query<CustomerStats, void>({
      query: () => ({ url: "/customers", params: { stats: "true" } }),
    }),
  }),
});

export const { useListCustomersQuery, useGetCustomerStatsQuery } = customersApi;
