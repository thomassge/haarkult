import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
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
        <div className="grid gap-10 md:grid-cols-2 md:items-start">
          <Heading eyebrow={eyebrow} title={title} subtitle={subtitle} />

          <div className="rounded-3xl border border-black/[.08] bg-white p-6 shadow-sm dark:border-white/[.12] dark:bg-zinc-950">
            <div className="space-y-2">
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                {addressLabel}
              </p>
              <p className="text-base font-semibold tracking-tight">{siteName}</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">{addressLine}</p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
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

            <div className="mt-8 border-t border-black/[.08] pt-6 dark:border-white/[.12]">
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                {hoursTitle}
              </p>
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
          </div>
        </div>
      </Container>
    </Section>
  );
}
