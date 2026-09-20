import { beforeEach, describe, expect, it, vi } from "vitest";

import type { User } from "@/lib/generated/prisma/client";
import * as authRepository from "./auth.repository";
import { verifyEmailAfterOAuthLink } from "./auth.service";

vi.mock("./auth.repository", () => ({
  findByEmail: vi.fn(),
  createUser: vi.fn(),
  findById: vi.fn(),
  markEmailVerified: vi.fn(),
  updateUser: vi.fn(),
}));

const mockedFindById = vi.mocked(authRepository.findById);
const mockedMarkEmailVerified = vi.mocked(authRepository.markEmailVerified);

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: "user-1",
    name: "Test User",
    email: "test@example.com",
    emailVerified: null,
    image: null,
    passwordHash: "hash",
    role: "CUSTOMER",
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("verifyEmailAfterOAuthLink", () => {
  it("verifies the email and clears the password of an unverified customer", async () => {
    mockedFindById.mockResolvedValue(makeUser());

    await verifyEmailAfterOAuthLink("user-1");

    expect(mockedMarkEmailVerified).toHaveBeenCalledWith("user-1", { clearPassword: true });
  });

  it("does nothing for an already-verified account", async () => {
    mockedFindById.mockResolvedValue(makeUser({ emailVerified: new Date() }));

    await verifyEmailAfterOAuthLink("user-1");

    expect(mockedMarkEmailVerified).not.toHaveBeenCalled();
  });

  it("verifies but keeps the password of a staff account", async () => {
    mockedFindById.mockResolvedValue(makeUser({ role: "ADMIN" }));

    await verifyEmailAfterOAuthLink("user-1");

    expect(mockedMarkEmailVerified).toHaveBeenCalledWith("user-1", { clearPassword: false });
  });

  it("does nothing when the user no longer exists", async () => {
    mockedFindById.mockResolvedValue(null);

    await verifyEmailAfterOAuthLink("user-1");

    expect(mockedMarkEmailVerified).not.toHaveBeenCalled();
  });
});
