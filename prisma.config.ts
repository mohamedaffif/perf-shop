import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // The Prisma CLI (generate/migrate) needs a direct connection, not the
    // app's pooled DATABASE_URL — migrations require session state and
    // advisory locks the transaction pooler doesn't support.
    url: env("DIRECT_URL"),
  },
});
