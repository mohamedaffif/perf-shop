import { z } from "zod";

export const orderLineItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive().max(20),
});

export const placeOrderSchema = z.object({
  email: z.email("A valid email is required"),
  phone: z.string().optional(),
  shippingFullName: z.string().min(1, "Full name is required"),
  shippingPhone: z.string().min(7, "A valid phone number is required"),
  shippingLine1: z.string().min(1, "Address is required"),
  shippingLine2: z.string().optional(),
  shippingCity: z.string().min(1, "City is required"),
  shippingState: z.string().min(1, "State/Region is required"),
  shippingPostalCode: z.string().min(1, "Postal code is required"),
  shippingCountry: z.string().min(1, "Country is required"),
  items: z.array(orderLineItemSchema).min(1, "Your cart is empty"),
});
