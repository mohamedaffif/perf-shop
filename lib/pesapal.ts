import { getEnv } from "@/lib/env";
import { redis, withRedisFallback } from "@/lib/redis";
import type { PaymentStatus } from "@/domain/order/order.types";

const TOKEN_CACHE_KEY = "de-perfume-shop:pesapal:token";
// Pesapal tokens are valid for 5 minutes; cache well under that so we never
// hand out a token that expires mid-request.
const TOKEN_CACHE_TTL_SECONDS = 240;

// In-process cache in front of Redis: fastest lookup, and — since it holds
// the token independently of Redis — keeps payments working through a brief
// Redis outage instead of falling all the way back to Pesapal's auth API (or
// failing) on every request. Module-level, so it lives for the process
// lifetime, same as the ioredis client in lib/redis.ts.
let memoryToken: { value: string; expiresAt: number } | null = null;

function getMemoryToken(): string | null {
  if (memoryToken && memoryToken.expiresAt > Date.now()) {
    return memoryToken.value;
  }
  memoryToken = null;
  return null;
}

function setMemoryToken(token: string): void {
  memoryToken = { value: token, expiresAt: Date.now() + TOKEN_CACHE_TTL_SECONDS * 1000 };
}

export class PesapalAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PesapalAuthError";
  }
}

export class PesapalApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PesapalApiError";
  }
}

interface PesapalErrorPayload {
  error_type?: string | null;
  code?: string | null;
  message?: string | null;
}

// Pesapal always includes an `error` key in some responses (notably
// GetTransactionStatus), even on success — it's an object with every field
// null rather than being omitted or null itself. So presence of the key
// isn't a failure signal; only a populated code/message/error_type is.
function hasPesapalError(error: unknown): boolean {
  if (error === null || error === undefined) return false;
  if (typeof error === "object") {
    const payload = error as PesapalErrorPayload;
    return Boolean(payload.code || payload.message || payload.error_type);
  }
  return Boolean(error);
}

