import type { BookingFallbackAction } from "@/content/site";

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

export type HomeActionKind = BookingFallbackAction | "maps" | "instagram";

export type HomeAction = {
  kind: HomeActionKind;
  label: string;
  variant?: "primary" | "secondary";
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

// Aktionen ohne passende URL in site.ts werden automatisch ausgelassen.
const heroActions: readonly HomeAction[] = [
  { kind: "phone", label: "Anrufen", variant: "secondary" },
  { kind: "whatsapp", label: "WhatsApp", variant: "secondary" },
  { kind: "email", label: "E-Mail", variant: "secondary" },
];

const contactActions: readonly HomeAction[] = [
  { kind: "maps", label: "Route planen", variant: "secondary" },
  { kind: "phone", label: "Anrufen", variant: "secondary" },
  { kind: "email", label: "E-Mail", variant: "secondary" },
  { kind: "instagram", label: "Instagram", variant: "secondary" },
  { kind: "whatsapp", label: "WhatsApp", variant: "secondary" },
];

export const homePage = {
  sections: homeSections,
  actionMessages: {
    whatsapp: "Hi! Ich würde gern einen Termin bei {salonName} machen.",
  },
  hero: {
    eyebrowPrefix: "Friseur in",
    subtitle:
      "Präzise Schnitte, moderne Colorationen und persönliche Beratung in entspannter Salonatmosphäre.",
    hoursTitle: "Öffnungszeiten",
    actions: heroActions,
  } satisfies {
    eyebrowPrefix: string;
    subtitle: string;
    hoursTitle: string;
    actions: readonly HomeAction[];
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
    hoursTitle: "Öffnungszeiten",
    actions: contactActions,
  } satisfies SectionCopy & {
    addressLabel: string;
    hoursTitle: string;
    actions: readonly HomeAction[];
  },
} as const;
