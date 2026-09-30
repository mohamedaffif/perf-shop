import { beforeEach, describe, expect, it, vi } from "vitest";

import { resend } from "@/lib/resend";
import { sendNewsletterEmail } from "./newsletter.emails";

vi.mock("react-email", async (importActual) => ({
  ...(await importActual<typeof import("react-email")>()),
  render: vi.fn().mockResolvedValue("<html></html>"),
}));
vi.mock("@/lib/resend", () => ({
  resend: { emails: { send: vi.fn().mockResolvedValue({ error: null }) } },
}));

const mockedSend = vi.mocked(resend.emails.send);

beforeEach(() => vi.clearAllMocks());

describe("sendNewsletterEmail", () => {
  it("sends the confirmation email to the subscriber", async () => {
    await sendNewsletterEmail({ kind: "confirm", email: "reader@example.com", token: "t0k" });

    expect(mockedSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "reader@example.com",
        subject: "Confirm your subscription — DE PERFUME SHOP",
      })
    );
  });

  it("sends the welcome email to the subscriber", async () => {
    await sendNewsletterEmail({ kind: "welcome", email: "reader@example.com" });

    expect(mockedSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "reader@example.com",
        subject: "You're on the list — DE PERFUME SHOP",
      })
    );
  });

  it("adds one-click List-Unsubscribe headers to the welcome email when the subscriber is known", async () => {
    await sendNewsletterEmail({
      kind: "welcome",
      email: "reader@example.com",
      subscriberId: "sub_1",
    });

    const { headers, from } = mockedSend.mock.calls[0][0];
    expect(from).toBe("ci@example.com"); // NEWSLETTER_FROM_EMAIL unset → RESEND_FROM_EMAIL
    expect(headers?.["List-Unsubscribe-Post"]).toBe("List-Unsubscribe=One-Click");
    expect(headers?.["List-Unsubscribe"]).toMatch(
      /^<http:\/\/localhost:3000\/api\/newsletter\/unsubscribe\?token=sub_1\.[\w-]+>, <mailto:hello@deperfumeshop\.co\.ke\?subject=unsubscribe>$/
    );
  });

  it("sends no unsubscribe headers on the confirm email or on legacy welcome jobs", async () => {
    await sendNewsletterEmail({ kind: "confirm", email: "reader@example.com", token: "t0k" });
    await sendNewsletterEmail({ kind: "welcome", email: "reader@example.com" });

    expect(mockedSend.mock.calls[0][0].headers).toBeUndefined();
    expect(mockedSend.mock.calls[1][0].headers).toBeUndefined();
  });

  it("throws when Resend reports an error, so the queue retries the job", async () => {
    mockedSend.mockResolvedValueOnce({ error: { message: "smtp down" } } as never);

    await expect(
      sendNewsletterEmail({ kind: "welcome", email: "reader@example.com" })
    ).rejects.toThrow("smtp down");
  });
});
