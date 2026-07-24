import { z } from "zod";

const envSchema = z.object({
  REDIS_URL: z.url("REDIS_URL must be a valid redis:// connection string"),
  RABBITMQ_URL: z.url("RABBITMQ_URL must be a valid amqp:// connection string"),
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | undefined;

export function getEnv(): Env {
  if (cached) return cached;

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const issues = result.error.issues.map((issue) => `- ${issue.path.join(".")}: ${issue.message}`).join("\n");
    throw new Error(`Invalid environment variables:\n${issues}`);
  }

  cached = result.data;
  return cached;
}
