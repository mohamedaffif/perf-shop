import { NextRequest, NextResponse } from "next/server";
import { search } from "@/domain/search";
import { handleApiError } from "@/lib/api-error";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const result = await search({
      q: searchParams.get("q"),
      // get() returns null when absent; z.coerce would turn that into 0 and
      // reject it, while undefined lets the schema's default (8) apply.
      limit: searchParams.get("limit") ?? undefined,
    });
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
