import type { Metadata } from "next";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { BodyText, FinePrint } from "@/components/ui/typography";
import { requireAdmin } from "@/lib/auth/admin-session";
import { getWeeklyAvailabilitySetupData } from "@/lib/booking/setup-queries";
import { WeeklyHoursForm } from "./_components/weekly-hours-form";

export const metadata: Metadata = {
  title: "Arbeitszeiten | Admin | Haarkult-Maintal",
  description: "Geschuetzte Verwaltung fuer woechentliche Arbeitszeiten.",
};

export default async function AdminWeeklyHoursPage() {
  const admin = await requireAdmin();
  const setupData = await getWeeklyAvailabilitySetupData();

  return (
    <Section className="pt-14 sm:pt-20 lg:pt-24">
      <Container>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <Heading
            eyebrow="Admin"
            title="Arbeitszeiten"
            subtitle="Pflege die regelmaessigen Wochenzeiten pro Stylistin oder Stylist."
          />
          <div className="text-sm text-zinc-600 dark:text-zinc-300">
            Angemeldet als <span className="font-medium">{admin.email}</span>
          </div>
        </div>

        <div className="mb-8">
          <Link className="text-sm underline underline-offset-4" href="/admin">
            Zurueck zum Salon-Setup
          </Link>
        </div>

        <div className="space-y-5">
          {setupData.staff.length === 0 ? (
            <Card className="border-[var(--line-strong)] p-5 sm:p-6">
              <BodyText className="text-zinc-700 dark:text-zinc-300">
                Lege zuerst einen aktiven Stylisten an.
              </BodyText>
            </Card>
          ) : (
            setupData.staff.map((staffRow) => (
              <Card key={staffRow.id} className="border-[var(--line-strong)] p-5 sm:p-6">
                <div className="mb-5">
                  <FinePrint>
                    {staffRow.weeklyRanges.length > 0
                      ? `${staffRow.weeklyRanges.length} Zeitfenster`
                      : "Noch keine Zeiten"}
                  </FinePrint>
                  <h2 className="mt-3 text-xl font-semibold text-zinc-950 dark:text-zinc-50">
                    {staffRow.name}
                  </h2>
                  <BodyText className="mt-2 text-zinc-700 dark:text-zinc-300">
                    Mehrere Zeitfenster pro Tag sind moeglich, zum Beispiel Vormittag
                    und Nachmittag.
                  </BodyText>
                </div>
                <WeeklyHoursForm stylist={staffRow} />
              </Card>
            ))
          )}
        </div>
      </Container>
    </Section>
  );
}
