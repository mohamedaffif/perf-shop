import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface ContactMessagePayload {
  name: string;
  email: string;
  message: string;
}

export const contactApi = createApi({
  reducerPath: "contactApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    sendContactMessage: builder.mutation<{ received: boolean }, ContactMessagePayload>({
      query: (body) => ({ url: "/contact", method: "POST", body }),
    }),
  }),
});

export const { useSendContactMessageMutation } = contactApi;
