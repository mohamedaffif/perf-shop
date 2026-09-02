import { render } from "react-email";

import { prisma } from "@/lib/prisma";
import { getEnv } from "@/lib/env";
import { resend } from "@/lib/resend";
import ContactMessageEmail from "@/emails/contact-message";
import { contactMessageSchema } from "./contact.validator";

async function notifyAdmin(name: string, email: string, message: string): Promise<void> {
  try {
    const html = await render(ContactMessageEmail({ name, email, message }));
    const { error } = await resend.emails.send({
      from: getEnv().RESEND_FROM_EMAIL,
      to: getEnv().ADMIN_NOTIFICATION_EMAIL,
      replyTo: email,
      subject: `New contact message from ${name}`,
      html,
    });
    if (error) throw new Error(error.message);
  } catch (err) {
    // The message is already persisted; a mail failure shouldn't fail the request.
    console.error(`[contact] admin notification for ${email} failed`, err);
  }
}

export async function submitContactMessage(rawInput: unknown): Promise<{ received: true }> {
  const { name, email, message } = contactMessageSchema.parse(rawInput);

  await prisma.contactMessage.create({ data: { name, email, message } });
  await notifyAdmin(name, email, message);

  return { received: true };
}
