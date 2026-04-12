import type { Metadata } from "next";

import { Card } from "@/components/ui/card";
import { BodyText, FinePrint } from "@/components/ui/typography";
import { requireAdmin } from "@/lib/auth/admin-session";
import { getAdminSetupOverview } from "@/lib/booking/setup-queries";
import { AdminShell, adminDashboardCards } from "./_components/admin-shell";

const requiredSetupRoutes = ["/admin/stylisten", "/admin/zeiten", "/admin/ausnahmen"];

export const metadata: Metadata = {
  title: "Admin | Haarkult-Maintal",
  description: "Geschuetzter Bereich fuer Salonorganisation und Buchungssetup.",
};

export default async function AdminPage() {
  const admin = await requireAdmin();
  const overview = await getAdminSetupOverview();
  const missingItems = [
    !overview.setupCompletion.hasActiveStaff ? "mindestens ein aktiver Stylist" : null,
    ...overview.setupCompletion.staffMissingServices.map(
      (staffRow) => `Leistungen fuer ${staffRow.name}`
    ),
    ...overview.setupCompletion.staffMissingWeeklyHours.map(
      (staffRow) => `Arbeitszeiten fuer ${staffRow.name}`
    ),
  ].filter((item): item is string => Boolean(item));
  const missingWeeklyCount = overview.setupCompletion.staffMissingWeeklyHours.length;
  const cards = adminDashboardCards
    .filter((card) => requiredSetupRoutes.includes(card.href))
    .map((card) => {
      if (card.title === "Stylisten") {
        return {
          ...card,
          status: `${overview.counts.activeStaff} aktiv`,
        };
      }

      if (card.title === "Leistungen") {
        return {
          ...card,
          status: `${overview.counts.assignedServices} Zuordnungen`,
        };
      }

      if (card.href === "/admin/zeiten") {
        return {
          ...card,
          status:
            missingWeeklyCount > 0
              ? `${missingWeeklyCount} Personen ohne Arbeitszeiten`
              : "Arbeitszeiten bereit",
        };
      }

      if (card.href === "/admin/ausnahmen") {
        return {
          ...card,
          status: "Optional fuer Setup",
        };
      }

      return card;
    });

  return (
    <AdminShell
      title="Salon-Setup"
      subtitle="Verwalte die Grundlagen, aus denen spaeter freie Termine berechnet werden."
      adminEmail={admin.email}
      cards={cards}
      setupStatus={
        <Card className="border-[var(--line-strong)] p-5 sm:p-6">
          <FinePrint>
            {overview.setupCompletion.complete ? "Setup bereit" : "Setup unvollstaendig"}
          </FinePrint>
          <BodyText className="mt-3 text-zinc-700 dark:text-zinc-300">
            {overview.setupCompletion.complete
              ? "Stylisten, Leistungen und Arbeitszeiten sind fuer die Buchung vorbereitet."
              : `Es fehlt noch: ${missingItems.join(", ")}.`}
          </BodyText>
        </Card>
      }
    />
  );
}
