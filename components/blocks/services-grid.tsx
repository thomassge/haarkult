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
  return (
    <Section>
      <Container>
        <Reveal>
          <Heading eyebrow={eyebrow} title={title} subtitle={subtitle} />
        </Reveal>

        <div className="mt-12 space-y-14">
          {categories.map((category) => {
            const categoryItems = items.filter((service) => service.category === category);
            if (categoryItems.length === 0) return null;

            return (
              <div key={category} className="space-y-5">
                <Reveal y={18}>
                  <FinePrint>{category}</FinePrint>
                </Reveal>

                <StaggerGroup className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" delayChildren={0.04}>
                  {categoryItems.map((service) => (
                    <StaggerItem key={service.id}>
                      <Card
                        hover
                        className="h-full p-6 sm:p-7"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <h4 className="text-lg font-semibold tracking-tight">
                            {service.title}
                          </h4>
                          <span className="rounded-full border border-[var(--line)] bg-black/[0.025] px-3 py-1 text-xs font-semibold text-zinc-700 dark:bg-white/[0.04] dark:text-zinc-200">
                            {service.priceHint}
                          </span>
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
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
