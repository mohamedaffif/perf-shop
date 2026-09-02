import { NextRequest, NextResponse } from "next/server";

import { exportSubscribersCsv, listSubscribers } from "@/domain/newsletter";
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

    if (searchParams.get("export") === "csv") {
      const csv = await exportSubscribersCsv();
      return new NextResponse(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="newsletter-subscribers-${
            new Date().toISOString().split("T")[0]
          }.csv"`,
        },
      });
    }

    const subscribers = await listSubscribers({
      search: searchParams.get("search") ?? undefined,
      page: searchParams.get("page") ?? undefined,
      pageSize: searchParams.get("pageSize") ?? undefined,
    });
    return NextResponse.json(subscribers);
  } catch (error) {
    return handleApiError(error);
  }
}
