import { describe, expect, it } from "vitest";

import cloudinaryLoader from "./cloudinary-loader";

const SRC = "https://res.cloudinary.com/demo/image/upload/v1712345678/products/oud-noir.jpg";

describe("cloudinaryLoader", () => {
  it("inserts a width-limited, auto-format transformation after /image/upload/", () => {
    expect(cloudinaryLoader({ src: SRC, width: 640 })).toBe(
      "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_640,c_limit/v1712345678/products/oud-noir.jpg"
    );
  });

  it("uses the requested quality when given", () => {
    expect(cloudinaryLoader({ src: SRC, width: 128, quality: 60 })).toContain(
      "/image/upload/f_auto,q_60,w_128,c_limit/"
    );
  });

  it("leaves non-Cloudinary sources untouched", () => {
    expect(cloudinaryLoader({ src: "/logo.png", width: 64 })).toBe("/logo.png");
    expect(cloudinaryLoader({ src: "https://example.com/a.jpg", width: 64 })).toBe(
      "https://example.com/a.jpg"
    );
  });
});
