import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  Address,
  CreateAddressInput,
  UpdateAddressInput,
} from "@/domain/address/address.types";

export const addressesApi = createApi({
  reducerPath: "addressesApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/account" }),
  tagTypes: ["Address"],
  endpoints: (builder) => ({
    listAddresses: builder.query<Address[], void>({
      query: () => "/addresses",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Address" as const, id })),
              { type: "Address" as const, id: "LIST" },
            ]
          : [{ type: "Address" as const, id: "LIST" }],
    }),
    createAddress: builder.mutation<Address, CreateAddressInput>({
      query: (body) => ({ url: "/addresses", method: "POST", body }),
      invalidatesTags: [{ type: "Address", id: "LIST" }],
    }),
    updateAddress: builder.mutation<Address, { id: string; data: UpdateAddressInput }>({
      query: ({ id, data }) => ({ url: `/addresses/${id}`, method: "PATCH", body: data }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Address", id },
        { type: "Address", id: "LIST" },
      ],
    }),
    deleteAddress: builder.mutation<void, string>({
      query: (id) => ({ url: `/addresses/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Address", id },
        { type: "Address", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useListAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = addressesApi;
