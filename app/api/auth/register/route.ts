import { NextRequest, NextResponse } from "next/server";
import { registerCustomer } from "@/domain/auth";
import { handleApiError } from "@/lib/api-error";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const user = await registerCustomer(body);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
