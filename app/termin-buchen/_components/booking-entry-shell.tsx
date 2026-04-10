import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { BodyText, FinePrint } from "@/components/ui/typography";
import type { ResolvedPageAction } from "@/lib/home-page";

type BookingEntryShellProps = {
  brandName: string;
  contactActions: ResolvedPageAction[];
  pageCopy: {
    eyebrow: string;
    title: string;
    body: string;
    stepsLabel: string;
    steps: string[];
    contactTitle: string;
    contactBody: string;
  };
  subtitle: string;
};

export function BookingEntryShell({
  brandName,
  contactActions,
  pageCopy,
  subtitle,
}: BookingEntryShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden text-zinc-950 dark:text-zinc-50">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[30rem] bg-[radial-gradient(circle_at_top_left,rgba(248,242,233,0.92),transparent_42%),radial-gradient(circle_at_top_right,rgba(217,198,168,0.48),transparent_28%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(89,68,47,0.24),transparent_32%),radial-gradient(circle_at_top_right,rgba(72,56,40,0.22),transparent_26%)]"
      />
      <Section className="pt-14 sm:pt-20 lg:pt-24">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <Card
              className="relative overflow-hidden border-[var(--line-strong)] shadow-[var(--shadow-strong)]"
              padded
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.34),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.08),transparent_38%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_34%)]"
              />
              <div className="relative">
                <Heading
                  eyebrow={pageCopy.eyebrow}
                  title={pageCopy.title}
                  subtitle={subtitle}
                />

                <BodyText className="mt-6 text-zinc-700 dark:text-zinc-300">
                  {pageCopy.body}
                </BodyText>
              </div>
            </Card>

            <Card padded>
              <FinePrint>{pageCopy.stepsLabel}</FinePrint>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                {pageCopy.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </Card>
          </div>

          <Card className="mt-6" padded>
            <FinePrint>{pageCopy.contactTitle}</FinePrint>
            <p className="mt-3 text-xl font-semibold tracking-[-0.03em] text-zinc-950 dark:text-zinc-50">
              {brandName}
            </p>
            <BodyText className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-300">
              {pageCopy.contactBody}
            </BodyText>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {contactActions.map((action) => (
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
          </Card>
        </Container>
      </Section>
    </div>
  );
}
