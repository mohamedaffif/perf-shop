import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { PaginatedSubscribers, SubscriberFilters } from "@/domain/newsletter/newsletter.types";

export const subscribersApi = createApi({
  reducerPath: "subscribersApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/admin" }),
  tagTypes: ["Subscriber"],
  endpoints: (builder) => ({
    listSubscribers: builder.query<PaginatedSubscribers, SubscriberFilters | void>({
      query: (filters) => ({ url: "/subscribers", params: filters ?? undefined }),
      providesTags: [{ type: "Subscriber", id: "LIST" }],
    }),
  }),
});

export const { useListSubscribersQuery } = subscribersApi;
