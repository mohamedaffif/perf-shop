// Modeled on lib/auth/require-role.ts's RoleAuthorizationResult: a
// discriminated union prevents callers from checking `data`/`error` on the
// wrong branch, unlike a loose `{ success: boolean; data?: T; error?: string }`.
export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };
