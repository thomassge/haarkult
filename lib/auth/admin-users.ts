import { eq } from "drizzle-orm";

import { verifyPassword } from "@/lib/auth/password";

export type AdminRole = "owner" | "manager" | "staff";

export type AdminUserRecord = {
  id: string;
  email: string;
  passwordHash: string;
  role: AdminRole;
  active: boolean;
};

export type AdminSessionUser = {
  id: string;
  email: string;
  role: AdminRole;
  active: boolean;
};

export type AdminCredentials = {
  email: string;
  password: string;
};

export type AdminUserRepository = (
  normalizedEmail: string
) => Promise<AdminUserRecord | null>;

export function normalizeAdminEmail(email: string) {
  return email.trim().toLowerCase();
}

export function toAdminSessionUser(admin: AdminUserRecord): AdminSessionUser {
  return {
    id: admin.id,
    email: admin.email,
    role: admin.role,
    active: admin.active,
  };
}

export async function findAdminUserByEmail(normalizedEmail: string) {
  const [{ db }, { adminUsers }] = await Promise.all([
    import("@/db"),
    import("@/db/schema"),
  ]);

  const [admin] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, normalizedEmail))
    .limit(1);

  return admin ?? null;
}

export async function authorizeAdminCredentials(
  credentials: AdminCredentials,
  findAdminUser: AdminUserRepository = findAdminUserByEmail
) {
  const normalizedEmail = normalizeAdminEmail(credentials.email);
  const admin = await findAdminUser(normalizedEmail);

  if (!admin || admin.active !== true) {
    return null;
  }

  const passwordValid = await verifyPassword(credentials.password, admin.passwordHash);

  if (!passwordValid) {
    return null;
  }

  return toAdminSessionUser(admin);
}
