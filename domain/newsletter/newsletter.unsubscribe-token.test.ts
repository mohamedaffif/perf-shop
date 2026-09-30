import { describe, expect, it } from "vitest";

import { createUnsubscribeToken, verifyUnsubscribeToken } from "./newsletter.unsubscribe-token";

describe("unsubscribe tokens", () => {
  it("round-trips a subscriber id", () => {
    const token = createUnsubscribeToken("sub_123");

    expect(token.startsWith("sub_123.")).toBe(true);
    expect(verifyUnsubscribeToken(token)).toBe("sub_123");
  });

  it("rejects a tampered signature", () => {
    const token = createUnsubscribeToken("sub_123");
    const tampered = token.slice(0, -1) + (token.endsWith("A") ? "B" : "A");

    expect(verifyUnsubscribeToken(tampered)).toBeNull();
  });

  it("rejects another subscriber's signature on a swapped id", () => {
    const signature = createUnsubscribeToken("sub_123").split(".")[1];

    expect(verifyUnsubscribeToken(`sub_456.${signature}`)).toBeNull();
  });

  it.each(["", "garbage", ".", "sub_123.", ".abc"])("rejects malformed token %j", (token) => {
    expect(verifyUnsubscribeToken(token)).toBeNull();
  });
});
