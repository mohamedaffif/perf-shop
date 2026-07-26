import { NextRequest, NextResponse } from "next/server";
import { deleteCoupon, getCoupon, updateCoupon } from "@/domain/coupon";
import { handleApiError } from "@/lib/api-error";
import { requireRole } from "@/lib/auth/require-role";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const authorization = await requireRole(["STAFF", "ADMIN"]);
    if (!authorization.authorized) {
      return NextResponse.json({ error: authorization.error }, { status: authorization.status });
    }

    const { id } = await params;
    const coupon = await getCoupon(id);
    return NextResponse.json(coupon);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const authorization = await requireRole(["STAFF", "ADMIN"]);
    if (!authorization.authorized) {
      return NextResponse.json({ error: authorization.error }, { status: authorization.status });
    }

    const { id } = await params;
    const body = await request.json();
    const coupon = await updateCoupon(id, body);
    return NextResponse.json(coupon);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const authorization = await requireRole(["STAFF", "ADMIN"]);
    if (!authorization.authorized) {
      return NextResponse.json({ error: authorization.error }, { status: authorization.status });
    }

    const { id } = await params;
    await deleteCoupon(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
