/** One failed field from a validation error, e.g. `{ path: "price", message: "…" }`. */
export interface ApiFieldIssue {
  path: string;
  message: string;
}

// Pulls the `{ error }` message our API routes return out of an RTK Query rejection.
// For validation failures (`{ error, issues }` from handleApiError), appends the
// offending fields so the user can see what to fix, e.g.
// "Validation failed: price — Too small: expected number to be >0".
export function getApiErrorMessage(error: unknown, fallback: string): string {
  const body = getErrorBody(error);
  if (typeof body?.error !== "string") return fallback;

  const details = getApiErrorIssues(error)
    .slice(0, MAX_ISSUES_SHOWN)
    .map(({ path, message }) => (path ? `${path} — ${message}` : message))
    .join("; ");

  return details ? `${body.error}: ${details}` : body.error;
}

/** The per-field issues of a validation rejection (empty for any other error). */
export function getApiErrorIssues(error: unknown): ApiFieldIssue[] {
  return toFieldIssues(getErrorBody(error)?.issues);
}

/** Normalises Zod-style issues (`{ path: (string | number)[], message }`) into dotted paths. */
function toFieldIssues(issues: unknown): ApiFieldIssue[] {
  if (!Array.isArray(issues)) return [];

  return issues.map((issue: { path?: unknown; message?: unknown }) => ({
    path: Array.isArray(issue.path) ? issue.path.join(".") : "",
    message: typeof issue.message === "string" ? issue.message : "is invalid",
  }));
}

const MAX_ISSUES_SHOWN = 3;

function getErrorBody(error: unknown): { error?: unknown; issues?: unknown } | null {
  if (typeof error !== "object" || error === null || !("data" in error)) return null;
  const { data } = error;
  return typeof data === "object" && data !== null ? data : null;
}
