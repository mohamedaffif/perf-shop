import { NextRequest, NextResponse } from "next/server";
import { deleteProduct, getProduct, updateProduct } from "@/domain/product";
import { handleApiError } from "@/lib/api-error";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const product = await getProduct(id);
    return NextResponse.json(product);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const product = await updateProduct(id, body);
    return NextResponse.json(product);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await deleteProduct(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
