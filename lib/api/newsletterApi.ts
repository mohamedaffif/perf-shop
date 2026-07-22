import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const newsletterApi = createApi({
  reducerPath: "newsletterApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    subscribe: builder.mutation<{ subscribed: boolean }, string>({
      query: (email) => ({ url: "/newsletter", method: "POST", body: { email } }),
    }),
  }),
});

export const { useSubscribeMutation } = newsletterApi;
