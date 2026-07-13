import { NextRequest, NextResponse } from "next/server";
import { createProduct, listProducts } from "@/domain/product";
import { handleApiError } from "@/lib/api-error";

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
    const body = await request.json();
    const product = await createProduct(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
