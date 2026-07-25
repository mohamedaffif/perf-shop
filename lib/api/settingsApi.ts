import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { StoreSettings, UpdateStoreSettingsInput } from "@/domain/settings/settings.types";

export const settingsApi = createApi({
  reducerPath: "settingsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/admin" }),
  tagTypes: ["Settings"],
  endpoints: (builder) => ({
    getSettings: builder.query<StoreSettings, void>({
      query: () => "/settings",
      providesTags: ["Settings"],
    }),
    updateSettings: builder.mutation<StoreSettings, UpdateStoreSettingsInput>({
      query: (body) => ({ url: "/settings", method: "PATCH", body }),
      invalidatesTags: ["Settings"],
    }),
  }),
});

export const { useGetSettingsQuery, useUpdateSettingsMutation } = settingsApi;
