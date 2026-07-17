import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  CreateProductInput,
  PaginatedProducts,
  Product,
  ProductFilters,
  UpdateProductInput,
} from "@/domain/product/product.types";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    listProducts: builder.query<PaginatedProducts, ProductFilters | void>({
      query: (filters) => ({ url: "/products", params: filters ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: "Product" as const, id })),
              { type: "Product" as const, id: "LIST" },
            ]
          : [{ type: "Product" as const, id: "LIST" }],
    }),
    getProduct: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),
    createProduct: builder.mutation<Product, CreateProductInput>({
      query: (body) => ({ url: "/products", method: "POST", body }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
    updateProduct: builder.mutation<Product, { id: string; data: UpdateProductInput }>({
      query: ({ id, data }) => ({ url: `/products/${id}`, method: "PATCH", body: data }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({ url: `/products/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useListProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
