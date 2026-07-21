import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { placeOrder } from "@/domain/order";
import { handleApiError } from "@/lib/api-error";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();
    const order = await placeOrder(body, session?.user?.id ?? null);
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
