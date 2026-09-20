// Pulls the `{ error }` message our API routes return out of an RTK Query rejection.
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === "object" && error !== null && "data" in error) {
    const { data } = error;

    if (typeof data === "object" && data !== null && "error" in data) {
      const message = data.error;

      if (typeof message === "string") {
        return message;
      }
    }
  }

  return fallback;
}
