# Deployment — Soft Launch (VPS + docker-compose)

The soft launch runs the **brand / teaser site**: `NEXT_PUBLIC_SHOP_LIVE=false`, so shop,
cart, checkout, and account routes redirect to home. Visitors can read the story, contact
the business, and subscribe to the newsletter. No payments, no Pesapal, no product data.

## 1. One-time setup

### Supabase

- Create the project. Copy the **Transaction Pooler** URL (port 6543, append
  `?pgbouncer=true`) → `DATABASE_URL`, and the **Session Pooler / direct** URL (port 5432)
  → `DIRECT_URL`.

### Resend

- Add and verify the sending domain (e.g. `deperfumeshop.co.ke`).
- Create an API key → `RESEND_API_KEY`.
- `RESEND_FROM_EMAIL` = a verified address (e.g. `hello@deperfumeshop.co.ke`).
- `ADMIN_NOTIFICATION_EMAIL` = the inbox that should receive contact-form messages.

### DNS

- `A` record for the apex domain → VPS public IP. (`www` CNAME → apex if wanted.)

### VPS

- Ubuntu, Docker + Docker Compose plugin installed.
- Open ports 80 and 443.
- Clone this repo (or just copy `docker-compose.yml`, `Caddyfile`, and `.env`).

## 2. `.env` on the server

Copy `.env.example` → `.env` and fill:

| Var                                                               | Value                                                                       |
| ----------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `DATABASE_URL`, `DIRECT_URL`                                      | from Supabase                                                               |
| `NEXT_PUBLIC_APP_URL`, `AUTH_URL`                                 | `https://<domain>`                                                          |
| `NEXT_PUBLIC_SHOP_LIVE`                                           | `false`                                                                     |
| `NEXT_PUBLIC_OAUTH_ENABLED`                                       | `false`                                                                     |
| `AUTH_SECRET`                                                     | `openssl rand -base64 33`                                                   |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `ADMIN_NOTIFICATION_EMAIL` | from Resend                                                                 |
| `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`                         | the first admin login                                                       |
| `NEXT_PUBLIC_WHATSAPP_NUMBER`                                     | digits only, e.g. `2547...` (optional)                                      |
| `CLOUDINARY_URL`                                                  | placeholder is fine until products go live                                  |
| `PESAPAL_*`                                                       | leave the sandbox placeholders — nothing calls Pesapal                      |
| `REDIS_URL`                                                       | `redis://redis:6379`                                                        |
| `RABBITMQ_URL`                                                    | `amqp://rabbitmq:5672`                                                      |
| `SITE_ADDRESS`                                                    | `<domain>` (Caddy TLS)                                                      |
| `ACME_EMAIL`                                                      | your email for Let's Encrypt                                                |
| `DOCKERHUB_USERNAME`                                              | Docker Hub account the images are pushed to, or `local` to build on the box |
| `IMAGE_TAG`                                                       | `latest` or a commit SHA                                                    |

## 3. Build / publish images

Push to `main` triggers `.github/workflows/docker-publish.yml`, which builds and pushes
`de-perfume-shop`, `de-perfume-shop-worker`, and `de-perfume-shop-migrate` to Docker Hub
(needs `DOCKERHUB_USERNAME` / `DOCKERHUB_TOKEN` repo secrets).

To build on the VPS instead, set `DOCKERHUB_USERNAME=local` and use `--build` below.

## 4. First deploy

```bash
docker compose --profile production pull        # skip if building locally
docker compose --profile production up -d       # add --build to build on the box
docker compose run --rm migrate                 # already runs via depends_on, but safe to run explicitly
docker compose exec app pnpm db:seed            # creates the admin user (products seed too; harmless while shop is hidden)
```

`migrate` applies pending Prisma migrations and exits; `app` waits for it and for its own
`/api/health` check before Caddy routes traffic.

> **Schema migrations.** The `migrate` container runs `prisma migrate deploy`. Never run
> `prisma migrate dev` against Supabase: its pre-installed extensions (`pg_stat_statements`,
> `pgcrypto`, `supabase_vault`, `uuid-ossp`) trigger Prisma drift detection and a
> destructive reset prompt. Develop schema changes against a local Postgres, commit the
> migration file, and let `migrate deploy` apply it.

## 5. Verify

- `https://<domain>` → teaser home, newsletter form, no product grid.
- `https://<domain>/shop` and `/checkout` → redirect to `/`.
- `/contact` → submit → message lands in `ADMIN_NOTIFICATION_EMAIL`.
- Newsletter signup → row in `newsletter_subscribers` (visible at `/admin/subscribers`),
  welcome email delivered.
- `/admin` → sign in with the seeded admin.
- `curl https://<domain>/api/health` → `{"status":"ok"}`.
- `/sitemap.xml`, `/robots.txt`, favicon, and OG image resolve.

## 6. Redeploy

```bash
docker compose --profile production pull
docker compose --profile production up -d
```

## Going to full commerce later

1. Complete the Pesapal production cutover (live keys, `PESAPAL_BASE_URL`,
   `pnpm pesapal:register-ipn`), plus the other items in the plan's "deferred" list.
2. Set the `NEXT_PUBLIC_SHOP_LIVE` repo variable to `true` (or build with
   `--build-arg NEXT_PUBLIC_SHOP_LIVE=true`).
3. Rebuild + redeploy.
