import type { Metadata } from "next";

import { requireAdmin } from "@/lib/auth/admin-session";
import { AdminShell, adminDashboardCards } from "./_components/admin-shell";

export const metadata: Metadata = {
  title: "Admin | Haarkult-Maintal",
  description: "Geschuetzter Bereich fuer Salonorganisation und Buchungssetup.",
};

export default async function AdminPage() {
  const admin = await requireAdmin();

  return (
    <AdminShell
      title="Salon-Setup"
      subtitle="Verwalte die Grundlagen, aus denen spaeter freie Termine berechnet werden."
      adminEmail={admin.email}
      cards={adminDashboardCards}
    />
  );
}
