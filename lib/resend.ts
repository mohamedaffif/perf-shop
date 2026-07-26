import { Resend } from "resend";
import { getEnv } from "@/lib/env";

export const resend = new Resend(getEnv().RESEND_API_KEY);
