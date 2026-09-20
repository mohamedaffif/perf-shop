-- Deny-all Row Level Security.
--
-- Supabase exposes every table in `public` through its Data API using the public
-- anon key. This app never uses that API — all access goes through Prisma over a
-- direct connection as a role with BYPASSRLS (`postgres`), which RLS does not
-- apply to. So: enable RLS and add NO policies. `anon` and `authenticated` get
-- nothing; Prisma is unaffected.
--
-- Do NOT add FORCE ROW LEVEL SECURITY: it would lock out any connection role
-- that lacks BYPASSRLS, including the app itself.
--
-- Every new table needs its own ENABLE ROW LEVEL SECURITY line (enforced by
-- prisma/rls.test.ts).

ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "accounts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "sessions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "verification_tokens" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "brands" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "products" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "product_images" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "addresses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "carts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "cart_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "orders" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "order_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "coupons" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "newsletter_subscribers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "contact_messages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "store_settings" ENABLE ROW LEVEL SECURITY;

-- Prisma's own bookkeeping table lives in `public` too.
ALTER TABLE IF EXISTS "_prisma_migrations" ENABLE ROW LEVEL SECURITY;

-- Belt and braces: also revoke table privileges from the Supabase API roles.
-- Guarded because `anon`/`authenticated` don't exist on plain Postgres (local
-- dev, Docker, CI), where this migration must still apply cleanly.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
  END IF;
END
$$;
