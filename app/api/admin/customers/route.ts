import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { listCustomers, getCustomerStats } from "@/domain/user";
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

    if (searchParams.get("stats") === "true") {
      const stats = await getCustomerStats();
      return NextResponse.json(stats);
    }

    const customers = await listCustomers({
      search: searchParams.get("search") ?? undefined,
      page: searchParams.get("page") ?? undefined,
      pageSize: searchParams.get("pageSize") ?? undefined,
    });
    return NextResponse.json(customers);
  } catch (error) {
    return handleApiError(error);
  }
}
