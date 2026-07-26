import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";

import { auth } from "@/auth";
import { deleteProduct, updateProduct } from "@/domain/product";
import { DELETE, PATCH } from "./route";

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("@/domain/product", () => ({
  getProduct: vi.fn(),
  updateProduct: vi.fn().mockResolvedValue({ id: "prod_1" }),
  deleteProduct: vi.fn().mockResolvedValue(undefined),
}));

const mockedAuth = auth as unknown as ReturnType<typeof vi.fn>;
const mockedUpdateProduct = vi.mocked(updateProduct);
const mockedDeleteProduct = vi.mocked(deleteProduct);

function makeRequest(body?: unknown): NextRequest {
  return { json: async () => body } as unknown as NextRequest;
}

function makeParams(id = "prod_1") {
  return { params: Promise.resolve({ id }) };
}

describe("PATCH /api/products/[id]", () => {
  beforeEach(() => {
    mockedAuth.mockReset();
    mockedUpdateProduct.mockClear();
  });

  it("returns 401 when unauthenticated", async () => {
    mockedAuth.mockResolvedValue(null);

    const response = await PATCH(makeRequest({ name: "Updated" }), makeParams());

    expect(response.status).toBe(401);
    expect(mockedUpdateProduct).not.toHaveBeenCalled();
  });

  it("returns 403 for CUSTOMER", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "u1", role: "CUSTOMER" } } as never);

    const response = await PATCH(makeRequest({ name: "Updated" }), makeParams());

    expect(response.status).toBe(403);
    expect(mockedUpdateProduct).not.toHaveBeenCalled();
  });

  it("allows STAFF", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "u1", role: "STAFF" } } as never);

    const response = await PATCH(makeRequest({ name: "Updated" }), makeParams());

    expect(response.status).toBe(200);
    expect(mockedUpdateProduct).toHaveBeenCalledWith("prod_1", { name: "Updated" });
  });

  it("allows ADMIN", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "u1", role: "ADMIN" } } as never);

    const response = await PATCH(makeRequest({ name: "Updated" }), makeParams());

    expect(response.status).toBe(200);
    expect(mockedUpdateProduct).toHaveBeenCalledWith("prod_1", { name: "Updated" });
  });
});

describe("DELETE /api/products/[id]", () => {
  beforeEach(() => {
    mockedAuth.mockReset();
    mockedDeleteProduct.mockClear();
  });

  it("returns 401 when unauthenticated", async () => {
    mockedAuth.mockResolvedValue(null);

    const response = await DELETE(makeRequest(), makeParams());

    expect(response.status).toBe(401);
    expect(mockedDeleteProduct).not.toHaveBeenCalled();
  });

  it("returns 403 for CUSTOMER", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "u1", role: "CUSTOMER" } } as never);

    const response = await DELETE(makeRequest(), makeParams());

    expect(response.status).toBe(403);
    expect(mockedDeleteProduct).not.toHaveBeenCalled();
  });

  it("returns 403 for STAFF (deletion is ADMIN only)", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "u1", role: "STAFF" } } as never);

    const response = await DELETE(makeRequest(), makeParams());

    expect(response.status).toBe(403);
    expect(mockedDeleteProduct).not.toHaveBeenCalled();
  });

  it("allows ADMIN", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "u1", role: "ADMIN" } } as never);

    const response = await DELETE(makeRequest(), makeParams());

    expect(response.status).toBe(204);
    expect(mockedDeleteProduct).toHaveBeenCalledWith("prod_1");
  });
});
