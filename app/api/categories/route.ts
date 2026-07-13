import { NextRequest, NextResponse } from "next/server";
import { createCategory, listCategories } from "@/domain/category";
import { handleApiError } from "@/lib/api-error";

export async function GET(request: NextRequest) {
  try {
    const filters = Object.fromEntries(request.nextUrl.searchParams);
    const result = await listCategories(filters);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const category = await createCategory(body);
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
