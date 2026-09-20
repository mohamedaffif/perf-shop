import bcrypt from "bcryptjs";
import * as authRepository from "./auth.repository";
import {
  changePasswordSchema,
  loginSchema,
  registerSchema,
  updateProfileSchema,
} from "./auth.validator";
import type { AccountProfile, AuthUser } from "./auth.types";

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

export class InvalidPasswordError extends Error {
  constructor() {
    super("Current password is incorrect");
    this.name = "InvalidPasswordError";
  }
}

export class PasswordNotSetError extends Error {
  constructor() {
    super("This account uses social sign-in and has no password to change");
    this.name = "PasswordNotSetError";
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

// Called after an OAuth account is linked. Password sign-up never verifies the email, so a
// password on an unverified customer account may have been set by someone who doesn't own
// the address (pre-hijacking). The provider has now proven ownership, so drop that password.
// Staff accounts are seeded/managed by admins, so their password is kept.
export async function verifyEmailAfterOAuthLink(userId: string): Promise<void> {
  const user = await authRepository.findById(userId);

  if (!user || user.emailVerified) {
    return;
  }

  await authRepository.markEmailVerified(userId, { clearPassword: user.role === "CUSTOMER" });
}

export async function getProfile(userId: string): Promise<AccountProfile> {
  const user = await authRepository.findByIdWithAccounts(userId);

  if (!user || !user.email) {
    throw new UserNotFoundError(userId);
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    image: user.image,
    phone: user.phone,
    emailVerified: user.emailVerified !== null,
    createdAt: user.createdAt.toISOString(),
    hasPassword: user.passwordHash !== null,
    providers: user.accounts.map((account) => account.provider),
  };
}

export async function updateProfile(userId: string, rawInput: unknown): Promise<AccountProfile> {
  const input = updateProfileSchema.parse(rawInput);
  await authRepository.updateUser(userId, input);

  return getProfile(userId);
}

export async function changePassword(userId: string, rawInput: unknown): Promise<void> {
  const { currentPassword, newPassword } = changePasswordSchema.parse(rawInput);
  const user = await authRepository.findById(userId);

  if (!user) {
    throw new UserNotFoundError(userId);
  }

  if (!user.passwordHash) {
    throw new PasswordNotSetError();
  }

  const isValid = await bcrypt.compare(currentPassword, user.passwordHash);

  if (!isValid) {
    throw new InvalidPasswordError();
  }

  await authRepository.updatePasswordHash(userId, await bcrypt.hash(newPassword, 10));
}
