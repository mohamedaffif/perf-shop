// Auth.js redirects failed sign-ins to pages.signIn with ?error=<code>.
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  AccessDenied:
    "We couldn't sign you in with that account. Make sure your email is verified and try again.",
  OAuthAccountNotLinked:
    "That email is already registered with a different sign-in method. Please use the method you signed up with.",
  OAuthSignin: "We couldn't start the sign-in. Please try again.",
  OAuthCallbackError: "Sign-in was interrupted. Please try again.",
  Configuration: "Sign-in is temporarily unavailable. Please try again later.",
};

const DEFAULT_AUTH_ERROR = "Something went wrong while signing you in. Please try again.";

export function getAuthErrorMessage(code: string | null | undefined): string | null {
  if (!code) return null;
  return AUTH_ERROR_MESSAGES[code] ?? DEFAULT_AUTH_ERROR;
}
