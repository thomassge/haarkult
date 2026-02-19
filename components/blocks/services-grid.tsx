import { services, serviceCategoryOrder } from "@/content/services";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";

export function ServicesGrid() {
  return (
    <Section>
      <Container>
        <Heading
          eyebrow="Leistungen"
          title="Preise & Services"
          subtitle="Transparent und klar – Details gern telefonisch oder per WhatsApp."
        />

        <div className="mt-10 space-y-12">
          {serviceCategoryOrder.map((cat) => {
            const items = services.filter((s) => s.category === cat);
            if (items.length === 0) return null;

            return (
              <div key={cat}>
                <h3 className="text-sm font-medium tracking-wide text-zinc-500">
                  {cat}
                </h3>

                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((s) => (
                    <div
                      key={s.id}
                      className="rounded-2xl border border-black/[.08] bg-white p-6 shadow-sm transition-transform hover:-translate-y-0.5 dark:border-white/[.12] dark:bg-zinc-950"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <h4 className="text-lg font-semibold tracking-tight">
                          {s.title}
                        </h4>
                        <span className="rounded-full border border-black/[.10] px-3 py-1 text-xs font-medium text-zinc-700 dark:border-white/[.14] dark:text-zinc-200">
                          {s.priceHint}
                        </span>
                      </div>

                      {s.note && (
                        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                          {s.note}
                        </p>
                      )}

                      <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                        {s.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
