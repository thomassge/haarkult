import type { Metadata } from "next";
import { AdminShell } from "./_components/admin-shell";

export const metadata: Metadata = {
  title: "Admin | Haarkult-Maintal",
  description:
    "Geschuetzter Bereich fuer die spaetere Terminverwaltung und Salonorganisation.",
};

const nextSteps = [
  "Authentifizierung fuer Salonmitarbeitende anbinden",
  "Terminliste und Statuswechsel vorbereiten",
  "Verfuegbarkeiten und Sperrzeiten getrennt von der Broschuere verwalten",
];

export default function AdminPage() {
  return (
    <AdminShell
      title="Admin-Bereich in Vorbereitung"
      subtitle="Hier entsteht die getrennte Arbeitsflaeche fuer Terminverwaltung, Verfuegbarkeiten und interne Salonablaeufe."
      nextSteps={nextSteps}
    />
  );
}
