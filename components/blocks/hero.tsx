import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { BodyText, FinePrint } from "@/components/ui/typography";
import type { BrandAsset, OpeningHour } from "@/content/site";

type HeroAction = {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
  external?: boolean;
};

type HeroProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  meta: string;
  actions: HeroAction[];
  hoursTitle: string;
  openingHours: OpeningHour[];
  logo?: BrandAsset | null;
  image?: BrandAsset | null;
};

export function Hero({
  eyebrow,
  title,
  subtitle,
  meta,
  actions,
  hoursTitle,
  openingHours,
  logo,
  image,
}: HeroProps) {
  return (
    <Section className="pt-10 sm:pt-14 lg:pt-20">
      <Container>
        <div className="relative overflow-hidden rounded-[2.5rem] border border-[var(--line)] shadow-[var(--shadow-strong)]">
          {image ? (
            <>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority
                className="object-cover object-center brightness-[1.04] saturate-[1.02]"
                sizes="100vw"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(180deg,rgba(251,248,243,0.84)_0%,rgba(246,241,232,0.7)_34%,rgba(246,241,232,0.34)_68%,rgba(246,241,232,0.12)_100%)] lg:bg-[linear-gradient(90deg,rgba(251,248,243,0.94)_0%,rgba(246,241,232,0.8)_34%,rgba(246,241,232,0.42)_58%,rgba(246,241,232,0.12)_100%)] dark:bg-[linear-gradient(180deg,rgba(10,8,6,0.64)_0%,rgba(10,8,6,0.48)_38%,rgba(10,8,6,0.28)_72%,rgba(10,8,6,0.12)_100%)] dark:lg:bg-[linear-gradient(90deg,rgba(10,8,6,0.76)_0%,rgba(10,8,6,0.58)_35%,rgba(10,8,6,0.3)_60%,rgba(10,8,6,0.1)_100%)]"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.28),transparent_32%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_28%)]"
              />
            </>
          ) : (
            <div className="absolute inset-0 bg-[linear-gradient(180deg,#fbf8f3_0%,#f4eee5_100%)] dark:bg-[linear-gradient(180deg,#100d0a_0%,#0d0b09_100%)]" />
          )}

          <div className="relative z-10 grid min-h-[34rem] gap-8 px-6 py-8 sm:px-8 sm:py-10 lg:min-h-[38rem] lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.48fr)] lg:items-end lg:px-10 lg:py-12 xl:px-14">
            <div className="space-y-8 lg:max-w-[38rem] lg:self-center lg:space-y-10">
              <Reveal className="space-y-4" y={18}>
                {logo ? (
                  <div className="inline-flex rounded-[1.4rem] border border-black/60 bg-black px-4 py-3 shadow-[var(--shadow-soft)]">
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      width={220}
                      height={147}
                      className="h-12 w-auto object-contain sm:h-14"
                      priority
                    />
                  </div>
                ) : null}
                <Heading eyebrow={eyebrow} title={title} subtitle={subtitle} size="hero" />
                <BodyText className="text-sm font-medium tracking-[0.02em] text-zinc-600 dark:text-zinc-300">
                  {meta}
                </BodyText>
              </Reveal>

              <Reveal className="flex flex-col gap-3 sm:flex-row sm:flex-wrap" delay={0.08} y={20}>
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
              </Reveal>
            </div>

            <Reveal delay={0.16} y={22} className="lg:justify-self-end">
              <Card className="max-w-sm bg-white/72 backdrop-blur-md dark:bg-black/35" padded>
                <FinePrint>{hoursTitle}</FinePrint>
                <ul className="mt-5 space-y-3 text-sm text-zinc-800 dark:text-zinc-100">
                  {openingHours.map((row) => (
                    <li key={row.label} className="flex items-center justify-between gap-6">
                      <span className="text-zinc-600 dark:text-zinc-300">{row.label}</span>
                      <span className="font-medium tracking-[-0.01em]">{row.hours}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
