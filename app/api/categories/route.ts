import { NextRequest, NextResponse } from "next/server";
import { createCategory, listCategories } from "@/domain/category";
import { handleApiError } from "@/lib/api-error";
import { requireRole } from "@/lib/auth/require-role";
import { STAFF_ROLES } from "@/lib/auth/roles";

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
    const authorization = await requireRole(STAFF_ROLES);
    if (!authorization.authorized) {
      return NextResponse.json({ error: authorization.error }, { status: authorization.status });
    }

    const body = await request.json();
    const category = await createCategory(body);
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
