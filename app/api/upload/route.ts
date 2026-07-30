import { NextRequest, NextResponse } from "next/server";
import { InvalidImageError, uploadProductImage } from "@/domain/media";
import { requireRole } from "@/lib/auth/require-role";
import { STAFF_ROLES } from "@/lib/auth/roles";

export async function POST(request: NextRequest) {
  const authorization = await requireRole(STAFF_ROLES);
  if (!authorization.authorized) {
    return NextResponse.json({ error: authorization.error }, { status: authorization.status });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }

  try {
    const image = await uploadProductImage(file);
    return NextResponse.json(image);
  } catch (error) {
    if (error instanceof InvalidImageError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    throw error;
  }
}
