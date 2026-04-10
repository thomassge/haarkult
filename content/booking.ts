export const bookingModes = ["contact_only", "booking"] as const;

export type BookingMode = (typeof bookingModes)[number];

export const bookingFallbackActionKinds = ["phone", "whatsapp", "email"] as const;

export type BookingFallbackAction = (typeof bookingFallbackActionKinds)[number];

export type BookingConfig = {
  mode: BookingMode;
  entry: {
    label: string;
    href: string;
  };
  fallbackActions: BookingFallbackAction[];
  confirmationMode: "manual" | "instant";
  allowStylistSelection: boolean;
  leadTimeHours: number;
  maxAdvanceDays: number;
  slotStepMinutes: number;
  bufferBeforeMinutes: number;
  bufferAfterMinutes: number;
  copy: {
    booking: {
      eyebrow: string;
      title: string;
      subtitle: string;
      body: string;
      stepsLabel: string;
      steps: string[];
      contactTitle: string;
      contactBody: string;
    };
    contactOnly: {
      eyebrow: string;
      title: string;
      subtitlePrefix: string;
      body: string;
      stepsLabel: string;
      steps: string[];
      contactTitle: string;
      contactBody: string;
    };
  };
};

export const booking: BookingConfig = {
  mode: "booking",
  entry: {
    label: "Termin buchen",
    href: "/termin-buchen",
  },
  fallbackActions: ["phone", "whatsapp", "email"],
  confirmationMode: "manual",
  allowStylistSelection: true,
  leadTimeHours: 12,
  maxAdvanceDays: 60,
  slotStepMinutes: 15,
  bufferBeforeMinutes: 0,
  bufferAfterMinutes: 0,
  copy: {
    booking: {
      eyebrow: "Online-Buchung",
      title: "Termin buchen",
      subtitle:
        "Hier entsteht die digitale Terminbuchung. Bald kannst du Leistungen, freie Zeiten und optional dein Wunschteam direkt online waehlen.",
      body:
        "Bis die komplette Buchungsstrecke live ist, bleiben die gewohnten Kontaktwege weiterhin verfuegbar.",
      stepsLabel: "So wird die Strecke",
      steps: [
        "Leistung auswaehlen",
        "Optional Stylistin oder Stylist festlegen",
        "Freie Zeiten ansehen und Termin bestaetigen",
      ],
      contactTitle: "Kontakt",
      contactBody:
        "Bis die vollstaendige Online-Buchung live ist, erreichst du den Salon weiterhin direkt ueber die vorhandenen Kontaktkanaele.",
    },
    contactOnly: {
      eyebrow: "Kontakt",
      title: "Online-Terminbuchung ist aktuell nicht aktiv",
      subtitlePrefix: "Dieses Studio vergibt Termine derzeit direkt ueber",
      body:
        "Wenn du diese Seite direkt aufgerufen hast, nutze bitte die Kontaktmoeglichkeiten unten. So landest du ohne Umweg beim Salon.",
      stepsLabel: "So geht es aktuell",
      steps: [
        "Terminwunsch telefonisch, per WhatsApp oder per E-Mail senden",
        "Rueckmeldung direkt vom Salon erhalten",
        "Details bei Bedarf persoenlich abstimmen",
      ],
      contactTitle: "Kontakt",
      contactBody:
        "Die Kontaktwege bleiben die zentrale Terminoption, solange der Salon im Kontaktmodus laeuft.",
    },
  },
};
