// content/gallery.ts
export type GalleryImage = {
  src: string;
  alt: string;
};

export const gallery: GalleryImage[] = [
  { src: "/gallery/Salon.png", alt: "Salon" },
  { src: "/gallery/Theke.png", alt: "Theke" },
  { src: "/gallery/Sortiment.png", alt: "Sortiment" },
  { src: "/gallery/Haarewaschen.png", alt: "Haare waschen" },
];
