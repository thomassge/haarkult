export type LegalSection = {
  title: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
};

export const legalContent = {
  eyebrow: "Rechtliches",
  quickLinks: [
    { href: "/", label: "Startseite" },
    { href: "/impressum", label: "Impressum" },
    { href: "/datenschutz", label: "Datenschutz" },
  ],
  impressum: {
    title: "Impressum",
    intro: "Pflichtangaben und Ansprechpartner für dieses Onlineangebot.",
    providerTitle: "Angaben gemäß § 5 DDG",
    contentResponsibilityTitle: "Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV",
    disputeResolutionTitle: "Hinweis zur Verbraucherstreitbeilegung",
    disputeResolution:
      "Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.",
  },
  privacy: {
    title: "Datenschutz",
    intro:
      "Diese Datenschutzerklärung informiert Sie darüber, welche personenbezogenen Daten beim Besuch dieser Website und bei einer Kontaktaufnahme verarbeitet werden.",
    updatedAt: "Stand: April 2026",
    complaintUrl: "https://datenschutz.hessen.de/service/beschwerde-uebermitteln",
    whatsappPrivacyUrl: "https://www.whatsapp.com/legal/privacy-policy",
    sections: [
      {
        title: "1. Verantwortliche Stelle",
        paragraphs: [
          "Verantwortlich für die Datenverarbeitung auf dieser Website ist der im Impressum genannte Anbieter.",
          "Bei Fragen zum Datenschutz können Sie uns jederzeit per E-Mail, telefonisch oder auf dem Postweg kontaktieren.",
        ],
      },
      {
        title: "2. Hosting und Server-Logfiles",
        paragraphs: [
          "Beim Aufruf dieser Website verarbeitet der Hosting-Anbieter technische Zugriffsdaten, damit die Seiten ausgeliefert und die Sicherheit sowie Stabilität des Betriebs gewährleistet werden können.",
          "Dabei können insbesondere IP-Adresse, Datum und Uhrzeit des Abrufs, angeforderte URL, Referrer-URL, Browsertyp, Betriebssystem und der Zugriffsstatus verarbeitet werden.",
          "Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Das berechtigte Interesse liegt in der sicheren, fehlerfreien und wirtschaftlichen Bereitstellung der Website.",
        ],
      },
      {
        title: "3. Cookies, Reichweitenmessung und eingebettete Drittinhalte",
        paragraphs: [
          "Auf dieser Website setzen wir derzeit keine Analyse- oder Marketing-Tools ein. Es gibt kein Kontaktformular, keinen Newsletter, keine Nutzerkonten und keine eingebetteten Karten oder Social Plugins, die bereits beim bloßen Seitenaufruf Daten an externe Anbieter übertragen.",
          "Technisch notwendige Verarbeitungen im Zusammenhang mit Ihrem Browser oder dem Hosting-Umfeld bleiben hiervon unberührt.",
        ],
      },
      {
        title: "4. Kontaktaufnahme",
        paragraphs: [
          "Wenn Sie uns per Telefon, E-Mail oder WhatsApp kontaktieren, verarbeiten wir die von Ihnen übermittelten Angaben zur Bearbeitung Ihrer Anfrage.",
          "Die Verarbeitung erfolgt zur Durchführung vorvertraglicher Maßnahmen gemäß Art. 6 Abs. 1 lit. b DSGVO, soweit es um Termin- oder Leistungsanfragen geht. In anderen Fällen beruht sie auf unserem berechtigten Interesse an einer geordneten Kommunikation gemäß Art. 6 Abs. 1 lit. f DSGVO.",
        ],
      },
      {
        title: "5. Kontakt über WhatsApp",
        paragraphs: [
          "Für die Kontaktaufnahme per WhatsApp nutzen wir einen Dienst der Meta-Unternehmensgruppe. Wenn Sie den WhatsApp-Link anklicken oder uns dort schreiben, werden Daten auch durch WhatsApp verarbeitet.",
          "Auf diese Datenverarbeitung durch WhatsApp haben wir nur begrenzten Einfluss. Wenn Sie dies nicht möchten, nutzen Sie bitte E-Mail oder Telefon als alternativen Kontaktweg.",
          "Es gelten ergänzend die Datenschutzbestimmungen von WhatsApp.",
        ],
      },
      {
        title: "6. Externe Links",
        paragraphs: [
          "Diese Website enthält externe Verlinkungen, insbesondere zu Google Maps und WhatsApp. Eine Datenübermittlung an diese Anbieter findet erst statt, wenn Sie den jeweiligen Link aktiv anklicken.",
          "Google Maps wird auf dieser Website nicht eingebettet, sondern ausschließlich als externer Link angeboten.",
        ],
      },
      {
        title: "7. Speicherdauer",
        paragraphs: [
          "Wir speichern personenbezogene Daten nur so lange, wie dies für die Bearbeitung Ihrer Anfrage erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen.",
        ],
      },
      {
        title: "8. Ihre Rechte",
        paragraphs: [
          "Sie haben im Rahmen der gesetzlichen Vorgaben insbesondere folgende Rechte:",
        ],
        bullets: [
          "Auskunft über die bei uns verarbeiteten personenbezogenen Daten",
          "Berichtigung unrichtiger oder Vervollständigung unvollständiger Daten",
          "Löschung Ihrer Daten, sofern keine gesetzlichen Pflichten entgegenstehen",
          "Einschränkung der Verarbeitung",
          "Widerspruch gegen Verarbeitungen auf Grundlage berechtigter Interessen",
          "Datenübertragbarkeit, soweit die gesetzlichen Voraussetzungen vorliegen",
          "Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft",
        ],
      },
      {
        title: "9. Beschwerderecht",
        paragraphs: [
          "Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Für unser Unternehmen ist insbesondere der Hessische Beauftragte für Datenschutz und Informationsfreiheit zuständig.",
        ],
      },
    ] satisfies readonly LegalSection[],
  },
} as const;
