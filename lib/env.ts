import { z } from "zod";

const envSchema = z.object({
  REDIS_URL: z.url("REDIS_URL must be a valid redis:// connection string"),
  RABBITMQ_URL: z.url("RABBITMQ_URL must be a valid amqp:// connection string"),
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),
  RESEND_FROM_EMAIL: z.email("RESEND_FROM_EMAIL must be a valid email address"),
  ADMIN_NOTIFICATION_EMAIL: z.email("ADMIN_NOTIFICATION_EMAIL must be a valid email address"),
  NEXT_PUBLIC_APP_URL: z.url(
    "NEXT_PUBLIC_APP_URL must be a valid URL, e.g. https://deperfumeshop.com"
  ),
  PESAPAL_CONSUMER_KEY: z.string().min(1, "PESAPAL_CONSUMER_KEY is required"),
  PESAPAL_CONSUMER_SECRET: z.string().min(1, "PESAPAL_CONSUMER_SECRET is required"),
  PESAPAL_BASE_URL: z.url("PESAPAL_BASE_URL must be a valid URL"),
  // Populated by the one-time IPN registration step (see scripts/register-pesapal-ipn.ts) —
  // optional here so `getEnv()` still works before that setup step has run.
  PESAPAL_IPN_ID: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | undefined;

export function getEnv(): Env {
  if (cached) return cached;

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `- ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid environment variables:\n${issues}`);
  }

  cached = result.data;
  return cached;
}
