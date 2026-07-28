# DE PERFUME SHOP

A full-stack e-commerce storefront and admin panel for a perfume retailer, built with Next.js App Router, TypeScript, Prisma, and PostgreSQL (Supabase). This README documents the project as it was actually built, step by step, along with how to run it today.

## Tech stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling/UI:** Tailwind CSS 4, shadcn/ui, Radix primitives, GSAP for animation
- **Database:** PostgreSQL via Supabase, Prisma 7 ORM (`@prisma/adapter-pg`)
- **Auth:** Auth.js (NextAuth) v5 — Google, GitHub, and email/password (Credentials)
- **State:** Redux Toolkit + redux-persist for client cart state, RTK Query for API calls
- **Infra:** Redis (caching/rate-limiting), RabbitMQ (async jobs), Docker Compose, GitHub Actions CI
- **Media:** Cloudinary for image uploads
- **Email:** Resend for transactional email (React Email templates)
- **Payments:** Pesapal (card/mobile money), WhatsApp click-to-chat order confirmation
- **Testing:** Vitest

## How this project was built, step by step

The project evolved in the order below (see `git log` for full detail — 69 commits at time of writing):

1. **Bootstrap** — Next.js app scaffolded with `create-next-app`, Tailwind, and Prettier configured.
2. **Design system first** — typography, 4pt spacing scale, animation utilities, and core UI were built before any real pages, so every feature after this reused a consistent visual language.
3. **Database layer** — Prisma set up against Neon Postgres initially, later migrated to Supabase (see step 12). Schema built incrementally: `Brand`/`Category`/`Product` first, then `Cart`/`Order`/`Coupon`/`Address`, matching feature work as it landed.
4. **Catalog & storefront** — home page (hero, category tiles, featured products), `/shop/[category]` with query-param filtering by scent family, product cards, fuzzy/ranked search via Postgres `pg_trgm`, and a popup product search.
5. **Client state** — Redux Toolkit + redux-persist wired up for cart state; custom hooks (`useAsyncForm`, `useDisclosure`, `useInterval`, `useQueryParamFilter`) extracted to keep components thin and reusable.
6. **Cart & checkout** — slide-in cart drawer, full checkout flow, WhatsApp order-confirmation link (`lib/whatsapp.ts`) built from real order data (items, total, delivery address).
7. **Auth** — Auth.js v5 wired up with a Prisma adapter and JWT sessions; started with Credentials (email/password via `bcryptjs`), later extended with Google and GitHub OAuth providers (see `auth.ts`).
8. **Account & admin surfaces** — customer account pages (orders, addresses), and a full admin dashboard: products, brands, categories, coupons, customers, orders, and settings, each with matching `app/api/admin/*` routes.
9. **Infrastructure** — Redis and RabbitMQ added for caching/rate-limiting and async order/notification/invoice jobs (`worker/index.ts`), plus Docker Compose and GitHub Actions CI.
10. **Transactional email** — Resend integrated with React Email templates (`emails/order-confirmation`, `emails/admin-new-order`), triggered from the worker.
11. **Dockerization** — multi-stage Dockerfile, Docker Hub publish workflow, env var plumbing so CI/Docker builds don't fail on missing placeholders.
12. **Neon → Supabase migration** — `DATABASE_URL` (transaction pooler) and `DIRECT_URL` (session pooler/direct) split so the app runs through Supabase's pooler at runtime while Prisma CLI migrations use a direct connection (`prisma.config.ts`).
13. **Payments** — Pesapal integration for real checkout payments (`app/api/payments/pesapal`, `scripts/register-pesapal-ipn.ts` for one-time IPN callback registration per environment).
14. **Admin content management** — Brand/Category management UI added to the admin panel, followed by an authorization audit that fixed missing auth checks on product/brand/category/upload mutation routes.
15. **OAuth hardening** — Google OAuth env vars aligned to Auth.js v5's expected names (`AUTH_GOOGLE_ID`/`AUTH_GOOGLE_SECRET`), `AUTH_URL` documented for local vs. production, and GitHub added as a second OAuth provider using the same pattern.

## Project structure

```text
app/
  (auth)/login, register        — public auth pages
  (store)/shop, product, cart..  — customer-facing storefront
  (account)/account/...         — logged-in customer account pages
  admin/...                     — admin dashboard (products, brands, categories, coupons, customers, orders, settings)
  api/...                       — route handlers backing the above (incl. /api/auth, /api/payments/pesapal)
domain/                         — business logic per entity (auth, product, order, cart, payment, ...)
lib/                            — infra clients (prisma, cloudinary, resend, whatsapp, rate-limit, env)
components/                     — shared UI (shadcn/ui-based)
redux/                          — RTK store, slices, RTK Query API slices
emails/                         — React Email templates
worker/                         — async job consumer (order/notification/invoice jobs via RabbitMQ)
prisma/                         — schema, migrations, seed data
scripts/                        — one-off operational scripts (e.g. Pesapal IPN registration)
```

## Data model (Prisma)

Core entities: `User` (+ `Account`/`Session` for Auth.js), `Brand`, `Category`, `Product` (+ `ProductImage`), `Cart`/`CartItem`, `Order`/`OrderItem`, `Address`, `Coupon`, `StoreSettings`. Enums cover product status, concentration, scent family, size, badges, user role, order/payment status, and coupon type — see `prisma/schema.prisma` for the full schema.

## Getting started

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Configure environment variables** — copy `.env.example` to `.env` and fill in real values. Never commit `.env`. Key groups:
   - `DATABASE_URL` / `DIRECT_URL` — Supabase transaction pooler / direct connection
   - `AUTH_SECRET`, `AUTH_URL`, `AUTH_GOOGLE_ID`/`SECRET`, `AUTH_GITHUB_ID`/`SECRET` — Auth.js
   - `CLOUDINARY_URL` — image uploads
   - `PESAPAL_*` — payments
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` — WhatsApp checkout
   - `RESEND_*` — transactional email
   - `REDIS_URL`, `RABBITMQ_URL` — infra (run `docker compose up -d` locally)

3. **Set up the database**

   ```bash
   pnpm prisma generate
   pnpm prisma migrate deploy   # or `prisma migrate dev` while developing schema changes
   pnpm db:seed                 # seeds brands/categories/products + an admin user from SEED_ADMIN_EMAIL/PASSWORD
   ```

4. **Run local infra** (Redis, RabbitMQ)

   ```bash
   docker compose up -d
   ```

5. **Start the app**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

6. **Run the background worker** (order/notification/invoice jobs)

   ```bash
   pnpm worker
   ```

## Other useful commands

```bash
pnpm lint            # eslint
pnpm typecheck       # tsc --noEmit
pnpm test            # vitest
pnpm format          # prettier --write
pnpm email:dev       # preview React Email templates
pnpm pesapal:register-ipn   # one-time per-environment Pesapal IPN registration
```

## Deployment

Built for Docker: `Dockerfile` produces a multi-stage production image, `docker-compose.yml` wires it up with Redis and RabbitMQ. GitHub Actions CI (`.github/workflows/ci.yml`) runs lint/typecheck/tests and builds the Docker image on push.
