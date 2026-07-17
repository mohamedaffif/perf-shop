export type UserRole = "CUSTOMER" | "STAFF" | "ADMIN";

export interface AuthUser {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}
