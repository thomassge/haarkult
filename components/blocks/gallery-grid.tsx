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
  const [primaryImage, secondaryImage, tertiaryImage] = images;
  const sideImages = [secondaryImage, tertiaryImage].filter(
    (image): image is GalleryImage => Boolean(image)
  );

  return (
    <Section>
      <Container>
        <Reveal>
          <Heading eyebrow={eyebrow} title={title} subtitle={subtitle} />
        </Reveal>

        <StaggerGroup
          className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]"
          delayChildren={0.05}
        >
          {primaryImage ? (
            <StaggerItem>
              <Card hover className="group h-full overflow-hidden p-0">
                <div className="relative aspect-[4/5] min-h-[18rem] w-full sm:aspect-[5/4] lg:min-h-[36rem] lg:aspect-auto">
                  <Image
                    src={primaryImage.src}
                    alt={primaryImage.alt}
                    fill
                    className="object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 100vw, 58vw"
                  />
                </div>
              </Card>
            </StaggerItem>
          ) : null}

          <div className="grid gap-4">
            {sideImages.map((image) => (
              <StaggerItem key={image.src}>
                <Card hover className="group overflow-hidden p-0">
                  <div className="relative aspect-[16/10] min-h-[14rem] w-full sm:aspect-[16/9] lg:min-h-[17.5rem]">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
                      sizes="(max-width: 1024px) 100vw, 42vw"
                    />
                  </div>
                </Card>
              </StaggerItem>
            ))}
          </div>
        </StaggerGroup>
      </Container>
    </Section>
  );
}
