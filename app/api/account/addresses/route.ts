import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createAddress, listAddresses } from "@/domain/address";
import { handleApiError } from "@/lib/api-error";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const addresses = await listAddresses(session.user.id);
    return NextResponse.json(addresses);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const address = await createAddress(session.user.id, body);
    return NextResponse.json(address, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
