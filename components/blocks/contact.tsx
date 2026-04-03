import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BodyText, FinePrint } from "@/components/ui/typography";
import type { OpeningHour } from "@/content/site";

type ContactAction = {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
  external?: boolean;
};

type ContactBlockProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  addressLabel: string;
  siteName: string;
  addressLine: string;
  actions: ContactAction[];
  hoursTitle: string;
  openingHours: OpeningHour[];
};

export function ContactBlock({
  eyebrow,
  title,
  subtitle,
  addressLabel,
  siteName,
  addressLine,
  actions,
  hoursTitle,
  openingHours,
}: ContactBlockProps) {
  return (
    <Section className="pb-24">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-12">
          <Heading eyebrow={eyebrow} title={title} subtitle={subtitle} />

          <Card padded>
            <div className="space-y-2">
              <FinePrint>{addressLabel}</FinePrint>
              <p className="text-xl font-semibold tracking-[-0.03em]">{siteName}</p>
              <BodyText className="text-zinc-600 dark:text-zinc-300">{addressLine}</BodyText>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {actions.map((action) => (
                <Button
                  key={`${action.label}-${action.href}`}
                  href={action.href}
                  variant={action.variant}
                  external={action.external}
                >
                  {action.label}
                </Button>
              ))}
            </div>

            <div className="mt-8 border-t border-[var(--line)] pt-6">
              <FinePrint>{hoursTitle}</FinePrint>
              <ul className="mt-3 space-y-2 text-sm">
                {openingHours.map((row) => (
                  <li key={row.label} className="flex justify-between">
                    <span className="text-zinc-600 dark:text-zinc-300">
                      {row.label}
                    </span>
                    <span className="font-medium">{row.hours}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
