import { NextRequest, NextResponse } from "next/server";
import { getStoreSettings, updateStoreSettings } from "@/domain/settings";
import { handleApiError } from "@/lib/api-error";
import { requireRole } from "@/lib/auth/require-role";
import { ADMIN_ROLES, STAFF_ROLES } from "@/lib/auth/roles";

export async function GET() {
  try {
    const authorization = await requireRole(STAFF_ROLES);
    if (!authorization.authorized) {
      return NextResponse.json({ error: authorization.error }, { status: authorization.status });
    }

    const settings = await getStoreSettings();
    return NextResponse.json(settings);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authorization = await requireRole(ADMIN_ROLES);
    if (!authorization.authorized) {
      return NextResponse.json({ error: authorization.error }, { status: authorization.status });
    }

    const body = await request.json();
    const settings = await updateStoreSettings(body);
    return NextResponse.json(settings);
  } catch (error) {
    return handleApiError(error);
  }
}
