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

### Google sign-in (optional)

Off for the soft launch. To enable it:

1. Google Cloud Console → **APIs & Services → OAuth consent screen**: app name, support
   email, default scopes (`openid`, `email`, `profile` — no Google review needed). Publish
   the app to **In production**; while it is in _Testing_ only listed test users can sign in.
2. **Credentials → Create OAuth client ID → Web application**:
   - Authorized JavaScript origin: `https://<domain>` (plus `http://localhost:3000` for dev).
   - Authorized redirect URI: `https://<domain>/api/auth/callback/google` (plus
     `http://localhost:3000/api/auth/callback/google` for dev).
3. Set `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` in `.env`, and `NEXT_PUBLIC_OAUTH_ENABLED=true`.
4. `NEXT_PUBLIC_OAUTH_ENABLED` is inlined at build time, so rebuild the image: set the
   `NEXT_PUBLIC_OAUTH_ENABLED` repo variable to `true` (published images) or export it before
   `docker compose build` (building on the VPS).

A Google sign-in with the email of an existing password account links to that account.
If that account's email was never verified, its password is removed (Google now proves
ownership), so the customer signs in with Google from then on. Staff accounts keep their
password.

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
- Newsletter signup → "check your inbox" message + confirmation email. Clicking the link
  lands on `/newsletter/confirmed`, adds the row to `newsletter_subscribers` (visible at
  `/admin/subscribers`), and sends the welcome email. Unconfirmed signups are never
  stored (held in Redis for 24h, then discarded).
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
