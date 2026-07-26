import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";

import { auth } from "@/auth";
import { updateStoreSettings } from "@/domain/settings";
import { PATCH } from "./route";

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("@/domain/settings", () => ({
  getStoreSettings: vi.fn(),
  updateStoreSettings: vi.fn().mockResolvedValue({ id: "settings_1" }),
}));

const mockedAuth = auth as unknown as ReturnType<typeof vi.fn>;
const mockedUpdateStoreSettings = vi.mocked(updateStoreSettings);

function makeRequest(body: unknown): NextRequest {
  return { json: async () => body } as unknown as NextRequest;
}

describe("PATCH /api/admin/settings", () => {
  beforeEach(() => {
    mockedAuth.mockReset();
    mockedUpdateStoreSettings.mockClear();
  });

  it("returns 401 when unauthenticated", async () => {
    mockedAuth.mockResolvedValue(null);

    const response = await PATCH(makeRequest({ storeName: "New Name" }));

    expect(response.status).toBe(401);
    expect(mockedUpdateStoreSettings).not.toHaveBeenCalled();
  });

  it("returns 403 for CUSTOMER", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "u1", role: "CUSTOMER" } } as never);

    const response = await PATCH(makeRequest({ storeName: "New Name" }));

    expect(response.status).toBe(403);
    expect(mockedUpdateStoreSettings).not.toHaveBeenCalled();
  });

  it("returns 403 for STAFF (settings mutation is ADMIN only)", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "u1", role: "STAFF" } } as never);

    const response = await PATCH(makeRequest({ storeName: "New Name" }));

    expect(response.status).toBe(403);
    expect(mockedUpdateStoreSettings).not.toHaveBeenCalled();
  });

  it("allows ADMIN", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "u1", role: "ADMIN" } } as never);

    const response = await PATCH(makeRequest({ storeName: "New Name" }));

    expect(response.status).toBe(200);
    expect(mockedUpdateStoreSettings).toHaveBeenCalledWith({ storeName: "New Name" });
  });
});
