import Image from "next/image";
import type { GalleryImage } from "@/content/gallery";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Card } from "@/components/ui/card";
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
        <Heading eyebrow={eyebrow} title={title} subtitle={subtitle} />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {images.slice(0, 4).map((image) => (
            <Card
              key={image.src}
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
                <BodyText className="text-sm">
                  {image.alt}
                </BodyText>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
