import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/redis", () => ({ redis: {}, withRedisFallback: vi.fn() }));

import { getClientIp } from "./rate-limit";

function requestWith(headers: Record<string, string>): Request {
  return new Request("https://example.com", { headers });
}

describe("getClientIp", () => {
  it("uses the X-Real-IP header set by Caddy", () => {
    expect(getClientIp(requestWith({ "x-real-ip": "203.0.113.7" }))).toBe("203.0.113.7");
  });

  it("ignores a client-controlled X-Forwarded-For", () => {
    const request = requestWith({
      "x-forwarded-for": "6.6.6.6, 173.245.48.1",
      "x-real-ip": "203.0.113.7",
    });
    expect(getClientIp(request)).toBe("203.0.113.7");
    expect(getClientIp(requestWith({ "x-forwarded-for": "6.6.6.6" }))).toBe("unknown");
  });

  it("falls back to 'unknown' without Caddy in front (e.g. pnpm dev)", () => {
    expect(getClientIp(requestWith({}))).toBe("unknown");
  });
});
