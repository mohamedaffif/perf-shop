import { revalidatePath } from "next/cache";

/**
 * Refreshes the ISR-cached storefront pages that render catalog data, so an
 * admin edit to a product, brand or category shows up immediately instead of
 * after the pages' revalidate window. Call after a successful catalog write.
 * (The Redis data caches are invalidated separately by the repositories.)
 */
export function revalidateStorefront(): void {
  revalidatePath("/");
  revalidatePath("/product/[id]", "page");
}
