import type { Session } from "next-auth";

export interface MenuUser {
  name: string | null;
  email: string;
  image: string | null;
  role: string;
}

// The slice of the session the user menus need, safe to hand to client components.
export function toMenuUser(user: Session["user"] | undefined): MenuUser | null {
  if (!user?.email) {
    return null;
  }

  return {
    name: user.name ?? null,
    email: user.email,
    image: user.image ?? null,
    role: user.role,
  };
}
