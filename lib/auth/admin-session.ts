import { redirect } from "next/navigation";

import { auth } from "@/auth";
import type { AdminSessionUser } from "@/lib/auth/admin-users";

export async function getAdminSession() {
  const session = await auth();
  const user = session?.user as Partial<AdminSessionUser> | undefined;

  if (!user?.id || !user.email || !user.role || user.active !== true) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    active: true,
  } satisfies AdminSessionUser;
}

export async function requireAdmin() {
  const admin = await getAdminSession();

  if (!admin) {
    redirect("/admin/login");
  }

  return admin;
}
