import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { updateOrderStatus } from "@/domain/order";
import { handleApiError } from "@/lib/api-error";

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const role = session?.user?.role;

    if (!session?.user || (role !== "STAFF" && role !== "ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const order = await updateOrderStatus(id, body);
    return NextResponse.json(order);
  } catch (error) {
    return handleApiError(error);
  }
}
