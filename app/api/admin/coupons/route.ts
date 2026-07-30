import { NextRequest, NextResponse } from "next/server";
import { createCoupon, listCoupons } from "@/domain/coupon";
import { handleApiError } from "@/lib/api-error";
import { requireRole } from "@/lib/auth/require-role";
import { STAFF_ROLES } from "@/lib/auth/roles";

export async function GET(request: NextRequest) {
  try {
    const authorization = await requireRole(STAFF_ROLES);
    if (!authorization.authorized) {
      return NextResponse.json({ error: authorization.error }, { status: authorization.status });
    }

    const { searchParams } = request.nextUrl;
    const coupons = await listCoupons({
      page: searchParams.get("page") ?? undefined,
      pageSize: searchParams.get("pageSize") ?? undefined,
    });
    return NextResponse.json(coupons);
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
    const coupon = await createCoupon(body);
    return NextResponse.json(coupon, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
