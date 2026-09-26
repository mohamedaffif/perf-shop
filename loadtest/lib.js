// Shared helpers for the k6 load tests (see loadtest/README.md). These run in
// k6's JavaScript runtime, not Node — no npm imports.
import http from "k6/http";
import { check } from "k6";

export const BASE_URL = (__ENV.BASE_URL || "https://localhost").replace(/\/$/, "");

// Local Docker serves Caddy's self-signed certificate; allow it only when asked.
export const tlsOptions = { insecureSkipTLSVerify: __ENV.INSECURE_TLS === "1" };

export function pick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

/** Picks a value from [[weight, value], ...] pairs, proportionally to weight. */
export function weighted(entries) {
  const total = entries.reduce((sum, [weight]) => sum + weight, 0);
  let roll = Math.random() * total;
  for (const [weight, value] of entries) {
    roll -= weight;
    if (roll < 0) return value;
  }
  return entries[entries.length - 1][1];
}

/** Product ids to exercise: PRODUCT_IDS (comma-separated) or every published product. */
export function loadProductIds() {
  if (__ENV.PRODUCT_IDS) return __ENV.PRODUCT_IDS.split(",").filter(Boolean);

  const res = http.get(`${BASE_URL}/api/products?status=PUBLISHED&pageSize=50`, {
    tags: { name: "setup" },
  });
  if (res.status !== 200) {
    throw new Error(`GET /api/products returned ${res.status} — is BASE_URL right?`);
  }
  const ids = res.json("items").map((product) => product.id);
  if (ids.length === 0) throw new Error("No published products — seed the catalog first.");
  return ids;
}

/**
 * A JSON API call the browser makes (search, live stock). Failures are logged
 * with their status so the summary's failed-request count is explainable.
 */
export function getApi(path, name) {
  const res = http.get(`${BASE_URL}${path}`, { tags: { name } });
  const ok = check(res, { [`${name}: 200`]: (r) => r.status === 200 });
  if (!ok) console.warn(`${name} ${res.status} for ${path}: ${String(res.body).slice(0, 200)}`);
  return res;
}

/**
 * One page view the way a browser makes it: the HTML, plus the session check
 * SessionProvider runs on every page load. Redirects are not followed, so a
 * teaser-mode redirect (NEXT_PUBLIC_SHOP_LIVE=false) shows up as a failed check.
 */
export function viewPage(path, name) {
  const res = http.get(`${BASE_URL}${path}`, { tags: { name }, redirects: 0 });
  check(res, { [`${name}: 200`]: (r) => r.status === 200 });
  http.get(`${BASE_URL}/api/auth/session`, { tags: { name: "session" } });
  return res;
}
