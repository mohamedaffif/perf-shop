import { beforeEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";
import type { NextRequest } from "next/server";

import { subscribe } from "@/domain/newsletter";
import { enforceRateLimit, RateLimitExceededError } from "@/lib/rate-limit";
import { POST } from "./route";

vi.mock("@/domain/newsletter", () => ({ subscribe: vi.fn() }));
vi.mock("@/lib/rate-limit", async () => {
  const actual = await vi.importActual<typeof import("@/lib/rate-limit")>("@/lib/rate-limit");
  return { ...actual, enforceRateLimit: vi.fn(), getClientIp: vi.fn().mockReturnValue("1.2.3.4") };
});

const mockedSubscribe = vi.mocked(subscribe);
const mockedRateLimit = vi.mocked(enforceRateLimit);

function makeRequest(body: unknown): NextRequest {
  return { json: async () => body, headers: new Headers() } as unknown as NextRequest;
}

describe("POST /api/newsletter", () => {
  beforeEach(() => {
    mockedSubscribe.mockReset();
    mockedRateLimit.mockReset();
  });

  it("accepts a valid email and returns a pending status", async () => {
    mockedSubscribe.mockResolvedValue({ status: "pending" });

    const response = await POST(makeRequest({ email: "reader@example.com" }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ status: "pending" });
    expect(mockedSubscribe).toHaveBeenCalledWith({ email: "reader@example.com" });
  });

  it("returns 429 when rate limited", async () => {
    mockedRateLimit.mockRejectedValue(new RateLimitExceededError(600));

    const response = await POST(makeRequest({ email: "reader@example.com" }));

    expect(response.status).toBe(429);
    expect(mockedSubscribe).not.toHaveBeenCalled();
  });

  it("returns 400 for an invalid email", async () => {
    mockedSubscribe.mockRejectedValue(new ZodError([]));

    const response = await POST(makeRequest({ email: "nope" }));

    expect(response.status).toBe(400);
  });
});
