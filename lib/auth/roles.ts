export const STAFF_ROLES = ["STAFF", "ADMIN", "DEVELOPER"] as const;
export const ADMIN_ROLES = ["ADMIN", "DEVELOPER"] as const;

export type AppRole = "CUSTOMER" | "STAFF" | "ADMIN" | "DEVELOPER";

export function isStaffRole(role: string | null | undefined): role is (typeof STAFF_ROLES)[number] {
  return !!role && (STAFF_ROLES as readonly string[]).includes(role);
}

export function isAdminRole(role: string | null | undefined): role is (typeof ADMIN_ROLES)[number] {
  return !!role && (ADMIN_ROLES as readonly string[]).includes(role);
}
