import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import type { OpeningHour } from "@/content/site";

type HeroAction = {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
  external?: boolean;
};

type HeroImage = {
  src: string;
  alt: string;
};

type HeroProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  meta: string;
  actions: HeroAction[];
  hoursTitle: string;
  openingHours: OpeningHour[];
  image?: HeroImage;
};

export function Hero({
  eyebrow,
  title,
  subtitle,
  meta,
  actions,
  hoursTitle,
  openingHours,
  image,
}: HeroProps) {
  return (
    <Section className="pt-20 md:pt-28">
      <Container>
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Heading eyebrow={eyebrow} title={title} subtitle={subtitle} />
              <p className="text-sm font-medium tracking-wide text-zinc-500">{meta}</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
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

            <div className="rounded-2xl border border-black/[.08] bg-white p-6 shadow-sm dark:border-white/[.12] dark:bg-zinc-950">
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                {hoursTitle}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-zinc-800 dark:text-zinc-100">
                {openingHours.map((row) => (
                  <li key={row.label} className="flex items-center justify-between">
                    <span className="text-zinc-600 dark:text-zinc-300">{row.label}</span>
                    <span className="font-medium">{row.hours}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-black/[.08] bg-white shadow-sm dark:border-white/[.12] dark:bg-zinc-950">
            <div className="relative aspect-[4/3] w-full">
              {image ? (
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-zinc-100 dark:bg-zinc-900">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Hier kommt ein starkes Salon-Foto rein.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
