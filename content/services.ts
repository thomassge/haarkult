export type ServiceCategory = "Damen" | "Herren" | "Jugend" | "Kinder" | "Beauty";

export type Service = {
  id: string;
  category: ServiceCategory;
  title: string;
  description: string;
  priceHint: string; // z.B. "22 €" oder "ab 26 €" oder "20-35 €"
  durationHint: string; // z.B. "30 Min." oder "60 Min."
  note?: string; // z.B. "ab Schulter +15 €"
};

export const serviceCategoryOrder: ServiceCategory[] = [
  "Damen",
  "Herren",
  "Jugend",
  "Kinder",
  "Beauty",
];

export const services: Service[] = [
  // Damen
  {
    id: "damen-neuschnitt",
    category: "Damen",
    title: "Neuschnitt",
    description: "Kompletter Neuaufbau des Looks inkl. Beratung und präzisem Finish.",
    priceHint: "40 €",
    durationHint: "60 Min.",
    note: "ab Schulter +15 €",
  },
  {
    id: "damen-haarschnitt",
    category: "Damen",
    title: "Haarschnitt",
    description: "Klassischer Schnitt mit sauberer Kontur - passend zu Haar und Gesichtsform.",
    priceHint: "ab 26 €",
    durationHint: "45 Min.",
    note: "ab Schulter +15 €",
  },
  {
    id: "damen-foehnen",
    category: "Damen",
    title: "Föhnen",
    description: "Volumen und Form - je nach Wunsch glatt, Wellen oder natürlicher Blowout.",
    priceHint: "ab 27 €",
    durationHint: "45 Min.",
  },
  {
    id: "damen-farbe-foehnen",
    category: "Damen",
    title: "Farbe + Föhnen",
    description: "Ansatz oder Komplettfarbe für frische Tiefe und Glanz - inkl. Styling.",
    priceHint: "70 €",
    durationHint: "120 Min.",
  },
  {
    id: "damen-inoa-foehnen",
    category: "Damen",
    title: "Inoa + Föhnen",
    description: "Sanfte, hochwertige Coloration mit Inoa für ein gleichmäßiges Farbergebnis - inkl. Styling.",
    priceHint: "75 €",
    durationHint: "120 Min.",
  },
  {
    id: "damen-straehnen",
    category: "Damen",
    title: "Strähnen",
    description: "Highlights und Dimension für mehr Struktur und Lichtreflexe im Haar.",
    priceHint: "ab 60 €",
    durationHint: "180 Min.",
  },
  {
    id: "damen-glossing",
    category: "Damen",
    title: "Glossing",
    description: "Glanz, Tonauffrischung und harmonische Nuancen - ideal nach Farbe oder Strähnen.",
    priceHint: "20-35 €",
    durationHint: "30 Min.",
  },
  {
    id: "damen-toenung",
    category: "Damen",
    title: "Tönung",
    description: "Schonende Farbauffrischung oder dezente Veränderung - natürliches Ergebnis.",
    priceHint: "ab 46 €",
    durationHint: "90 Min.",
  },
  {
    id: "damen-painting",
    category: "Damen",
    title: "Painting",
    description: "Freihand-Technik für weiche Übergänge und einen modernen, natürlichen Look.",
    priceHint: "ab 50 €",
    durationHint: "210 Min.",
  },
  {
    id: "damen-dauerwelle",
    category: "Damen",
    title: "Dauerwelle",
    description: "Locken oder Bewegung mit Struktur - von soft bis definierter.",
    priceHint: "75 €",
    durationHint: "120 Min.",
  },

  // Herren
  {
    id: "herren-haarschnitt-trocken",
    category: "Herren",
    title: "Haarschnitt (trocken)",
    description: "Schnell und sauber: Schnitt und Konturen ohne Waschen.",
    priceHint: "22 €",
    durationHint: "30 Min.",
  },
  {
    id: "herren-haarschnitt-waschen-foehnen",
    category: "Herren",
    title: "Haarschnitt + Waschen/Föhnen",
    description: "Mit Waschen und Styling für ein rundes Finish.",
    priceHint: "29 €",
    durationHint: "45 Min.",
  },
  {
    id: "herren-maschinenschnitt",
    category: "Herren",
    title: "Maschinenschnitt",
    description: "Gleichmäßige Länge - clean und unkompliziert.",
    priceHint: "15 €",
    durationHint: "20 Min.",
  },
  {
    id: "herren-bartschnitt",
    category: "Herren",
    title: "Bartschnitt",
    description: "Konturen und Form, passend zum Gesicht - gepflegt und präzise.",
    priceHint: "8 €",
    durationHint: "15 Min.",
  },

  // Jugend (ab 14)
  {
    id: "jugend-haarschnitt-waschen-foehnen",
    category: "Jugend",
    title: "Haarschnitt + Waschen/Föhnen (ab 14)",
    description: "Schnitt mit Waschen und Styling - modern und alltagstauglich.",
    priceHint: "ab 25 €",
    durationHint: "45 Min.",
  },
  {
    id: "jugend-haarschnitt-trocken",
    category: "Jugend",
    title: "Haarschnitt (trocken, ab 14)",
    description: "Kurz und sauber - ideal für schnelle Termine.",
    priceHint: "17 €",
    durationHint: "30 Min.",
  },

  // Kinder
  {
    id: "kinder-haarschnitt",
    category: "Kinder",
    title: "Kinderhaarschnitt",
    description: "Kinderfreundlich und entspannt - mit Geduld und sauberem Ergebnis.",
    priceHint: "ab 15 €",
    durationHint: "30 Min.",
  },

  // Beauty (Wimpern/Augenbrauen)
  {
    id: "beauty-wimpern-faerben",
    category: "Beauty",
    title: "Wimpern färben",
    description: "Mehr Ausdruck ohne Mascara - natürliches, klares Ergebnis.",
    priceHint: "15 €",
    durationHint: "10 Min.",
  },
  {
    id: "beauty-augenbrauen-faerben",
    category: "Beauty",
    title: "Augenbrauen färben",
    description: "Mehr Definition und ein stimmiger Rahmen fürs Gesicht.",
    priceHint: "10 €",
    durationHint: "10 Min.",
  },
  {
    id: "beauty-augenbrauen-zupfen",
    category: "Beauty",
    title: "Augenbrauen zupfen",
    description: "Saubere Form, die zu deinem Gesicht passt.",
    priceHint: "7 €",
    durationHint: "10 Min.",
  },
];
