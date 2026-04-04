// content/gallery.ts
export type GalleryImage = {
  src: string;
  fallbackSrc?: string;
  alt: string;
};

export const gallery: GalleryImage[] = [
  { src: "/gallery/Salon.png", alt: "Salon" },
  { src: "/gallery/Theke.webp", fallbackSrc: "/gallery/Theke.png", alt: "Theke" },
  { src: "/gallery/Sortiment.webp", fallbackSrc: "/gallery/Sortiment.png", alt: "Sortiment" },
  { src: "/gallery/Haarewaschen.webp", fallbackSrc: "/gallery/Haarewaschen.png", alt: "Haare waschen" },
];
