import { NextRequest, NextResponse } from "next/server";
import { updateOrderStatus } from "@/domain/order";
import { handleApiError } from "@/lib/api-error";
import { requireRole } from "@/lib/auth/require-role";
import { STAFF_ROLES } from "@/lib/auth/roles";

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const authorization = await requireRole(STAFF_ROLES);
    if (!authorization.authorized) {
      return NextResponse.json({ error: authorization.error }, { status: authorization.status });
    }

    const { id } = await params;
    const body = await request.json();
    const order = await updateOrderStatus(id, body);
    return NextResponse.json(order);
  } catch (error) {
    return handleApiError(error);
  }
}
