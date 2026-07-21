import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ZodError) {
    return NextResponse.json({ error: "Validation failed", issues: error.issues }, { status: 400 });
  }

  if (error instanceof Error && error.name.endsWith("NotFoundError")) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  if (error instanceof Error && error.name.endsWith("AlreadyRegisteredError")) {
    return NextResponse.json({ error: error.message }, { status: 409 });
  }

  if (error instanceof Error && error.name.endsWith("OutOfStockError")) {
    return NextResponse.json({ error: error.message }, { status: 409 });
  }

  throw error;
}
