import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Order, PlaceOrderInput } from "@/domain/order/order.types";

export interface PlaceOrderResponse {
  order: Order;
  paymentRedirectUrl?: string;
  paymentError?: string;
}

interface RetryPesapalPaymentResponse {
  redirectUrl: string;
}

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    createOrder: builder.mutation<PlaceOrderResponse, PlaceOrderInput>({
      query: (body) => ({ url: "/orders", method: "POST", body }),
    }),
    retryPesapalPayment: builder.mutation<RetryPesapalPaymentResponse, string>({
      query: (orderNumber) => ({
        url: `/orders/${orderNumber}/retry-pesapal-payment`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, orderNumber) => [{ type: "Order", id: orderNumber }],
    }),
  }),
});

export const { useCreateOrderMutation, useRetryPesapalPaymentMutation } = ordersApi;
