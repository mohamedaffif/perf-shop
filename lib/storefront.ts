/**
 * Storefront kill-switch for the soft launch.
 *
 * While `false` the site runs as a brand / teaser page: shop, cart, and checkout
 * routes redirect to home (see `proxy.ts`) and the commerce chrome is hidden.
 * Flip `NEXT_PUBLIC_SHOP_LIVE=true` to bring the already-built storefront online.
 *
 * Kept dependency-free so it is safe to import from middleware, server, and client.
 * `NEXT_PUBLIC_*` is inlined at build time, so this resolves in every bundle.
 */
export const SHOP_LIVE = process.env.NEXT_PUBLIC_SHOP_LIVE === "true";

/** Route prefixes that only make sense once the shop is live. */
export const COMMERCE_PREFIXES = [
  "/shop",
  "/product",
  "/brands",
  "/search",
  "/checkout",
  "/cart",
  "/account",
] as const;

export function isCommercePath(pathname: string): boolean {
  return COMMERCE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}
