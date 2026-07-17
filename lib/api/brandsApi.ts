import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  Brand,
  BrandFilters,
  CreateBrandInput,
  PaginatedBrands,
  UpdateBrandInput,
} from "@/domain/brand/brand.types";

export const brandsApi = createApi({
  reducerPath: "brandsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Brand"],
  endpoints: (builder) => ({
    listBrands: builder.query<PaginatedBrands, BrandFilters | void>({
      query: (filters) => ({ url: "/brands", params: filters ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: "Brand" as const, id })),
              { type: "Brand" as const, id: "LIST" },
            ]
          : [{ type: "Brand" as const, id: "LIST" }],
    }),
    getBrand: builder.query<Brand, string>({
      query: (id) => `/brands/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Brand", id }],
    }),
    createBrand: builder.mutation<Brand, CreateBrandInput>({
      query: (body) => ({ url: "/brands", method: "POST", body }),
      invalidatesTags: [{ type: "Brand", id: "LIST" }],
    }),
    updateBrand: builder.mutation<Brand, { id: string; data: UpdateBrandInput }>({
      query: ({ id, data }) => ({ url: `/brands/${id}`, method: "PATCH", body: data }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Brand", id },
        { type: "Brand", id: "LIST" },
      ],
    }),
    deleteBrand: builder.mutation<void, string>({
      query: (id) => ({ url: `/brands/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Brand", id },
        { type: "Brand", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useListBrandsQuery,
  useGetBrandQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandsApi;
