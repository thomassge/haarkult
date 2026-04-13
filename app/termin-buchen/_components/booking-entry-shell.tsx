import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { BodyText, FinePrint } from "@/components/ui/typography";
import type { ResolvedPageAction } from "@/lib/home-page";

type BookingEntryShellProps = {
  brandName: string;
  contactActions: ResolvedPageAction[];
  pageCopy: {
    eyebrow?: string;
    title: string;
    body: string;
    stepsLabel?: string;
    steps?: string[];
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
    <div className="min-h-screen text-[var(--foreground)]">
      <Section className="pt-10 sm:pt-14 lg:pt-16">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.45fr)]">
            <section className="surface-card rounded-lg p-6 sm:p-8">
              {pageCopy.eyebrow ? (
                <FinePrint className="tracking-normal">{pageCopy.eyebrow}</FinePrint>
              ) : null}
              <h1 className="mt-4 text-[28px] font-semibold leading-[1.2] tracking-normal text-[var(--foreground)]">
                {pageCopy.title}
              </h1>
              <p className="mt-4 max-w-2xl text-[16px] leading-[1.5] text-[var(--muted)]">
                {subtitle}
              </p>
              <BodyText className="mt-6 text-[16px] leading-[1.5] text-[var(--muted)]">
                {pageCopy.body}
              </BodyText>
            </section>

            {pageCopy.steps?.length ? (
              <section className="surface-card rounded-lg p-6 sm:p-8">
                <FinePrint className="tracking-normal">
                  {pageCopy.stepsLabel}
                </FinePrint>
                <ul className="mt-5 space-y-3 text-[16px] leading-[1.5] text-[var(--muted)]">
                  {pageCopy.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>

          <section className="surface-card mt-6 rounded-lg p-6 sm:p-8">
            <FinePrint className="tracking-normal">{pageCopy.contactTitle}</FinePrint>
            <p className="mt-3 text-[20px] font-semibold leading-[1.2] tracking-normal text-[var(--foreground)]">
              {brandName}
            </p>
            <BodyText className="mt-2 max-w-2xl text-[16px] leading-[1.5] text-[var(--muted)]">
              {pageCopy.contactBody}
            </BodyText>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {contactActions.map((action) => (
                <Button
                  key={`${action.label}-${action.href}`}
                  href={action.href}
                  variant={action.variant}
                  external={action.external}
                  className="rounded-lg tracking-normal"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </section>
        </Container>
      </Section>
    </div>
  );
}
