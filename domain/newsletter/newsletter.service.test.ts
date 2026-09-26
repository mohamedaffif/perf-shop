import { beforeEach, describe, expect, it, vi } from "vitest";

import { consumeTemporaryToken, createTemporaryToken } from "@/lib/tokens";
import { publishEvent } from "@/lib/rabbitmq";
import * as newsletterRepository from "./newsletter.repository";
import { confirmSubscription, subscribe } from "./newsletter.service";

vi.mock("@/lib/tokens", () => ({
  createTemporaryToken: vi.fn(),
  consumeTemporaryToken: vi.fn(),
}));
vi.mock("@/lib/rabbitmq", () => ({ publishEvent: vi.fn().mockResolvedValue(undefined) }));
vi.mock("./newsletter.repository", () => ({
  findByEmail: vi.fn(),
  upsert: vi.fn(),
}));

const mockedCreateToken = vi.mocked(createTemporaryToken);
const mockedConsumeToken = vi.mocked(consumeTemporaryToken);
const mockedFindByEmail = vi.mocked(newsletterRepository.findByEmail);
const mockedUpsert = vi.mocked(newsletterRepository.upsert);
const mockedPublish = vi.mocked(publishEvent);

beforeEach(() => {
  vi.clearAllMocks();
  mockedCreateToken.mockResolvedValue("confirm-token");
  mockedUpsert.mockResolvedValue({ created: true });
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

  it("re-confirms a previously unsubscribed address", async () => {
    mockedFindByEmail.mockResolvedValue({ id: "sub_1", unsubscribedAt: new Date() });

    const result = await subscribe({ email: "reader@example.com" });

    expect(result).toEqual({ status: "pending" });
    expect(mockedCreateToken).toHaveBeenCalledOnce();
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
