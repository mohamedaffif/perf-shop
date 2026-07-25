import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getStoreSettings, updateStoreSettings } from "@/domain/settings";
import { handleApiError } from "@/lib/api-error";

function isStaff(role: string | undefined): boolean {
  return role === "STAFF" || role === "ADMIN";
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || !isStaff(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const settings = await getStoreSettings();
    return NextResponse.json(settings);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || !isStaff(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const settings = await updateStoreSettings(body);
    return NextResponse.json(settings);
  } catch (error) {
    return handleApiError(error);
  }
}
