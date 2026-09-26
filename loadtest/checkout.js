// Checkout load test: signed-in shoppers placing orders. WRITES REAL DATA —
// creates orders and decrements stock. Read loadtest/README.md before running.
import http from "k6/http";
import { check, fail } from "k6";
import { BASE_URL, getApi, loadProductIds, pick, tlsOptions, viewPage } from "./lib.js";

// LOADTEST_USERS="a@example.com:password1,b@example.com:password2"
const USERS = (__ENV.LOADTEST_USERS || "")
  .split(",")
  .filter(Boolean)
  .map((pair) => {
    const colon = pair.indexOf(":");
    return { email: pair.slice(0, colon), password: pair.slice(colon + 1) };
  });

const ORDERS_PER_MINUTE = Number(__ENV.ORDERS_PER_MINUTE || 20);
const PAYMENT_METHOD = __ENV.PAYMENT_METHOD || "COD";
// /api/orders allows 20 orders per user per 10 minutes.
const MAX_ORDERS_PER_USER_PER_MINUTE = 2;

export const options = {
  ...tlsOptions,
  scenarios: {
    checkout: {
      executor: "constant-arrival-rate",
      rate: ORDERS_PER_MINUTE,
      timeUnit: "1m",
      duration: __ENV.DURATION || "5m",
      // One VU per test account, so each VU keeps its own signed-in session.
      preAllocatedVUs: Math.max(USERS.length, 1),
      maxVUs: Math.max(USERS.length, 1),
    },
  },
  thresholds: {
    checks: ["rate>0.99"],
    "http_req_duration{name:place-order}": ["p(95)<2000"],
    "http_req_duration{name:checkout-page}": ["p(95)<800"],
  },
};

export function setup() {
  const needed = Math.ceil(ORDERS_PER_MINUTE / MAX_ORDERS_PER_USER_PER_MINUTE);
  if (USERS.length < needed) {
    throw new Error(
      `${ORDERS_PER_MINUTE} orders/min needs at least ${needed} test accounts in LOADTEST_USERS ` +
        `(the orders API allows ${MAX_ORDERS_PER_USER_PER_MINUTE}/min per user); got ${USERS.length}.`
    );
  }
  return { productIds: loadProductIds() };
}

// Per-VU state: each VU has its own cookie jar, so it signs in once.
let signedIn = false;

function signIn(user) {
  const csrfToken = http
    .get(`${BASE_URL}/api/auth/csrf`, { tags: { name: "csrf" } })
    .json("csrfToken");

  const res = http.post(
    `${BASE_URL}/api/auth/callback/credentials`,
    { csrfToken, email: user.email, password: user.password, callbackUrl: `${BASE_URL}/` },
    { redirects: 0, tags: { name: "sign-in" } }
  );

  const location = String(res.headers.Location || "");
  if (res.status !== 302 || location.includes("error")) {
    fail(`Sign-in failed for ${user.email} (status ${res.status}, location "${location}")`);
  }
}

export default function checkout({ productIds }) {
  const user = USERS[(__VU - 1) % USERS.length];
  if (!signedIn) {
    signIn(user);
    signedIn = true;
  }

  viewPage("/checkout", "checkout-page");

  const productId = pick(productIds);
  getApi(`/api/products/${productId}/stock`, "stock");

  const res = http.post(
    `${BASE_URL}/api/orders`,
    JSON.stringify({
      email: user.email,
      shippingFullName: "Load Test",
      shippingPhone: "0700000000",
      shippingLine1: "1 Load Test Street",
      shippingCity: "Nairobi",
      shippingState: "Nairobi",
      shippingPostalCode: "00100",
      shippingCountry: "Kenya",
      paymentMethod: PAYMENT_METHOD,
      items: [{ productId, quantity: 1 }],
    }),
    {
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": `loadtest-${__VU}-${__ITER}-${Date.now()}`,
      },
      tags: { name: "place-order" },
    }
  );

  check(res, { "order created (201)": (r) => r.status === 201 });
  if (res.status !== 201) {
    console.warn(`place-order ${res.status} for ${user.email}: ${res.body}`);
  }
}
