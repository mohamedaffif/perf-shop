import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";

import { auth } from "@/auth";
import { createProduct } from "@/domain/product";
import { POST } from "./route";

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("@/domain/product", () => ({
  createProduct: vi.fn().mockResolvedValue({ id: "prod_1" }),
  listProducts: vi.fn(),
}));

const mockedAuth = auth as unknown as ReturnType<typeof vi.fn>;
const mockedCreateProduct = vi.mocked(createProduct);

function makeRequest(body: unknown): NextRequest {
  return { json: async () => body } as unknown as NextRequest;
}

describe("POST /api/products", () => {
  beforeEach(() => {
    mockedAuth.mockReset();
    mockedCreateProduct.mockClear();
  });

  it("returns 401 when unauthenticated", async () => {
    mockedAuth.mockResolvedValue(null);

    const response = await POST(makeRequest({ name: "Test" }));

    expect(response.status).toBe(401);
    expect(mockedCreateProduct).not.toHaveBeenCalled();
  });

  it("returns 403 for CUSTOMER", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "u1", role: "CUSTOMER" } } as never);

    const response = await POST(makeRequest({ name: "Test" }));

    expect(response.status).toBe(403);
    expect(mockedCreateProduct).not.toHaveBeenCalled();
  });

  it("allows STAFF", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "u1", role: "STAFF" } } as never);

    const response = await POST(makeRequest({ name: "Test" }));

    expect(response.status).toBe(201);
    expect(mockedCreateProduct).toHaveBeenCalledWith({ name: "Test" });
  });

  it("allows ADMIN", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "u1", role: "ADMIN" } } as never);

    const response = await POST(makeRequest({ name: "Test" }));

    expect(response.status).toBe(201);
    expect(mockedCreateProduct).toHaveBeenCalledWith({ name: "Test" });
  });
});
