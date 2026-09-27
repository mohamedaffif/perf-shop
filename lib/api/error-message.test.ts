import { describe, expect, it } from "vitest";

import { getApiErrorIssues, getApiErrorMessage } from "./error-message";

describe("getApiErrorMessage", () => {
  it("returns the API's error message", () => {
    expect(getApiErrorMessage({ data: { error: "Out of stock" } }, "fallback")).toBe(
      "Out of stock"
    );
  });

  it("appends the fields that failed validation", () => {
    const rejection = {
      data: {
        error: "Validation failed",
        issues: [
          { path: ["price"], message: "Too small: expected number to be >0" },
          { path: ["brandId"], message: "Too small: expected string to have >=1 characters" },
        ],
      },
    };

    expect(getApiErrorMessage(rejection, "fallback")).toBe(
      "Validation failed: price — Too small: expected number to be >0; " +
        "brandId — Too small: expected string to have >=1 characters"
    );
  });

  it("falls back when the rejection has no API error body", () => {
    expect(getApiErrorMessage(new Error("network"), "fallback")).toBe("fallback");
    expect(getApiErrorMessage({ data: "Bad Gateway" }, "fallback")).toBe("fallback");
  });
});

describe("getApiErrorIssues", () => {
  it("returns each failed field with a dotted path", () => {
    const rejection = {
      data: {
        error: "Validation failed",
        issues: [
          { path: ["images", 0, "url"], message: "Invalid URL" },
          { path: ["price"], message: "Too small" },
        ],
      },
    };

    expect(getApiErrorIssues(rejection)).toEqual([
      { path: "images.0.url", message: "Invalid URL" },
      { path: "price", message: "Too small" },
    ]);
  });

  it("is empty for errors that aren't validation failures", () => {
    expect(getApiErrorIssues({ data: { error: "Out of stock" } })).toEqual([]);
    expect(getApiErrorIssues(new Error("network"))).toEqual([]);
  });
});
