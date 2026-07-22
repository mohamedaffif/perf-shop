const FREE_SHIPPING_THRESHOLD = 50000;
const FLAT_SHIPPING_COST = 500;
const TAX_RATE = 0.16;

export function calculateShipping(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_COST;
}

export function calculateTax(taxableAmount: number): number {
  return Number((Math.max(taxableAmount, 0) * TAX_RATE).toFixed(2));
}
