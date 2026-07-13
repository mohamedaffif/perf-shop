import { NextRequest, NextResponse } from "next/server";
import { createBrand, listBrands } from "@/domain/brand";
import { handleApiError } from "@/lib/api-error";

export async function GET(request: NextRequest) {
  try {
    const filters = Object.fromEntries(request.nextUrl.searchParams);
    const result = await listBrands(filters);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const brand = await createBrand(body);
    return NextResponse.json(brand, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
