import { beforeEach, describe, expect, it, vi } from "vitest";

import { consumeTemporaryToken, createTemporaryToken } from "@/lib/tokens";
import { resend } from "@/lib/resend";
import * as newsletterRepository from "./newsletter.repository";
import { confirmSubscription, subscribe } from "./newsletter.service";

vi.mock("react-email", async (importActual) => ({
  ...(await importActual<typeof import("react-email")>()),
  render: vi.fn().mockResolvedValue("<html></html>"),
}));
vi.mock("@/lib/tokens", () => ({
  createTemporaryToken: vi.fn(),
  consumeTemporaryToken: vi.fn(),
}));
vi.mock("@/lib/resend", () => ({
  resend: { emails: { send: vi.fn().mockResolvedValue({ error: null }) } },
}));
vi.mock("./newsletter.repository", () => ({
  findByEmail: vi.fn(),
  upsert: vi.fn(),
}));

const mockedCreateToken = vi.mocked(createTemporaryToken);
const mockedConsumeToken = vi.mocked(consumeTemporaryToken);
const mockedFindByEmail = vi.mocked(newsletterRepository.findByEmail);
const mockedUpsert = vi.mocked(newsletterRepository.upsert);
const mockedSend = vi.mocked(resend.emails.send);

beforeEach(() => {
  vi.clearAllMocks();
  mockedCreateToken.mockResolvedValue("confirm-token");
  mockedUpsert.mockResolvedValue({ created: true });
});

describe("subscribe", () => {
  it("mints a confirmation token and sends the email for a new address", async () => {
    mockedFindByEmail.mockResolvedValue(null);

    const result = await subscribe({ email: "New@Example.com" });

    expect(result).toEqual({ status: "pending" });
    expect(mockedCreateToken).toHaveBeenCalledWith(
      "newsletter-confirm",
      JSON.stringify({ email: "new@example.com", source: undefined }),
      60 * 60 * 24
    );
    expect(mockedSend).toHaveBeenCalledOnce();
    expect(mockedUpsert).not.toHaveBeenCalled();
  });

  it("returns already_subscribed without sending anything for an active subscriber", async () => {
    mockedFindByEmail.mockResolvedValue({ id: "sub_1", unsubscribedAt: null });

    const result = await subscribe({ email: "reader@example.com" });

    expect(result).toEqual({ status: "already_subscribed" });
    expect(mockedCreateToken).not.toHaveBeenCalled();
    expect(mockedSend).not.toHaveBeenCalled();
  });

  it("re-confirms a previously unsubscribed address", async () => {
    mockedFindByEmail.mockResolvedValue({ id: "sub_1", unsubscribedAt: new Date() });

    const result = await subscribe({ email: "reader@example.com" });

    expect(result).toEqual({ status: "pending" });
    expect(mockedCreateToken).toHaveBeenCalledOnce();
  });

  it("still reports pending when the confirmation email fails", async () => {
    mockedFindByEmail.mockResolvedValue(null);
    mockedSend.mockResolvedValueOnce({ error: { message: "smtp down" } } as never);

    await expect(subscribe({ email: "reader@example.com" })).resolves.toEqual({
      status: "pending",
    });
  });
});

describe("confirmSubscription", () => {
  it("stores the subscriber and sends the welcome email for a valid token", async () => {
    mockedConsumeToken.mockResolvedValue(
      JSON.stringify({ email: "reader@example.com", source: "footer" })
    );

    const result = await confirmSubscription("good-token");

    expect(result).toEqual({ ok: true });
    expect(mockedConsumeToken).toHaveBeenCalledWith("newsletter-confirm", "good-token");
    expect(mockedUpsert).toHaveBeenCalledWith("reader@example.com", "footer");
    expect(mockedSend).toHaveBeenCalledOnce();
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
