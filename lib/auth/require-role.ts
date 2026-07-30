import { auth } from "@/auth";
import type { UserRole } from "@/lib/generated/prisma/client";

type RoleAuthorizationResult =
  { authorized: true } | { authorized: false; error: string; status: 401 | 403 };

export async function requireRole(
  allowedRoles: readonly UserRole[]
): Promise<RoleAuthorizationResult> {
  const session = await auth();

  if (!session?.user) {
    return { authorized: false, error: "Unauthorized", status: 401 };
  }

  if (!allowedRoles.includes(session.user.role)) {
    return { authorized: false, error: "Forbidden", status: 403 };
  }

  return { authorized: true };
}
