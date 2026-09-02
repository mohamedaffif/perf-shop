import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type SubscribeResponse = { status: "pending" | "already_subscribed" };

export const newsletterApi = createApi({
  reducerPath: "newsletterApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    subscribe: builder.mutation<SubscribeResponse, string>({
      query: (email) => ({ url: "/newsletter", method: "POST", body: { email } }),
    }),
  }),
});

export const { useSubscribeMutation } = newsletterApi;
