import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  Coupon,
  CouponFilters,
  CreateCouponInput,
  PaginatedCoupons,
  UpdateCouponInput,
} from "@/domain/coupon/coupon.types";

export const couponsApi = createApi({
  reducerPath: "couponsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/admin" }),
  tagTypes: ["Coupon"],
  endpoints: (builder) => ({
    listCoupons: builder.query<PaginatedCoupons, CouponFilters | void>({
      query: (filters) => ({ url: "/coupons", params: filters ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: "Coupon" as const, id })),
              { type: "Coupon" as const, id: "LIST" },
            ]
          : [{ type: "Coupon" as const, id: "LIST" }],
    }),
    getCoupon: builder.query<Coupon, string>({
      query: (id) => `/coupons/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Coupon", id }],
    }),
    createCoupon: builder.mutation<Coupon, CreateCouponInput>({
      query: (body) => ({ url: "/coupons", method: "POST", body }),
      invalidatesTags: [{ type: "Coupon", id: "LIST" }],
    }),
    updateCoupon: builder.mutation<Coupon, { id: string; data: UpdateCouponInput }>({
      query: ({ id, data }) => ({ url: `/coupons/${id}`, method: "PATCH", body: data }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Coupon", id },
        { type: "Coupon", id: "LIST" },
      ],
    }),
    deleteCoupon: builder.mutation<void, string>({
      query: (id) => ({ url: `/coupons/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Coupon", id },
        { type: "Coupon", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useListCouponsQuery,
  useGetCouponQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} = couponsApi;
