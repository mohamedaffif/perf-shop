import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { validateCouponForOrder } from "@/domain/coupon";
import { handleApiError } from "@/lib/api-error";

const validateCouponSchema = z.object({
  code: z.string().min(1),
  subtotal: z.number().nonnegative(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();
    const { code, subtotal } = validateCouponSchema.parse(body);

    const result = await validateCouponForOrder(code, subtotal, session?.user?.id ?? null);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
