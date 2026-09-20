import { describe, expect, it } from "vitest";

import { isOAuthSignInAllowed } from "./oauth";

describe("isOAuthSignInAllowed", () => {
  it("allows Google when the email is verified", () => {
    expect(isOAuthSignInAllowed("google", { email_verified: true })).toBe(true);
  });

  it("rejects Google when the email is unverified or the flag is missing", () => {
    expect(isOAuthSignInAllowed("google", { email_verified: false })).toBe(false);
    expect(isOAuthSignInAllowed("google", {})).toBe(false);
    expect(isOAuthSignInAllowed("google", undefined)).toBe(false);
  });

  it("does not gate other providers", () => {
    expect(isOAuthSignInAllowed("credentials", undefined)).toBe(true);
    expect(isOAuthSignInAllowed("github", {})).toBe(true);
  });
});
