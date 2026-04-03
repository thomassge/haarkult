import Image from "next/image";
import type { TeamMember } from "@/content/team";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Card } from "@/components/ui/card";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/reveal";
import { BodyText } from "@/components/ui/typography";

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
        <Reveal>
          <Heading eyebrow={eyebrow} title={title} subtitle={subtitle} />
        </Reveal>

        <StaggerGroup className="mt-10 grid gap-6 sm:grid-cols-2" delayChildren={0.05}>
          {members.map((member) => (
            <StaggerItem key={member.name}>
              <Card
                hover
                className="group overflow-hidden p-0"
              >
                <div className="relative aspect-[4/5] w-full">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, 50vw"
                    priority={false}
                  />
                </div>

                <div className="p-6 sm:p-7">
                  <p className="text-xl font-semibold tracking-[-0.03em]">{member.name}</p>
                  <BodyText className="mt-2 text-zinc-600 dark:text-zinc-300">
                    {member.role}
                  </BodyText>
                </div>
              </Card>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </Section>
  );
}
