# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
RUN apk add --no-cache openssl libc6-compat
RUN corepack enable && corepack prepare pnpm@11.14.0 --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV DATABASE_URL="postgresql://user:password@localhost:5432/de_perfume_shop" \
    AUTH_SECRET="ci-placeholder-secret" \
    REDIS_URL="redis://localhost:6379" \
    RABBITMQ_URL="amqp://localhost:5672" \
    RESEND_API_KEY="re_ci_placeholder" \
    RESEND_FROM_EMAIL="ci@example.com" \
    ADMIN_NOTIFICATION_EMAIL="ci@example.com" \
    NEXT_PUBLIC_APP_URL="http://localhost:3000" \
    PESAPAL_CONSUMER_KEY="ci-placeholder-key" \
    PESAPAL_CONSUMER_SECRET="ci-placeholder-secret" \
    PESAPAL_BASE_URL="https://cybqa.pesapal.com/pesapalv3"
RUN pnpm exec prisma generate
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

FROM builder AS worker
ENV NODE_ENV=production
CMD ["pnpm", "run", "worker"]
