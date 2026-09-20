import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  AccountProfile,
  ChangePasswordInput,
  UpdateProfileInput,
} from "@/domain/auth/auth.types";

export const accountApi = createApi({
  reducerPath: "accountApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/account" }),
  endpoints: (builder) => ({
    updateProfile: builder.mutation<AccountProfile, UpdateProfileInput>({
      query: (body) => ({ url: "", method: "PATCH", body }),
    }),
    changePassword: builder.mutation<void, ChangePasswordInput>({
      query: (body) => ({ url: "/password", method: "PATCH", body }),
    }),
  }),
});

export const { useUpdateProfileMutation, useChangePasswordMutation } = accountApi;
