import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { RateLimitExceededError } from "@/lib/rate-limit";
import { DuplicateRequestError, IdempotencyUnavailableError } from "@/lib/idempotency";

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ZodError) {
    return NextResponse.json({ error: "Validation failed", issues: error.issues }, { status: 400 });
  }

  if (error instanceof RateLimitExceededError) {
    return NextResponse.json(
      { error: error.message },
      { status: 429, headers: { "Retry-After": String(error.retryAfterSeconds) } }
    );
  }

  if (error instanceof DuplicateRequestError) {
    return NextResponse.json({ error: error.message }, { status: 409 });
  }

  if (error instanceof IdempotencyUnavailableError) {
    return NextResponse.json({ error: error.message }, { status: 503 });
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

  if (error instanceof Error && error.name.endsWith("ForbiddenError")) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }

  if (error instanceof Error && error.name === "InvalidCouponError") {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  throw error;
}
