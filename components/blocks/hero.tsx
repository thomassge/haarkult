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
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(26rem,0.95fr)] lg:items-center lg:gap-12">
          <div className="space-y-8 lg:space-y-10">
            <Reveal className="space-y-4" y={18}>
              {logo ? (
                <div className="inline-flex rounded-[1.4rem] border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3 shadow-[var(--shadow-soft)]">
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={160}
                    height={56}
                    className="h-9 w-auto object-contain sm:h-10"
                    priority
                  />
                </div>
              ) : null}
              <Heading eyebrow={eyebrow} title={title} subtitle={subtitle} size="hero" />
              <BodyText className="text-sm font-medium tracking-[0.02em] text-zinc-500 dark:text-zinc-400">
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

            <Reveal delay={0.16} y={22}>
              <Card className="max-w-xl" padded>
                <FinePrint>{hoursTitle}</FinePrint>
                <ul className="mt-5 space-y-3 text-sm text-zinc-800 dark:text-zinc-100">
                  {openingHours.map((row) => (
                    <li key={row.label} className="flex items-center justify-between">
                      <span className="text-zinc-600 dark:text-zinc-300">{row.label}</span>
                      <span className="font-medium tracking-[-0.01em]">{row.hours}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          </div>

          <Reveal delay={0.12} x={28} y={18} scale={0.985}>
            <Card className="relative overflow-hidden rounded-[2.25rem]">
              <div className="relative aspect-[4/3] w-full">
                {image ? (
                  <>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/35" />
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center bg-zinc-100 dark:bg-zinc-900">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Hier kommt ein starkes Salon-Foto rein.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
