import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Liveness only: "can this instance serve HTTP?". Docker, Caddy's load
 * balancer and the uptime monitor use it, so it must not call Postgres, Redis
 * or RabbitMQ — a dependency blip would otherwise pull every healthy replica
 * out of rotation at once. Dependency status lives at /api/health/dependencies.
 */
export function GET() {
  return NextResponse.json({ status: "ok" });
}
