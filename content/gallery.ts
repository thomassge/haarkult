// content/gallery.ts
export type GalleryImage = {
  src: string;
  alt: string;
};

export const gallery: GalleryImage[] = [
  { src: "/gallery/Salon.webp", alt: "Salon" },
  { src: "/gallery/Theke.webp", alt: "Theke" },
  { src: "/gallery/Sortiment.webp", alt: "Sortiment" },
  { src: "/gallery/Haarewaschen.webp", alt: "Haare waschen" },
];
