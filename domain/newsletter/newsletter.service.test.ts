import { beforeEach, describe, expect, it, vi } from "vitest";

import { consumeTemporaryToken, createTemporaryToken } from "@/lib/tokens";
import { publishEvent } from "@/lib/rabbitmq";
import * as newsletterRepository from "./newsletter.repository";
import { confirmSubscription, subscribe, unsubscribe } from "./newsletter.service";
import { createUnsubscribeToken } from "./newsletter.unsubscribe-token";

vi.mock("@/lib/tokens", () => ({
  createTemporaryToken: vi.fn(),
  consumeTemporaryToken: vi.fn(),
}));
vi.mock("@/lib/rabbitmq", () => ({ publishEvent: vi.fn().mockResolvedValue(undefined) }));
vi.mock("./newsletter.repository", () => ({
  findByEmail: vi.fn(),
  upsert: vi.fn(),
  existsById: vi.fn(),
  markUnsubscribed: vi.fn(),
}));

const mockedCreateToken = vi.mocked(createTemporaryToken);
const mockedConsumeToken = vi.mocked(consumeTemporaryToken);
const mockedFindByEmail = vi.mocked(newsletterRepository.findByEmail);
const mockedUpsert = vi.mocked(newsletterRepository.upsert);
const mockedExistsById = vi.mocked(newsletterRepository.existsById);
const mockedMarkUnsubscribed = vi.mocked(newsletterRepository.markUnsubscribed);
const mockedPublish = vi.mocked(publishEvent);

beforeEach(() => {
  vi.clearAllMocks();
  mockedCreateToken.mockResolvedValue("confirm-token");
  mockedUpsert.mockResolvedValue({ id: "sub_1", created: true });
});

describe("subscribe", () => {
  it("mints a confirmation token and queues the email for a new address", async () => {
    mockedFindByEmail.mockResolvedValue(null);

    const result = await subscribe({ email: "New@Example.com" });

    expect(result).toEqual({ status: "pending" });
    expect(mockedCreateToken).toHaveBeenCalledWith(
      "newsletter-confirm",
      JSON.stringify({ email: "new@example.com", source: undefined }),
      60 * 60 * 24
    );
    expect(mockedPublish).toHaveBeenCalledWith("email.newsletter", {
      kind: "confirm",
      email: "new@example.com",
      token: "confirm-token",
    });
    expect(mockedUpsert).not.toHaveBeenCalled();
  });

  it("returns already_subscribed without sending anything for an active subscriber", async () => {
    mockedFindByEmail.mockResolvedValue({ id: "sub_1", unsubscribedAt: null });

    const result = await subscribe({ email: "reader@example.com" });

    expect(result).toEqual({ status: "already_subscribed" });
    expect(mockedCreateToken).not.toHaveBeenCalled();
    expect(mockedPublish).not.toHaveBeenCalled();
  });

  it("re-confirms a previously unsubscribed address (double opt-in again, no reactivation yet)", async () => {
    mockedFindByEmail.mockResolvedValue({ id: "sub_1", unsubscribedAt: new Date() });

    const result = await subscribe({ email: "reader@example.com" });

    expect(result).toEqual({ status: "pending" });
    expect(mockedCreateToken).toHaveBeenCalledOnce();
    expect(mockedPublish).toHaveBeenCalledWith(
      "email.newsletter",
      expect.objectContaining({ kind: "confirm" })
    );
    expect(mockedUpsert).not.toHaveBeenCalled();
  });
});

describe("confirmSubscription", () => {
  it("stores the subscriber and queues the welcome email for a valid token", async () => {
    mockedConsumeToken.mockResolvedValue(
      JSON.stringify({ email: "reader@example.com", source: "footer" })
    );

    const result = await confirmSubscription("good-token");

    expect(result).toEqual({ ok: true });
    expect(mockedConsumeToken).toHaveBeenCalledWith("newsletter-confirm", "good-token");
    expect(mockedUpsert).toHaveBeenCalledWith("reader@example.com", "footer");
    expect(mockedPublish).toHaveBeenCalledWith("email.newsletter", {
      kind: "welcome",
      email: "reader@example.com",
      subscriberId: "sub_1",
    });
  });

  it("returns not-ok for an expired or already-used token", async () => {
    mockedConsumeToken.mockResolvedValue(null);

    const result = await confirmSubscription("stale-token");

    expect(result).toEqual({ ok: false });
    expect(mockedUpsert).not.toHaveBeenCalled();
  });

  it("returns not-ok for a malformed token payload", async () => {
    mockedConsumeToken.mockResolvedValue("not json");

    const result = await confirmSubscription("weird-token");

    expect(result).toEqual({ ok: false });
    expect(mockedUpsert).not.toHaveBeenCalled();
  });
});

describe("unsubscribe", () => {
  it("opts out the subscriber behind a valid signed token", async () => {
    mockedExistsById.mockResolvedValue(true);

    const result = await unsubscribe(createUnsubscribeToken("sub_1"));

    expect(result).toEqual({ ok: true });
    expect(mockedMarkUnsubscribed).toHaveBeenCalledWith("sub_1");
  });

  it("still succeeds for an already-unsubscribed subscriber (idempotent)", async () => {
    mockedExistsById.mockResolvedValue(true);
    const token = createUnsubscribeToken("sub_1");

    await unsubscribe(token);
    const result = await unsubscribe(token);

    expect(result).toEqual({ ok: true });
  });

  it("rejects a forged token without touching the database", async () => {
    const result = await unsubscribe("sub_1.forged-signature");

    expect(result).toEqual({ ok: false });
    expect(mockedExistsById).not.toHaveBeenCalled();
    expect(mockedMarkUnsubscribed).not.toHaveBeenCalled();
  });

  it("rejects a validly signed token for a subscriber that no longer exists", async () => {
    mockedExistsById.mockResolvedValue(false);

    const result = await unsubscribe(createUnsubscribeToken("sub_deleted"));

    expect(result).toEqual({ ok: false });
    expect(mockedMarkUnsubscribed).not.toHaveBeenCalled();
  });

  it.each(["", "x".repeat(200)])("rejects an empty or oversized token", async (token) => {
    expect(await unsubscribe(token)).toEqual({ ok: false });
  });
});
