import Image from "next/image";
import type { TeamMember } from "@/content/team";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";

type TeamGridProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  members: TeamMember[];
};

export function TeamGrid({ eyebrow, title, subtitle, members }: TeamGridProps) {
  return (
    <Section>
      <Container>
        <Heading eyebrow={eyebrow} title={title} subtitle={subtitle} />

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {members.map((member) => (
            <div
              key={member.name}
              className="overflow-hidden rounded-3xl border border-black/[.08] bg-white shadow-sm dark:border-white/[.12] dark:bg-zinc-950"
            >
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 50vw"
                  priority={false}
                />
              </div>

              <div className="p-6">
                <p className="text-lg font-semibold tracking-tight">{member.name}</p>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
