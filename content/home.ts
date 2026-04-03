type SectionCopy = {
  eyebrow: string;
  title: string;
  subtitle: string;
};

export const homeSectionIds = ["hero", "services", "team", "gallery", "contact"] as const;

export type HomeSectionId = (typeof homeSectionIds)[number];

export type HomeSection = {
  id: HomeSectionId;
  enabled?: boolean;
};

// Reihenfolge steuert die Homepage; mit enabled: false kann ein Block ausgeblendet werden.
const homeSections: readonly HomeSection[] = [
  { id: "hero" },
  { id: "services" },
  { id: "team" },
  { id: "gallery" },
  { id: "contact" },
];

export const homePage = {
  sections: homeSections,
  hero: {
    eyebrowPrefix: "Friseur in",
    subtitle:
      "Präzise Schnitte, moderne Colorationen und persönliche Beratung in entspannter Salonatmosphäre.",
    primaryActionLabel: "Anrufen",
    secondaryActionLabel: "WhatsApp",
    hoursTitle: "Öffnungszeiten",
    image: {
      src: "/brand/haarkult-titelbild.png",
      alt: "Innenansicht des Salons Haarkult-Maintal",
    },
  },
  services: {
    eyebrow: "Leistungen",
    title: "Preise & Services",
    subtitle: "Transparent und klar - Details gern telefonisch oder per WhatsApp.",
  } satisfies SectionCopy,
  team: {
    eyebrow: "Team",
    title: "Wir sind Haarkult",
    subtitle: "Persönlich, ehrlich, professionell - mit Blick fürs Detail.",
  } satisfies SectionCopy,
  gallery: {
    eyebrow: "Salon",
    title: "Ein Blick ins Haarkult",
    subtitle: "Atmosphäre, Details und das Gefühl vor Ort.",
  } satisfies SectionCopy,
  contact: {
    eyebrow: "Kontakt",
    title: "So erreichst du uns",
    subtitle: "Ruf an, schreib uns oder lass dich direkt per Maps führen.",
    addressLabel: "Adresse",
    mapsActionLabel: "Route planen",
    phoneActionLabel: "Anrufen",
    whatsappActionLabel: "WhatsApp",
    hoursTitle: "Öffnungszeiten",
  } satisfies SectionCopy & {
    addressLabel: string;
    mapsActionLabel: string;
    phoneActionLabel: string;
    whatsappActionLabel: string;
    hoursTitle: string;
  },
} as const;
