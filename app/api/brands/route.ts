import { NextRequest, NextResponse } from "next/server";
import { createBrand, listBrands } from "@/domain/brand";
import { handleApiError } from "@/lib/api-error";
import { requireRole } from "@/lib/auth/require-role";

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
    const authorization = await requireRole(["STAFF", "ADMIN"]);
    if (!authorization.authorized) {
      return NextResponse.json({ error: authorization.error }, { status: authorization.status });
    }

    const body = await request.json();
    const brand = await createBrand(body);
    return NextResponse.json(brand, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
