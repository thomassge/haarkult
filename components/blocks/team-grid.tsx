import Image from "next/image";
import { team } from "@/content/team";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";

export function TeamGrid() {
  return (
    <Section>
      <Container>
        <Heading
          eyebrow="Team"
          title="Wir sind Haarkult"
          subtitle="Persönlich, ehrlich, professionell – mit Blick fürs Detail."
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {team.map((m) => (
            <div
              key={m.name}
              className="overflow-hidden rounded-3xl border border-black/[.08] bg-white shadow-sm dark:border-white/[.12] dark:bg-zinc-950"
            >
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={m.image}
                  alt={m.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 50vw"
                  priority={false}
                />
              </div>

              <div className="p-6">
                <p className="text-lg font-semibold tracking-tight">{m.name}</p>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                  {m.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
