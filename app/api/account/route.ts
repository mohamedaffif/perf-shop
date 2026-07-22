import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getProfile, updateProfile } from "@/domain/auth";
import { handleApiError } from "@/lib/api-error";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await getProfile(session.user.id);
    return NextResponse.json(profile);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const profile = await updateProfile(session.user.id, body);
    return NextResponse.json(profile);
  } catch (error) {
    return handleApiError(error);
  }
}
