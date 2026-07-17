import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  Category,
  CategoryFilters,
  CreateCategoryInput,
  PaginatedCategories,
  UpdateCategoryInput,
} from "@/domain/category/category.types";

export const categoriesApi = createApi({
  reducerPath: "categoriesApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    listCategories: builder.query<PaginatedCategories, CategoryFilters | void>({
      query: (filters) => ({ url: "/categories", params: filters ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: "Category" as const, id })),
              { type: "Category" as const, id: "LIST" },
            ]
          : [{ type: "Category" as const, id: "LIST" }],
    }),
    getCategory: builder.query<Category, string>({
      query: (id) => `/categories/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Category", id }],
    }),
    createCategory: builder.mutation<Category, CreateCategoryInput>({
      query: (body) => ({ url: "/categories", method: "POST", body }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),
    updateCategory: builder.mutation<Category, { id: string; data: UpdateCategoryInput }>({
      query: ({ id, data }) => ({ url: `/categories/${id}`, method: "PATCH", body: data }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Category", id },
        { type: "Category", id: "LIST" },
      ],
    }),
    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({ url: `/categories/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Category", id },
        { type: "Category", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useListCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
