import { beforeEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";
import type { NextRequest } from "next/server";

import { submitContactMessage } from "@/domain/contact";
import { enforceRateLimit, RateLimitExceededError } from "@/lib/rate-limit";
import { POST } from "./route";

vi.mock("@/domain/contact", () => ({ submitContactMessage: vi.fn() }));
vi.mock("@/lib/rate-limit", async () => {
  const actual = await vi.importActual<typeof import("@/lib/rate-limit")>("@/lib/rate-limit");
  return { ...actual, enforceRateLimit: vi.fn(), getClientIp: vi.fn().mockReturnValue("1.2.3.4") };
});

const mockedSubmit = vi.mocked(submitContactMessage);
const mockedRateLimit = vi.mocked(enforceRateLimit);

function makeRequest(body: unknown): NextRequest {
  return { json: async () => body, headers: new Headers() } as unknown as NextRequest;
}

const validBody = {
  name: "Amina",
  email: "amina@example.com",
  message: "When does the collection launch?",
};

describe("POST /api/contact", () => {
  beforeEach(() => {
    mockedSubmit.mockReset();
    mockedRateLimit.mockReset();
  });

  it("accepts a valid message", async () => {
    mockedSubmit.mockResolvedValue({ received: true });

    const response = await POST(makeRequest(validBody));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ received: true });
    expect(mockedSubmit).toHaveBeenCalledWith(validBody);
  });

  it("returns 429 when rate limited", async () => {
    mockedRateLimit.mockRejectedValue(new RateLimitExceededError(600));

    const response = await POST(makeRequest(validBody));

    expect(response.status).toBe(429);
    expect(mockedSubmit).not.toHaveBeenCalled();
  });

  it("returns 400 on validation failure", async () => {
    mockedSubmit.mockRejectedValue(new ZodError([]));

    const response = await POST(makeRequest({ name: "", email: "x", message: "hi" }));

    expect(response.status).toBe(400);
  });
});
