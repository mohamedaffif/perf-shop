import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createCoupon, listCoupons } from "@/domain/coupon";
import { handleApiError } from "@/lib/api-error";

function isStaff(role: string | undefined): boolean {
  return role === "STAFF" || role === "ADMIN";
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || !isStaff(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
    const session = await auth();
    if (!session?.user || !isStaff(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const coupon = await createCoupon(body);
    return NextResponse.json(coupon, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
