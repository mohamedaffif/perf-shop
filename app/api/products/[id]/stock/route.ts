import { NextRequest, NextResponse } from "next/server";
import { getProductStock } from "@/domain/product";
import { handleApiError } from "@/lib/api-error";

type RouteParams = { params: Promise<{ id: string }> };

// Live stock for the ISR-cached product page (see useLiveStock). Never cached
// anywhere — not by Next, the browser, or Cloudflare.
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const stockQuantity = await getProductStock(id);
    return NextResponse.json({ stockQuantity }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return handleApiError(error);
  }
}
