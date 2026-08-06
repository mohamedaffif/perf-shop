/**
 * Only same-site relative paths are safe redirect targets; anything else
 * (absolute URLs, protocol-relative `//host` URLs) could send the user off-site.
 */
export function sanitizeCallbackUrl(value: string | null | undefined): string {
  if (!value) return "/";
  return value.startsWith("/") && !value.startsWith("//") ? value : "/";
}
