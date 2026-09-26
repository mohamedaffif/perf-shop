// Browse load test: anonymous shoppers reading the catalog. Read-only — safe
// to run against production data. See loadtest/README.md.
import { getApi, loadProductIds, pick, tlsOptions, viewPage, weighted } from "./lib.js";

// Page views per second at peak. Each page view is 2–3 HTTP requests, so the
// default 100 ≈ 200–250 req/s — the scaling plan's target.
const PEAK = Number(__ENV.PEAK_RATE || 100);

export const options = {
  ...tlsOptions,
  scenarios: {
    browse: {
      executor: "ramping-arrival-rate",
      startRate: 1,
      timeUnit: "1s",
      preAllocatedVUs: 50,
      maxVUs: Number(__ENV.MAX_VUS || 500),
      stages: [
        { duration: "1m", target: Math.ceil(PEAK / 4) }, // warm up caches
        { duration: "2m", target: PEAK }, // ramp to peak
        { duration: "5m", target: PEAK }, // hold at peak
        { duration: "1m", target: 0 }, // ramp down
      ],
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<500"],
    checks: ["rate>0.99"],
    // Per-page breakdowns, so the summary shows which page is the bottleneck.
    "http_req_duration{name:home}": ["p(95)<500"],
    "http_req_duration{name:shop}": ["p(95)<500"],
    "http_req_duration{name:category}": ["p(95)<500"],
    "http_req_duration{name:product}": ["p(95)<500"],
    "http_req_duration{name:search}": ["p(95)<500"],
    "http_req_duration{name:stock}": ["p(95)<300"],
    "http_req_duration{name:session}": ["p(95)<300"],
  },
};

const CATEGORIES = ["for-her", "for-him", "unisex", "gift-sets"];
const SHOP_FILTERS = [
  "",
  "",
  "?badge=NEW",
  "?badge=BEST_SELLER",
  "?badge=SALE",
  "?scentFamily=WOODY",
  "?scentFamily=FLORAL",
  "?page=2",
];
const SEARCH_TERMS = ["oud", "rose", "noir", "vanilla", "vanila", "citrus", "musk", "amber"];

export function setup() {
  return { productIds: loadProductIds() };
}

export default function browse({ productIds }) {
  const page = weighted([
    [25, "home"],
    [20, "shop"],
    [15, "category"],
    [30, "product"],
    [10, "search"],
  ]);

  switch (page) {
    case "home":
      viewPage("/", "home");
      break;
    case "shop":
      viewPage(`/shop${pick(SHOP_FILTERS)}`, "shop");
      break;
    case "category":
      viewPage(`/shop/${pick(CATEGORIES)}${pick(SHOP_FILTERS)}`, "category");
      break;
    case "product": {
      const id = pick(productIds);
      viewPage(`/product/${id}`, "product");
      getApi(`/api/products/${id}/stock`, "stock");
      break;
    }
    case "search":
      // Exactly what the search dialog calls as the shopper types (lib/api/searchApi.ts).
      getApi(`/api/search?q=${pick(SEARCH_TERMS)}&limit=8`, "search");
      break;
  }
}
