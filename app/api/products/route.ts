import { NextRequest, NextResponse } from "next/server";
import { createProduct, listProducts } from "@/domain/product";
import { handleApiError } from "@/lib/api-error";
import { requireRole } from "@/lib/auth/require-role";

export async function GET(request: NextRequest) {
  try {
    const filters = Object.fromEntries(request.nextUrl.searchParams);
    const result = await listProducts(filters);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authorization = await requireRole(["STAFF", "ADMIN"]);
    if (!authorization.authorized) {
      return NextResponse.json({ error: authorization.error }, { status: authorization.status });
    }

    const body = await request.json();
    const product = await createProduct(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
