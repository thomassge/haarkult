import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow, FinePrint, Lead } from "@/components/ui/typography";

type LegalLink = {
  href: string;
  label: string;
};

type LegalPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  updatedAt?: string;
  links: readonly LegalLink[];
  sidebar: React.ReactNode;
  children: React.ReactNode;
};

type LegalSectionProps = {
  title: string;
  children: React.ReactNode;
};

export function LegalPage({
  eyebrow,
  title,
  intro,
  updatedAt,
  links,
  sidebar,
  children,
}: LegalPageProps) {
  return (
    <div className="relative min-h-screen overflow-hidden text-zinc-950 dark:text-zinc-50">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(circle_at_top_left,rgba(248,242,233,0.92),transparent_42%),radial-gradient(circle_at_top_right,rgba(217,198,168,0.45),transparent_28%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(89,68,47,0.24),transparent_32%),radial-gradient(circle_at_top_right,rgba(72,56,40,0.22),transparent_26%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-56 -z-10 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-white/25 blur-3xl dark:bg-white/[0.03]"
      />

      <main>
        <Section className="pt-10 sm:pt-14 lg:pt-16">
          <Container className="space-y-8">
            <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-600 dark:text-zinc-300">
              {links.map((link) => (
                <Link
                  key={link.href}
                  className="rounded-full border border-[var(--line)] bg-white/50 px-4 py-2 transition hover:border-[var(--line-strong)] hover:text-zinc-950 dark:bg-white/[0.03] dark:hover:text-zinc-50"
                  href={link.href}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-12">
              <div className="space-y-5 lg:sticky lg:top-10 lg:self-start">
                <Eyebrow>{eyebrow}</Eyebrow>
                <h1 className="text-4xl font-semibold leading-[0.95] tracking-[-0.05em] text-zinc-950 sm:text-5xl dark:text-zinc-50">
                  {title}
                </h1>
                <Lead>{intro}</Lead>
                {updatedAt ? <FinePrint>{updatedAt}</FinePrint> : null}
                {sidebar}
              </div>

              <Card padded className="space-y-10 sm:space-y-12">
                {children}
              </Card>
            </div>
          </Container>
        </Section>
      </main>
    </div>
  );
}

export function LegalSection({ title, children }: LegalSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-[-0.04em] text-zinc-950 dark:text-zinc-50">
        {title}
      </h2>
      <div className="space-y-4 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
        {children}
      </div>
    </section>
  );
}
