import bcrypt from "bcryptjs";
import * as authRepository from "./auth.repository";
import { loginSchema, registerSchema, updateProfileSchema } from "./auth.validator";
import type { AuthUser } from "./auth.types";

export class EmailAlreadyRegisteredError extends Error {
  constructor(email: string) {
    super(`An account with email ${email} already exists`);
    this.name = "EmailAlreadyRegisteredError";
  }
}

export class UserNotFoundError extends Error {
  constructor(id: string) {
    super(`User ${id} not found`);
    this.name = "UserNotFoundError";
  }
}

export async function verifyCredentials(raw: unknown): Promise<AuthUser | null> {
  const { email, password } = loginSchema.parse(raw);
  const user = await authRepository.findByEmail(email);

  if (!user || !user.passwordHash || !user.email) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    return null;
  }

  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export async function registerCustomer(raw: unknown): Promise<AuthUser> {
  const { name, email, password } = registerSchema.parse(raw);
  const existing = await authRepository.findByEmail(email);

  if (existing) {
    throw new EmailAlreadyRegisteredError(email);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await authRepository.createUser({ name, email, passwordHash });

  if (!user.email) {
    throw new Error("User was created without an email");
  }

  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export async function getProfile(userId: string): Promise<AuthUser> {
  const user = await authRepository.findById(userId);

  if (!user || !user.email) {
    throw new UserNotFoundError(userId);
  }

  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export async function updateProfile(userId: string, rawInput: unknown): Promise<AuthUser> {
  const input = updateProfileSchema.parse(rawInput);
  const user = await authRepository.updateUser(userId, input);

  if (!user.email) {
    throw new UserNotFoundError(userId);
  }

  return { id: user.id, name: user.name, email: user.email, role: user.role };
}
