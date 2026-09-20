import bcrypt from "bcryptjs";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { User } from "@/lib/generated/prisma/client";
import * as authRepository from "./auth.repository";
import {
  changePassword,
  getProfile,
  updateProfile,
  verifyEmailAfterOAuthLink,
} from "./auth.service";

vi.mock("./auth.repository", () => ({
  findByEmail: vi.fn(),
  createUser: vi.fn(),
  findById: vi.fn(),
  findByIdWithAccounts: vi.fn(),
  markEmailVerified: vi.fn(),
  updateUser: vi.fn(),
  updatePasswordHash: vi.fn(),
}));

const mockedFindById = vi.mocked(authRepository.findById);
const mockedFindByIdWithAccounts = vi.mocked(authRepository.findByIdWithAccounts);
const mockedMarkEmailVerified = vi.mocked(authRepository.markEmailVerified);
const mockedUpdateUser = vi.mocked(authRepository.updateUser);
const mockedUpdatePasswordHash = vi.mocked(authRepository.updatePasswordHash);

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: "user-1",
    name: "Test User",
    email: "test@example.com",
    emailVerified: null,
    image: null,
    phone: null,
    passwordHash: "hash",
    role: "CUSTOMER",
    createdAt: new Date("2026-01-15T00:00:00.000Z"),
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

describe("getProfile", () => {
  it("reports whether a password is set and the linked providers, never the hash", async () => {
    mockedFindByIdWithAccounts.mockResolvedValue({
      ...makeUser({ emailVerified: new Date(), phone: "+254700000000" }),
      accounts: [{ provider: "google" }],
    });

    const profile = await getProfile("user-1");

    expect(profile).toMatchObject({
      id: "user-1",
      phone: "+254700000000",
      emailVerified: true,
      hasPassword: true,
      providers: ["google"],
      createdAt: "2026-01-15T00:00:00.000Z",
    });
    expect(profile).not.toHaveProperty("passwordHash");
  });

  it("reports hasPassword false for an account without a password", async () => {
    mockedFindByIdWithAccounts.mockResolvedValue({
      ...makeUser({ passwordHash: null }),
      accounts: [],
    });

    expect((await getProfile("user-1")).hasPassword).toBe(false);
  });

  it("throws when the user does not exist", async () => {
    mockedFindByIdWithAccounts.mockResolvedValue(null);

    await expect(getProfile("user-1")).rejects.toThrow("not found");
  });
});

describe("updateProfile", () => {
  beforeEach(() => {
    mockedUpdateUser.mockResolvedValue(makeUser());
    mockedFindByIdWithAccounts.mockResolvedValue({ ...makeUser(), accounts: [] });
  });

  it("saves the name and phone", async () => {
    await updateProfile("user-1", { name: "New Name", phone: "+254700000000" });

    expect(mockedUpdateUser).toHaveBeenCalledWith("user-1", {
      name: "New Name",
      phone: "+254700000000",
    });
  });

  it("clears the phone when given an empty string", async () => {
    await updateProfile("user-1", { name: "New Name", phone: "" });

    expect(mockedUpdateUser).toHaveBeenCalledWith("user-1", { name: "New Name", phone: null });
  });

  it("rejects a phone number that is too short", async () => {
    await expect(updateProfile("user-1", { name: "New Name", phone: "123" })).rejects.toThrow();

    expect(mockedUpdateUser).not.toHaveBeenCalled();
  });
});

describe("changePassword", () => {
  const passwordHash = bcrypt.hashSync("old-password", 4);

  it("stores a new hash when the current password is correct", async () => {
    mockedFindById.mockResolvedValue(makeUser({ passwordHash }));

    await changePassword("user-1", {
      currentPassword: "old-password",
      newPassword: "new-password-1",
    });

    const [userId, newHash] = mockedUpdatePasswordHash.mock.calls[0];
    expect(userId).toBe("user-1");
    expect(await bcrypt.compare("new-password-1", newHash)).toBe(true);
  });

  it("rejects a wrong current password without saving", async () => {
    mockedFindById.mockResolvedValue(makeUser({ passwordHash }));

    await expect(
      changePassword("user-1", { currentPassword: "wrong-password", newPassword: "new-password-1" })
    ).rejects.toMatchObject({ name: "InvalidPasswordError" });

    expect(mockedUpdatePasswordHash).not.toHaveBeenCalled();
  });

  it("rejects accounts that have no password", async () => {
    mockedFindById.mockResolvedValue(makeUser({ passwordHash: null }));

    await expect(
      changePassword("user-1", { currentPassword: "old-password", newPassword: "new-password-1" })
    ).rejects.toMatchObject({ name: "PasswordNotSetError" });

    expect(mockedUpdatePasswordHash).not.toHaveBeenCalled();
  });

  it("rejects a new password that matches the current one", async () => {
    await expect(
      changePassword("user-1", { currentPassword: "old-password", newPassword: "old-password" })
    ).rejects.toThrow();

    expect(mockedUpdatePasswordHash).not.toHaveBeenCalled();
  });
});
