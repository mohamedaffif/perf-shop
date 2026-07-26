import { NextRequest, NextResponse } from "next/server";
import { listCustomers, getCustomerStats } from "@/domain/user";
import { handleApiError } from "@/lib/api-error";
import { requireRole } from "@/lib/auth/require-role";

export async function GET(request: NextRequest) {
  try {
    const authorization = await requireRole(["STAFF", "ADMIN"]);
    if (!authorization.authorized) {
      return NextResponse.json({ error: authorization.error }, { status: authorization.status });
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
