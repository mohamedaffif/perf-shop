import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { pingRabbitMq } from "@/lib/rabbitmq";
import { redis } from "@/lib/redis";

export const dynamic = "force-dynamic";

type CheckStatus = "ok" | "error";

async function check(probe: () => Promise<unknown>): Promise<CheckStatus> {
  try {
    await probe();
    return "ok";
  } catch {
    return "error";
  }
}

/**
 * Dependency status for monitoring and diagnostics. Never use this for
 * load-balancer or container health decisions — that's /api/health.
 */
export async function GET() {
  const [database, redisStatus, rabbitmq] = await Promise.all([
    check(() => prisma.$queryRaw`SELECT 1`),
    check(() => redis.ping()),
    check(pingRabbitMq),
  ]);

  const checks = { database, redis: redisStatus, rabbitmq };
  const healthy = Object.values(checks).every((status) => status === "ok");

  return NextResponse.json(
    { status: healthy ? "ok" : "degraded", checks },
    { status: healthy ? 200 : 503 }
  );
}
