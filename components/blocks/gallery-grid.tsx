import Image from "next/image";
import type { GalleryImage } from "@/content/gallery";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Card } from "@/components/ui/card";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/reveal";

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
  const [leadImage, leftImage, rightImage] = images;
  const supportingImages = [leftImage, rightImage].filter(
    (image): image is GalleryImage => Boolean(image)
  );

  return (
    <Section>
      <Container>
        <Reveal>
          <Heading eyebrow={eyebrow} title={title} subtitle={subtitle} />
        </Reveal>

        <StaggerGroup className="mt-10 space-y-4" delayChildren={0.05}>
          {leadImage ? (
            <StaggerItem>
              <Card hover className="group overflow-hidden p-0">
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={leadImage.src}
                    alt={leadImage.alt}
                    fill
                    className="object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
                    sizes="100vw"
                  />
                </div>
              </Card>
            </StaggerItem>
          ) : null}

          {supportingImages.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {supportingImages.map((image) => (
                <StaggerItem key={image.src}>
                  <Card hover className="group overflow-hidden p-0">
                    <div className="relative aspect-[4/3] w-full">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  </Card>
                </StaggerItem>
              ))}
            </div>
          ) : null}
        </StaggerGroup>
      </Container>
    </Section>
  );
}