async function pesapalFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const { PESAPAL_BASE_URL } = getEnv();
  const response = await fetch(`${PESAPAL_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const body = (await response.json().catch(() => null)) as
    (Record<string, unknown> & { error?: PesapalErrorPayload | null }) | null;

  if (!response.ok || hasPesapalError(body?.error)) {
    const message =
      (typeof body?.error === "object" ? body.error?.message : null) ??
      `Pesapal request to ${path} failed (${response.status})`;
    throw new PesapalApiError(message);
  }

  return body as T;
}

interface RequestTokenResponse {
  token: string;
  expiryDate: string;
}

async function fetchAccessToken(): Promise<string> {
  const { PESAPAL_CONSUMER_KEY, PESAPAL_CONSUMER_SECRET } = getEnv();

  const data = await pesapalFetch<RequestTokenResponse>("/api/Auth/RequestToken", {
    method: "POST",
    body: JSON.stringify({
      consumer_key: PESAPAL_CONSUMER_KEY,
      consumer_secret: PESAPAL_CONSUMER_SECRET,
    }),
  }).catch((err) => {
    throw new PesapalAuthError(
      err instanceof Error ? err.message : "Failed to authenticate with Pesapal"
    );
  });

  if (!data.token) {
    throw new PesapalAuthError("Pesapal did not return an access token");
  }

  return data.token;
}

/** Fetches a Pesapal OAuth token: in-memory cache -> Redis -> Pesapal auth API. */
export async function getAccessToken(): Promise<string> {
  const inMemory = getMemoryToken();
  if (inMemory) return inMemory;

  const cached = await withRedisFallback(
    () => redis.get(TOKEN_CACHE_KEY),
    () => null
  );

  if (cached) {
    setMemoryToken(cached);
    return cached;
  }

  const token = await fetchAccessToken();
  setMemoryToken(token);

  await withRedisFallback(
    () => redis.set(TOKEN_CACHE_KEY, token, "EX", TOKEN_CACHE_TTL_SECONDS),
    () => "OK" as const
  );

  return token;
}

async function invalidateAccessToken(): Promise<void> {
  memoryToken = null;
  await withRedisFallback(
    () => redis.del(TOKEN_CACHE_KEY),
    () => 0
  );
}

/** Retries once with a freshly-fetched token if a call fails on an expired/invalid cached token. */
async function withTokenRetry<T>(fn: (token: string) => Promise<T>): Promise<T> {
  const token = await getAccessToken();

  try {
    return await fn(token);
  } catch (err) {
    if (err instanceof PesapalApiError && /token|unauthorized/i.test(err.message)) {
      await invalidateAccessToken();
      return fn(await getAccessToken());
    }
    throw err;
  }
}

interface RegisterIpnResponse {
  ipn_id: string;
}

/** One-time setup call: registers the merchant's IPN URL with Pesapal and returns its ipn_id. */
export async function registerIpn(
  url: string,
  notificationType: "GET" | "POST" = "GET"
): Promise<string> {
  const data = await withTokenRetry((token) =>
    pesapalFetch<RegisterIpnResponse>("/api/URLSetup/RegisterIPN", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ url, ipn_notification_type: notificationType }),
    })
  );

  return data.ipn_id;
}

export interface SubmitOrderParams {
  /**
   * Pesapal requires this to be unique "for every order request" — on a
   * payment retry this must NOT be the same value used in a prior attempt
   * for the same order. Callers are responsible for generating a fresh one
   * per attempt (see domain/payment).
   */
  merchantReference: string;
  amount: number;
  currency: string;
  description: string;
  callbackUrl: string;
  billingAddress: {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    countryCode: string;
  };
}

export interface SubmitOrderResult {
  orderTrackingId: string;
  redirectUrl: string;
  /**
   * Parsed Pesapal response for support/debugging — deliberately excludes
   * redirect_url. That URL is single-use/short-lived and must be regenerated
   * via a fresh SubmitOrderRequest on every retry, never read back out of
   * storage, so it isn't persisted at all (only orderTrackingId is kept, via
   * paymentReference).
   */
  raw: unknown;
}

/** Submits an order to Pesapal and returns the tracking id + hosted payment page URL. */
export async function submitOrder(params: SubmitOrderParams): Promise<SubmitOrderResult> {
  const { PESAPAL_IPN_ID } = getEnv();

  if (!PESAPAL_IPN_ID) {
    throw new PesapalApiError(
      "PESAPAL_IPN_ID is not configured — run the one-time IPN registration step first"
    );
  }

  return withTokenRetry(async (token) => {
    const data = await pesapalFetch<{
      order_tracking_id: string;
      redirect_url: string;
    }>("/api/Transactions/SubmitOrderRequest", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        id: params.merchantReference,
        currency: params.currency,
        amount: params.amount,
        description: params.description,
        callback_url: params.callbackUrl,
        notification_id: PESAPAL_IPN_ID,
        billing_address: {
          email_address: params.billingAddress.email,
          phone_number: params.billingAddress.phone,
          first_name: params.billingAddress.firstName,
          last_name: params.billingAddress.lastName,
          line_1: params.billingAddress.line1,
          line_2: params.billingAddress.line2,
          city: params.billingAddress.city,
          state: params.billingAddress.state,
          postal_code: params.billingAddress.postalCode,
          country_code: params.billingAddress.countryCode,
        },
      }),
    });

    const { redirect_url, ...auditableData } = data;

    return {
      orderTrackingId: data.order_tracking_id,
      redirectUrl: redirect_url,
      raw: auditableData,
    };
  });
}

// Record<number, T> has no finite key set, so `satisfies` (which would keep
// the literal {0:...,1:...} key type) breaks indexing by a runtime number —
// the plain annotation is the correct tool here, not satisfies.
const STATUS_CODE_MAP: Record<number, PaymentStatus> = {
  0: "FAILED", // INVALID
  1: "PAID", // COMPLETED
  2: "FAILED", // FAILED
  3: "REFUNDED", // REVERSED
};

export interface TransactionStatusResult {
  status: PaymentStatus;
  paymentMethod: string | null;
  confirmationCode: string | null;
  /** Pesapal's human-readable message/description — used as failureReason when not PAID. */
  message: string | null;
  /** Full parsed Pesapal response — stored on the order for support/debugging. */
  raw: unknown;
}

/** Queries Pesapal for the authoritative status of a transaction — the source of truth for payment confirmation. */
export async function getTransactionStatus(
  orderTrackingId: string
): Promise<TransactionStatusResult> {
  const data = await withTokenRetry((token) =>
    pesapalFetch<{
      payment_method: string | null;
      confirmation_code: string | null;
      status_code: number;
      message: string | null;
      description: string | null;
    }>(
      `/api/Transactions/GetTransactionStatus?orderTrackingId=${encodeURIComponent(orderTrackingId)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
  );

  return {
    status: STATUS_CODE_MAP[data.status_code] ?? "FAILED",
    paymentMethod: data.payment_method,
    confirmationCode: data.confirmation_code,
    message: data.message ?? data.description ?? null,
    raw: data,
  };
}
