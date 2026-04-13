import type { Metadata } from "next";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { BodyText, FinePrint } from "@/components/ui/typography";
import { requireAdmin } from "@/lib/auth/admin-session";
import { getStaffSetupData } from "@/lib/booking/setup-queries";
import { StylistSetupForm } from "../stylisten/_components/stylist-setup-form";

export const metadata: Metadata = {
  title: "Leistungen | Admin | Haarkult-Maintal",
  description: "Geschuetzte Verwaltung fuer Leistungszuordnungen pro Stylistin.",
};

export default async function AdminServicesPage() {
  const admin = await requireAdmin();
  const setupData = await getStaffSetupData();

  return (
    <Section className="pt-14 sm:pt-20 lg:pt-24">
      <Container>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <Heading
            eyebrow="Admin"
            title="Leistungen"
            subtitle="Ordne Leistungen pro Stylistin zu. Jede Karte bleibt geschlossen, bis du sie bearbeitest."
          />
          <div className="text-sm text-zinc-600 dark:text-zinc-300">
            Angemeldet als <span className="font-medium">{admin.email}</span>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-4 text-sm">
          <Link className="underline underline-offset-4" href="/admin">
            Zurueck zum Salon-Setup
          </Link>
          <Link className="underline underline-offset-4" href="/admin/stylisten">
            Stylisten verwalten
          </Link>
        </div>

        <div className="space-y-4">
          {setupData.staff.length === 0 ? (
            <Card className="border-[var(--line-strong)] p-5 sm:p-6">
              <BodyText className="text-zinc-700 dark:text-zinc-300">
                Lege zuerst eine Stylistin oder einen Stylisten an.
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
                    <FinePrint>{staffRow.active ? "Aktiv" : "Inaktiv"}</FinePrint>
                    <span className="mt-2 block text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                      {staffRow.name}
                    </span>
                    <BodyText className="text-zinc-600 dark:text-zinc-300">
                      {staffRow.assignedServices.length} Leistungen zugeordnet
                    </BodyText>
                  </span>
                  <span className="rounded-lg border border-[var(--line-strong)] px-3 py-2 text-sm font-semibold">
                    Leistungen bearbeiten
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
      </Container>
    </Section>
  );
}
