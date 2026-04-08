export type ServiceCategory = "Damen" | "Herren" | "Jugend" | "Kinder" | "Beauty";

export type ServiceBookingConfig = {
  onlineBookable: boolean;
  durationMinutes: number;
  priceLabel: string;
};

export type Service = {
  id: string;
  category: ServiceCategory;
  title: string;
  description: string;
  booking: ServiceBookingConfig;
  priceHint: string; // z.B. "22 €" oder "ab 26 €" oder "20-35 €"
  durationHint: string; // z.B. "30 Min." oder "60 Min."
  note?: string; // z.B. "ab Schulter +15 €"
};

type ServiceDefinition = Omit<Service, "priceHint" | "durationHint">;

function defineBooking(
  durationMinutes: number,
  priceLabel: string,
  onlineBookable = true
): ServiceBookingConfig {
  return {
    onlineBookable,
    durationMinutes,
    priceLabel,
  };
}

function createService(service: ServiceDefinition): Service {
  return {
    ...service,
    priceHint: service.booking.priceLabel,
    durationHint: `${service.booking.durationMinutes} Min.`,
  };
}

export const serviceCategoryOrder: ServiceCategory[] = [
  "Damen",
  "Herren",
  "Jugend",
  "Kinder",
  "Beauty",
];

export const services: Service[] = [
  // Damen
  createService({
    id: "damen-neuschnitt",
    category: "Damen",
    title: "Neuschnitt",
    description: "Kompletter Neuaufbau des Looks inkl. Beratung und präzisem Finish.",
    booking: defineBooking(60, "40 €"),
    note: "ab Schulter +15 €",
  }),
  createService({
    id: "damen-haarschnitt",
    category: "Damen",
    title: "Haarschnitt",
    description: "Klassischer Schnitt mit sauberer Kontur - passend zu Haar und Gesichtsform.",
    booking: defineBooking(45, "ab 26 €"),
    note: "ab Schulter +15 €",
  }),
  createService({
    id: "damen-foehnen",
    category: "Damen",
    title: "Föhnen",
    description: "Volumen und Form - je nach Wunsch glatt, Wellen oder natürlicher Blowout.",
    booking: defineBooking(45, "ab 27 €"),
  }),
  createService({
    id: "damen-farbe-foehnen",
    category: "Damen",
    title: "Farbe + Föhnen",
    description: "Ansatz oder Komplettfarbe für frische Tiefe und Glanz - inkl. Styling.",
    booking: defineBooking(120, "70 €"),
  }),
  createService({
    id: "damen-inoa-foehnen",
    category: "Damen",
    title: "Inoa + Föhnen",
    description: "Sanfte, hochwertige Coloration mit Inoa für ein gleichmäßiges Farbergebnis - inkl. Styling.",
    booking: defineBooking(120, "75 €"),
  }),
  createService({
    id: "damen-straehnen",
    category: "Damen",
    title: "Strähnen",
    description: "Highlights und Dimension für mehr Struktur und Lichtreflexe im Haar.",
    booking: defineBooking(180, "ab 60 €"),
  }),
  createService({
    id: "damen-glossing",
    category: "Damen",
    title: "Glossing",
    description: "Glanz, Tonauffrischung und harmonische Nuancen - ideal nach Farbe oder Strähnen.",
    booking: defineBooking(30, "20-35 €"),
  }),
  createService({
    id: "damen-toenung",
    category: "Damen",
    title: "Tönung",
    description: "Schonende Farbauffrischung oder dezente Veränderung - natürliches Ergebnis.",
    booking: defineBooking(90, "ab 46 €"),
  }),
  createService({
    id: "damen-painting",
    category: "Damen",
    title: "Painting",
    description: "Freihand-Technik für weiche Übergänge und einen modernen, natürlichen Look.",
    booking: defineBooking(210, "ab 50 €"),
  }),
  createService({
    id: "damen-dauerwelle",
    category: "Damen",
    title: "Dauerwelle",
    description: "Locken oder Bewegung mit Struktur - von soft bis definierter.",
    booking: defineBooking(120, "75 €"),
  }),

  // Herren
  createService({
    id: "herren-haarschnitt-trocken",
    category: "Herren",
    title: "Haarschnitt (trocken)",
    description: "Schnell und sauber: Schnitt und Konturen ohne Waschen.",
    booking: defineBooking(30, "22 €"),
  }),
  createService({
    id: "herren-haarschnitt-waschen-foehnen",
    category: "Herren",
    title: "Haarschnitt + Waschen/Föhnen",
    description: "Mit Waschen und Styling für ein rundes Finish.",
    booking: defineBooking(45, "29 €"),
  }),
  createService({
    id: "herren-maschinenschnitt",
    category: "Herren",
    title: "Maschinenschnitt",
    description: "Gleichmäßige Länge - clean und unkompliziert.",
    booking: defineBooking(20, "15 €"),
  }),
  createService({
    id: "herren-bartschnitt",
    category: "Herren",
    title: "Bartschnitt",
    description: "Konturen und Form, passend zum Gesicht - gepflegt und präzise.",
    booking: defineBooking(15, "8 €"),
  }),

  // Jugend (ab 14)
  createService({
    id: "jugend-haarschnitt-waschen-foehnen",
    category: "Jugend",
    title: "Haarschnitt + Waschen/Föhnen (ab 14)",
    description: "Schnitt mit Waschen und Styling - modern und alltagstauglich.",
    booking: defineBooking(45, "ab 25 €"),
  }),
  createService({
    id: "jugend-haarschnitt-trocken",
    category: "Jugend",
    title: "Haarschnitt (trocken, ab 14)",
    description: "Kurz und sauber - ideal für schnelle Termine.",
    booking: defineBooking(30, "17 €"),
  }),

  // Kinder
  createService({
    id: "kinder-haarschnitt",
    category: "Kinder",
    title: "Kinderhaarschnitt",
    description: "Kinderfreundlich und entspannt - mit Geduld und sauberem Ergebnis.",
    booking: defineBooking(30, "ab 15 €"),
  }),

  // Beauty (Wimpern/Augenbrauen)
  createService({
    id: "beauty-wimpern-faerben",
    category: "Beauty",
    title: "Wimpern färben",
    description: "Mehr Ausdruck ohne Mascara - natürliches, klares Ergebnis.",
    booking: defineBooking(10, "15 €"),
  }),
  createService({
    id: "beauty-augenbrauen-faerben",
    category: "Beauty",
    title: "Augenbrauen färben",
    description: "Mehr Definition und ein stimmiger Rahmen fürs Gesicht.",
    booking: defineBooking(10, "10 €"),
  }),
  createService({
    id: "beauty-augenbrauen-zupfen",
    category: "Beauty",
    title: "Augenbrauen zupfen",
    description: "Saubere Form, die zu deinem Gesicht passt.",
    booking: defineBooking(10, "7 €"),
  }),
];
