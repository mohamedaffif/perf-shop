import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: ["node_modules/**", ".next/**"],
    env: {
      REDIS_URL: "redis://localhost:6379",
      RABBITMQ_URL: "amqp://localhost:5672",
      RESEND_API_KEY: "re_xxxxxxxxx",
      RESEND_FROM_EMAIL: "ci@example.com",
      ADMIN_NOTIFICATION_EMAIL: "ci@example.com",
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
      PESAPAL_CONSUMER_KEY: "test-consumer-key",
      PESAPAL_CONSUMER_SECRET: "test-consumer-secret",
      PESAPAL_BASE_URL: "https://cybqa.pesapal.com/pesapalv3",
    },
  },
});
