import type { Metadata } from "next";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { BodyText, FinePrint } from "@/components/ui/typography";
import { requireAdmin } from "@/lib/auth/admin-session";
import { deleteAvailabilityExceptionAction } from "@/lib/booking/setup-actions";
import { getAvailabilityExceptionSetupData } from "@/lib/booking/setup-queries";
import { AvailabilityExceptionForm } from "./_components/availability-exception-form";

export const metadata: Metadata = {
  title: "Abwesenheiten | Admin | Haarkult-Maintal",
  description: "Geschuetzte Verwaltung fuer Urlaub, Pausen und Sperrzeiten.",
};

const exceptionLabelByType = {
  vacation: "Urlaub",
  break: "Pause",
  blocked: "Blockierte Zeit",
};

function formatWindow(date: Date) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Berlin",
  }).format(date);
}

export default async function AdminAvailabilityExceptionsPage() {
  const admin = await requireAdmin();
  const setupData = await getAvailabilityExceptionSetupData();
  const staffNameById = new Map(setupData.staff.map((staffRow) => [staffRow.id, staffRow.name]));

  return (
    <Section className="pt-14 sm:pt-20 lg:pt-24">
      <Container>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <Heading
            eyebrow="Admin"
            title="Abwesenheiten"
            subtitle="Pflege optionale Ausnahmen, die spaeter normale Arbeitszeiten ueberschreiben."
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

        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <Card className="border-[var(--line-strong)] p-5 sm:p-6">
            <FinePrint>Optional</FinePrint>
            <h2 className="mt-3 text-xl font-semibold text-zinc-950 dark:text-zinc-50">
              Ausnahme eintragen
            </h2>
            <BodyText className="mt-3 text-zinc-700 dark:text-zinc-300">
              Urlaub, Pause oder Blockierte Zeit fuer einzelne Personen eintragen.
              Ganztaegig nutzt den lokalen Kalendertag in Europe/Berlin.
            </BodyText>
            <div className="mt-6">
              <AvailabilityExceptionForm staff={setupData.staff} />
            </div>
          </Card>

          <div className="space-y-4">
            <div>
              <FinePrint>Aktuell</FinePrint>
              <h2 className="mt-3 text-xl font-semibold text-zinc-950 dark:text-zinc-50">
                Gespeicherte Ausnahmen
              </h2>
            </div>

            {setupData.exceptions.length === 0 ? (
              <Card className="border-[var(--line-strong)] p-5 sm:p-6">
                <BodyText className="text-zinc-700 dark:text-zinc-300">
                  Noch keine Ausnahmen eingetragen. Das Setup kann trotzdem bereit sein.
                </BodyText>
              </Card>
            ) : (
              setupData.exceptions.map((exception) => (
                <Card key={exception.id} className="border-[var(--line-strong)] p-5 sm:p-6">
                  <FinePrint>{exceptionLabelByType[exception.type]}</FinePrint>
                  <h3 className="mt-3 text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                    {exception.label ||
                      staffNameById.get(exception.staffId) ||
                      "Stylistin oder Stylist"}
                  </h3>
                  <BodyText className="mt-2 text-zinc-700 dark:text-zinc-300">
                    {staffNameById.get(exception.staffId) ?? "Unbekannte Person"} -{" "}
                    {exception.allDay
                      ? `${formatWindow(exception.startAt)} bis ${formatWindow(exception.endAt)} - Ganztaegig`
                      : `${formatWindow(exception.startAt)} bis ${formatWindow(exception.endAt)}`}
                  </BodyText>
                  {exception.notes ? (
                    <BodyText className="mt-2 text-zinc-600 dark:text-zinc-300">
                      {exception.notes}
                    </BodyText>
                  ) : null}
                  <form action={deleteAvailabilityExceptionAction} className="mt-4">
                    <input name="id" type="hidden" value={exception.id} />
                    <button
                      className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-[var(--line-strong)] px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:border-zinc-900 sm:w-auto dark:text-zinc-100 dark:hover:border-zinc-100"
                      type="submit"
                    >
                      Loeschen
                    </button>
                  </form>
                </Card>
              ))
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
