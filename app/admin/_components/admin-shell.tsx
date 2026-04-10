import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { BodyText, FinePrint } from "@/components/ui/typography";

type AdminShellProps = {
  title: string;
  subtitle: string;
  nextSteps: string[];
};

export function AdminShell({
  title,
  subtitle,
  nextSteps,
}: AdminShellProps) {
  return (
    <Section className="pt-14 sm:pt-20 lg:pt-24">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <Card
            className="border-[var(--line-strong)] shadow-[var(--shadow-strong)]"
            padded
          >
            <Heading
              eyebrow="Admin"
              title={title}
              subtitle={subtitle}
            />
            <BodyText className="mt-6 text-zinc-700 dark:text-zinc-300">
              Dieser Bereich bleibt bewusst getrennt von der Broschuere. Die
              naechsten Schritte sind Login, Rollenpruefung und die
              saloninterne Terminverwaltung.
            </BodyText>
          </Card>

          <Card padded>
            <FinePrint>Naechste Ausbaustufen</FinePrint>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
              {nextSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>

            <div className="mt-6 text-sm text-zinc-600 dark:text-zinc-300">
              <Link className="underline underline-offset-4" href="/">
                Zurueck zur Website
              </Link>
            </div>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
