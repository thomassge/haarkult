import Image from "next/image";
import type { GalleryImage } from "@/content/gallery";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";

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

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {images.slice(0, 4).map((image) => (
            <div
              key={image.src}
              className="group overflow-hidden rounded-3xl border border-black/[.08] bg-white shadow-sm transition-transform hover:-translate-y-0.5 dark:border-white/[.12] dark:bg-zinc-950"
            >
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>

              <div className="p-4">
                <p className="text-sm text-zinc-600 dark:text-zinc-300">
                  {image.alt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
