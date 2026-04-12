import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { BodyText, FinePrint } from "@/components/ui/typography";

export type AdminDashboardCard = {
  title: string;
  description: string;
  href: string;
  status?: string;
};

export const adminDashboardCards: AdminDashboardCard[] = [
  {
    title: "Stylisten",
    description: "Aktive Mitarbeitende verwalten, die Termine annehmen.",
    href: "/admin/stylisten",
  },
  {
    title: "Leistungen",
    description: "Leistungen direkt pro Stylistin oder Stylist zuordnen.",
    href: "/admin/stylisten",
  },
  {
    title: "Arbeitszeiten",
    description: "Regelmaessige Wochenzeiten fuer die spaetere Verfuegbarkeit pflegen.",
    href: "/admin/zeiten",
  },
  {
    title: "Abwesenheiten",
    description: "Urlaub, Pausen und Sperrzeiten fuer einzelne Tage eintragen.",
    href: "/admin/ausnahmen",
  },
];

type AdminShellProps = {
  title: string;
  subtitle: string;
  adminEmail: string;
  cards?: AdminDashboardCard[];
  setupStatus?: React.ReactNode;
};

export function AdminShell({
  title,
  subtitle,
  adminEmail,
  cards = adminDashboardCards,
  setupStatus,
}: AdminShellProps) {
  return (
    <Section className="pt-14 sm:pt-20 lg:pt-24">
      <Container>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <Heading eyebrow="Admin" title={title} subtitle={subtitle} />
          <div className="text-sm text-zinc-600 dark:text-zinc-300">
            Angemeldet als <span className="font-medium">{adminEmail}</span>
          </div>
        </div>

        {setupStatus ? <div className="mb-6">{setupStatus}</div> : null}

        <div className="grid gap-4 md:grid-cols-2">
          {cards.map((card) => (
            <Link key={`${card.title}-${card.href}`} href={card.href} className="group block">
              <Card
                className="h-full border-[var(--line-strong)] transition-colors group-hover:border-zinc-900 dark:group-hover:border-zinc-100"
                padded
              >
                <FinePrint>Setup</FinePrint>
                <h2 className="mt-3 text-xl font-semibold text-zinc-950 dark:text-zinc-50">
                  {card.title}
                </h2>
                <BodyText className="mt-3 text-zinc-700 dark:text-zinc-300">
                  {card.description}
                </BodyText>
                {card.status ? (
                  <div className="mt-4 text-sm text-zinc-600 dark:text-zinc-300">
                    {card.status}
                  </div>
                ) : null}
                <div className="mt-6 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  Oeffnen
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-sm text-zinc-600 dark:text-zinc-300">
          <Link className="underline underline-offset-4" href="/">
            Zurueck zur Website
          </Link>
        </div>
      </Container>
    </Section>
  );
}
