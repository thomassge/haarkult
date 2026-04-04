"use client";

import { useState } from "react";
import type { Service, ServiceCategory } from "@/content/services";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Card } from "@/components/ui/card";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/reveal";
import { BodyText, FinePrint } from "@/components/ui/typography";

type ServicesGridProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  categories: ServiceCategory[];
  items: Service[];
};

export function ServicesGrid({
  eyebrow,
  title,
  subtitle,
  categories,
  items,
}: ServicesGridProps) {
  const [openCategory, setOpenCategory] = useState<ServiceCategory | null>(null);
  const getCategoryItemCountLabel = (count: number) =>
    count === 1 ? "1 Leistung" : `${count} Leistungen`;

  return (
    <Section>
      <Container>
        <Reveal>
          <Heading eyebrow={eyebrow} title={title} subtitle={subtitle} />
        </Reveal>

        <div className="mt-12 space-y-4">
          {categories.map((category) => {
            const categoryItems = items.filter((service) => service.category === category);
            if (categoryItems.length === 0) return null;

            return (
              <Reveal key={category} y={18}>
                <details
                  className="surface-card group overflow-hidden rounded-[2rem] p-0 open:border-[var(--line-strong)]"
                  open={openCategory === category}
                >
                  <summary
                    className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 sm:px-7 sm:py-6 [&::-webkit-details-marker]:hidden"
                    onClick={(event) => {
                      event.preventDefault();
                      setOpenCategory((currentCategory) =>
                        currentCategory === category ? null : category
                      );
                    }}
                  >
                    <div className="space-y-2">
                      <FinePrint>{category}</FinePrint>
                      <BodyText className="text-zinc-600 dark:text-zinc-300">
                        {getCategoryItemCountLabel(categoryItems.length)}
                      </BodyText>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                        Details
                      </span>
                      <span
                        aria-hidden
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] bg-white/55 text-lg leading-none text-zinc-700 transition-transform duration-200 ease-out group-open:rotate-45 dark:bg-white/5 dark:text-zinc-200"
                      >
                        +
                      </span>
                    </div>
                  </summary>

                  <div className="border-t border-[var(--line)] px-6 pb-6 pt-6 sm:px-7 sm:pb-7">
                    <StaggerGroup
                      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
                      delayChildren={0.04}
                    >
                      {categoryItems.map((service) => (
                        <StaggerItem key={service.id}>
                          <Card hover className="h-full p-6 sm:p-7">
                            <div className="flex items-start justify-between gap-4">
                              <h4 className="text-lg font-semibold tracking-tight">
                                {service.title}
                              </h4>

                              <div className="flex shrink-0 flex-wrap justify-end gap-2">
                                <span className="rounded-full border border-[var(--line)] bg-black/[0.025] px-3 py-1 text-xs font-semibold text-zinc-700 dark:bg-white/[0.04] dark:text-zinc-200">
                                  {service.priceHint}
                                </span>
                                <span className="rounded-full border border-[var(--line)] bg-white/50 px-3 py-1 text-xs font-medium text-zinc-500 dark:bg-white/[0.03] dark:text-zinc-300">
                                  {service.durationHint}
                                </span>
                              </div>
                            </div>

                            {service.note && (
                              <BodyText className="mt-2 text-xs leading-6 text-zinc-500 dark:text-zinc-400">
                                {service.note}
                              </BodyText>
                            )}

                            <BodyText className="mt-4 text-zinc-600 dark:text-zinc-300">
                              {service.description}
                            </BodyText>
                          </Card>
                        </StaggerItem>
                      ))}
                    </StaggerGroup>
                  </div>
                </details>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
