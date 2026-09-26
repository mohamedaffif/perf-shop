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

  it("throws when Resend reports an error, so the queue retries the job", async () => {
    mockedSend.mockResolvedValueOnce({ error: { message: "smtp down" } } as never);

    await expect(
      sendNewsletterEmail({ kind: "welcome", email: "reader@example.com" })
    ).rejects.toThrow("smtp down");
  });
});
