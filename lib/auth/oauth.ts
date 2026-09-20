// Google account linking is enabled in auth.ts (allowDangerousEmailAccountLinking), which
// is only safe if Google itself vouches for the email address. Runs in the edge proxy too,
// so it must stay free of Prisma / Node-only imports.
export function isOAuthSignInAllowed(
  provider: string | undefined,
  profile: { email_verified?: boolean | null } | null | undefined
): boolean {
  if (provider !== "google") return true;
  return profile?.email_verified === true;
}
