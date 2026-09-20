import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { changePassword } from "@/domain/auth";
import { handleApiError } from "@/lib/api-error";
import { enforceRateLimit } from "@/lib/rate-limit";

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await enforceRateLimit({
      key: `change-password:${session.user.id}`,
      limit: 5,
      windowSeconds: 60 * 15,
    });

    const body = await request.json();
    await changePassword(session.user.id, body);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
