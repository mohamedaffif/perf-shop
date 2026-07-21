import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { SearchResults } from "@/domain/search/search.types";

export const searchApi = createApi({
  reducerPath: "searchApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    search: builder.query<SearchResults, string>({
      query: (q) => ({ url: "/search", params: { q, limit: 8 } }),
    }),
  }),
});

export const { useSearchQuery } = searchApi;
