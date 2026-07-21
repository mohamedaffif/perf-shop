import { NextRequest, NextResponse } from "next/server";
import { search } from "@/domain/search";
import { handleApiError } from "@/lib/api-error";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const result = await search({
      q: searchParams.get("q"),
      limit: searchParams.get("limit"),
    });
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
