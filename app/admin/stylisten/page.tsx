import type { Metadata } from "next";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { BodyText, FinePrint } from "@/components/ui/typography";
import { requireAdmin } from "@/lib/auth/admin-session";
import { getStaffSetupData } from "@/lib/booking/setup-queries";
import { StylistSetupForm } from "./_components/stylist-setup-form";

export const metadata: Metadata = {
  title: "Stylisten | Admin | Haarkult-Maintal",
  description: "Geschuetzte Verwaltung fuer buchbare Stylisten und Leistungen.",
};

export default async function AdminStylistsPage() {
  const admin = await requireAdmin();
  const setupData = await getStaffSetupData();

  return (
    <Section className="pt-14 sm:pt-20 lg:pt-24">
      <Container>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <Heading
            eyebrow="Admin"
            title="Stylisten"
            subtitle="Pflege nur die Personen, die spaeter fuer Online-Termine ausgewaehlt werden koennen."
          />
          <div className="text-sm text-zinc-600 dark:text-zinc-300">
            Angemeldet als <span className="font-medium">{admin.email}</span>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-4 text-sm">
          <Link className="underline underline-offset-4" href="/admin">
            Zurueck zum Salon-Setup
          </Link>
          <Link className="underline underline-offset-4" href="/admin/leistungen">
            Leistungen zuordnen
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="space-y-4">
            <Card
              as="details"
              className="group border-[var(--line-strong)] p-5 sm:p-6"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <span>
                  <FinePrint>Neu</FinePrint>
                  <span className="mt-3 block text-xl font-semibold text-zinc-950 dark:text-zinc-50">
                    Neue Stylistin anlegen
                  </span>
                  <BodyText className="mt-2 text-zinc-700 dark:text-zinc-300">
                    Oeffne das Formular erst, wenn du eine neue Person anlegen willst.
                  </BodyText>
                </span>
                <span className="rounded-lg border border-[var(--line-strong)] px-3 py-2 text-sm font-semibold">
                  Oeffnen
                </span>
              </summary>
              <div className="mt-6">
                <StylistSetupForm services={setupData.serviceOptions} />
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <div>
              <FinePrint>Aktuell</FinePrint>
              <h2 className="mt-3 text-xl font-semibold text-zinc-950 dark:text-zinc-50">
                Buchbare Stylisten
              </h2>
            </div>

            {setupData.staff.length === 0 ? (
              <Card className="border-[var(--line-strong)] p-5 sm:p-6">
                <BodyText className="text-zinc-700 dark:text-zinc-300">
                  Noch keine Stylisten angelegt.
                </BodyText>
              </Card>
            ) : (
              setupData.staff.map((staffRow) => (
                <Card
                  key={staffRow.id}
                  as="details"
                  className="group border-[var(--line-strong)] p-5 sm:p-6"
                >
                  <summary className="flex cursor-pointer list-none flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <span>
                      <span className="block text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                        {staffRow.name}
                      </span>
                      <BodyText className="text-zinc-600 dark:text-zinc-300">
                        {staffRow.active ? "Aktiv" : "Inaktiv"} -{" "}
                        {staffRow.assignedServices.length} Leistungen
                      </BodyText>
                    </span>
                    <span className="flex items-center gap-3">
                      <FinePrint>{staffRow.slug}</FinePrint>
                      <span className="rounded-lg border border-[var(--line-strong)] px-3 py-2 text-sm font-semibold">
                        Bearbeiten
                      </span>
                    </span>
                  </summary>

                  <div className="mt-5">
                    <StylistSetupForm
                      stylist={staffRow}
                      services={setupData.serviceOptions}
                    />
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
