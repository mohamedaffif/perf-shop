/**
 * Narrows a string to one of a fixed set of literals — e.g. a Zod enum
 * schema's `.options` — instead of an unchecked `as` assertion. Use at
 * boundaries where a string arrives untyped (URL search params, persisted
 * client state, a UI callback's widened `string` prop) but must match one of
 * a domain enum's values before use.
 */
export function isOneOf<T extends string>(options: readonly T[], value: string): value is T {
  return (options as readonly string[]).includes(value);
}
