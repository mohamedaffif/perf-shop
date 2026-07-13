import { NextRequest, NextResponse } from "next/server";
import { deleteBrand, getBrand, updateBrand } from "@/domain/brand";
import { handleApiError } from "@/lib/api-error";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const brand = await getBrand(id);
    return NextResponse.json(brand);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const brand = await updateBrand(id, body);
    return NextResponse.json(brand);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await deleteBrand(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
