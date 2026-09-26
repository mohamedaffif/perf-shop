import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Pragmatic CSP: Next.js injects inline bootstrap scripts and styled-jsx/Tailwind
// inline styles, so script/style need 'unsafe-inline'. Everything else is locked to
// self + the hosts we actually use (Cloudinary for images).
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://res.cloudinary.com",
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
]
  .join("; ")
  .concat(isDev ? "" : "; upgrade-insecure-requests");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["monorail-drool-ecology.ngrok-free.dev"],
  outputFileTracingIncludes: {
    "**/*": ["./lib/generated/prisma/**/*"],
  },
  // Cloudinary resizes and re-encodes on its CDN (see lib/cloudinary-loader.ts),
  // so the app container never runs the sharp-based image optimizer.
  images: {
    loader: "custom",
    loaderFile: "./lib/cloudinary-loader.ts",
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
