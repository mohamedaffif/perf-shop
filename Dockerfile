# syntax=docker/dockerfile:1

# Keep the Node major in sync with .nvmrc.
FROM node:22-alpine AS base
RUN apk add --no-cache openssl libc6-compat
RUN corepack enable && corepack prepare pnpm@11.14.0 --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --network-concurrency=4 --fetch-timeout=300000 --fetch-retries=5

# Source + generated Prisma client. The worker and migrate images branch from here
# (no `next build`, and none of the build-time placeholder env below).
FROM deps AS generated
COPY . .
# prisma.config.ts reads DIRECT_URL at generate time; inline so it doesn't persist as image ENV.
RUN DIRECT_URL="postgresql://user:password@localhost:5432/de_perfume_shop" \
    pnpm exec prisma generate

# Build stage only — never shipped. The placeholders below let `next build` import
# modules that validate env; real values come from .env at runtime.
FROM generated AS builder
# NEXT_PUBLIC_* is inlined at build time, so these are baked into the image. Flip the
# storefront kill-switch by rebuilding with --build-arg NEXT_PUBLIC_SHOP_LIVE=true, and set
# NEXT_PUBLIC_APP_URL to the public origin (sitemap, robots and metadata use it).
ARG NEXT_PUBLIC_SHOP_LIVE="false"
ENV NEXT_PUBLIC_SHOP_LIVE="$NEXT_PUBLIC_SHOP_LIVE"
ARG NEXT_PUBLIC_OAUTH_ENABLED="false"
ENV NEXT_PUBLIC_OAUTH_ENABLED="$NEXT_PUBLIC_OAUTH_ENABLED"
ARG NEXT_PUBLIC_APP_URL="http://localhost:3000"
ENV NEXT_PUBLIC_APP_URL="$NEXT_PUBLIC_APP_URL"
ENV DATABASE_URL="postgresql://user:password@localhost:5432/de_perfume_shop" \
    DIRECT_URL="postgresql://user:password@localhost:5432/de_perfume_shop" \
    AUTH_SECRET="ci-placeholder-secret" \
    REDIS_URL="redis://localhost:6379" \
    RABBITMQ_URL="amqp://localhost:5672" \
    RESEND_API_KEY="re_ci_placeholder" \
    RESEND_FROM_EMAIL="ci@example.com" \
    ADMIN_NOTIFICATION_EMAIL="ci@example.com" \
    PESAPAL_CONSUMER_KEY="ci-placeholder-key" \
    PESAPAL_CONSUMER_SECRET="ci-placeholder-secret" \
    PESAPAL_BASE_URL="https://cybqa.pesapal.com/pesapalv3"
RUN pnpm build

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/lib/generated/prisma ./lib/generated/prisma
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]

# Invoke tsx via node directly so SIGTERM reaches the worker (no pnpm in between).
FROM generated AS worker
ENV NODE_ENV=production
CMD ["node", "--import", "tsx", "worker/index.ts"]

# One-shot: applies pending Prisma migrations, then exits. Run before app/worker.
# Also the image to use for `pnpm db:seed` (full source + dev deps).
FROM generated AS migrate
ENV NODE_ENV=production
CMD ["pnpm", "exec", "prisma", "migrate", "deploy"]
