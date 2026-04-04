import Image from "next/image";
import type { GalleryImage } from "@/content/gallery";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Card } from "@/components/ui/card";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/reveal";
import { BodyText } from "@/components/ui/typography";

type GalleryGridProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  images: GalleryImage[];
};

export function GalleryGrid({
  eyebrow,
  title,
  subtitle,
  images,
}: GalleryGridProps) {
  return (
    <Section>
      <Container>
        <Reveal>
          <Heading eyebrow={eyebrow} title={title} subtitle={subtitle} />
        </Reveal>

        <StaggerGroup className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" delayChildren={0.05}>
          {images.slice(0, 4).map((image) => (
            <StaggerItem key={image.src}>
              <Card
                hover
                className="group overflow-hidden p-0"
              >
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>

                <div className="p-5">
                  <BodyText className="text-zinc-600 dark:text-zinc-300">
                    {image.alt}
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
