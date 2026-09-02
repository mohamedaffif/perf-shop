import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";

import { confirmSubscription } from "@/domain/newsletter";
import { GET } from "./route";

vi.mock("@/domain/newsletter", () => ({ confirmSubscription: vi.fn() }));

const mockedConfirm = vi.mocked(confirmSubscription);

function makeRequest(url: string): NextRequest {
  return { nextUrl: new URL(url) } as unknown as NextRequest;
}

const BASE = "http://localhost:3000/api/newsletter/confirm";

describe("GET /api/newsletter/confirm", () => {
  beforeEach(() => {
    mockedConfirm.mockReset();
  });

  it("redirects to the confirmed page on a valid token", async () => {
    mockedConfirm.mockResolvedValue({ ok: true });

    const response = await GET(makeRequest(`${BASE}?token=good-token`));

    expect(mockedConfirm).toHaveBeenCalledWith("good-token");
    expect(response.headers.get("location")).toBe("http://localhost:3000/newsletter/confirmed");
  });

  it("redirects with state=invalid when the token is expired or used", async () => {
    mockedConfirm.mockResolvedValue({ ok: false });

    const response = await GET(makeRequest(`${BASE}?token=stale`));

    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/newsletter/confirmed?state=invalid"
    );
  });

  it("redirects with state=invalid and does not call the domain when no token is given", async () => {
    const response = await GET(makeRequest(BASE));

    expect(mockedConfirm).not.toHaveBeenCalled();
    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/newsletter/confirmed?state=invalid"
    );
  });
});
