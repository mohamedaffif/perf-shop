import { describe, expect, it } from "vitest";

import { changePasswordSchema, updateProfileSchema } from "./auth.validator";

describe("changePasswordSchema", () => {
  it("accepts a new password of 8+ characters that differs from the current one", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "old-password",
      newPassword: "new-password",
    });

    expect(result.success).toBe(true);
  });

  it("rejects a new password shorter than 8 characters", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "old-password",
      newPassword: "short",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a new password equal to the current one", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "same-password",
      newPassword: "same-password",
    });

    expect(result.success).toBe(false);
  });
});

describe("updateProfileSchema", () => {
  it("turns an empty phone into null", () => {
    expect(updateProfileSchema.parse({ name: "Ann", phone: "" }).phone).toBeNull();
  });

  it("leaves phone undefined when omitted", () => {
    expect(updateProfileSchema.parse({ name: "Ann" }).phone).toBeUndefined();
  });

  it("rejects a phone number shorter than 7 characters", () => {
    expect(updateProfileSchema.safeParse({ name: "Ann", phone: "12345" }).success).toBe(false);
  });
});
