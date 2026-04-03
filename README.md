# Haarkult

Projekt für `Haarkult-Maintal` auf Basis von Next.js App Router, TypeScript und Tailwind CSS.

Das Repository dient gleichzeitig als:

1. echte Website für den Salon `Haarkult-Maintal`
2. wiederverwendbare Vorlage für weitere Friseur-Websites

Für Arbeitskontext, Handoffs und die laufende Roadmap zuerst [CODEX_CONTEXT.md](./CODEX_CONTEXT.md) lesen.

## Produktziel

Die Website soll modern, ruhig und hochwertig wirken:

- viel Weißraum
- starke Typografie
- hochwertige Bilder
- wenig visuelle Unruhe
- selektive, dezente Animation
- nur deutsche Inhalte

Wichtig:

- kein CMS
- kein komplettes Buchungssystem im aktuellen Stand
- Inhalte liegen direkt im Repository
- wiederverwendbare Blocks dürfen keine salonspezifischen Inhalte direkt importieren

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion für ausgewählte Bewegungen

## Projektstruktur

```text
app/
  page.tsx                 -> Seiten-Komposition
  layout.tsx               -> globale Layout-/SEO-Basis

components/
  blocks/                  -> wiederverwendbare Seitenabschnitte
  ui/                      -> Design-System und UI-Primitives

content/
  site.ts                  -> Marke, Kontakt, SEO, Assets
  home.ts                  -> Homepage-Struktur, Texte, CTA-Konfiguration
  services.ts              -> Leistungen und Preise
  team.ts                  -> Teamdaten
  gallery.ts               -> Galerieinhalte

public/
  brand/                   -> Logo, Hero-Bilder, Markenassets
  gallery/                 -> Galerie-Bilder
  team/                    -> Teamfotos
```

## Lokale Entwicklung

Auf diesem Windows-/PowerShell-Setup `npm.cmd` statt `npm` verwenden:

```powershell
npm.cmd install
npm.cmd run dev
```

Wichtige Checks:

```powershell
npm.cmd run lint
npm.cmd run build
```

Danach ist die Website unter `http://localhost:3000` erreichbar.

## Inhalte pflegen

Wenn sich nur Saloninhalte ändern, sollten Änderungen fast immer hier stattfinden:

- `content/site.ts`
- `content/home.ts`
- `content/services.ts`
- `content/team.ts`
- `content/gallery.ts`
- `public/brand`
- `public/gallery`
- `public/team`

`app/page.tsx` sollte Inhalte nicht neu erfinden, sondern nur konfigurierte Blocks zusammensetzen.

## Neuen Salon aus dieser Vorlage bauen

Empfohlener Ablauf:

1. Repository kopieren oder als neues Repo duplizieren.
2. Inhalte in `content/site.ts` anpassen:
   Salonname, Stadt, Kontakt, WhatsApp, Maps-Link, Instagram, SEO, Logo, Hero-Bild.
3. Inhalte in `content/home.ts` anpassen:
   Reihenfolge der Sektionen, Sichtbarkeit, CTAs, Texte.
4. Leistungen, Team und Galerie ersetzen:
   `content/services.ts`, `content/team.ts`, `content/gallery.ts`.
5. Bilder in `public/brand`, `public/team`, `public/gallery` austauschen.
6. Lokal prüfen mit `npm.cmd run lint` und `npm.cmd run build`.

Ziel dabei:

- möglichst nur `content/*` und `public/*` ändern
- `components/blocks/*` und `components/ui/*` nur anfassen, wenn das System wirklich erweitert werden muss

## Aktueller Builder-Stand

Bereits umgesetzt:

- zentrale Marken-, Kontakt- und SEO-Konfiguration
- prop-driven Homepage-Blocks
- konfigurierbare Sektionsreihenfolge auf der Startseite
- stärker builder-orientierter Content-Vertrag
- selektive Motion für Hero, Karten und Abschnitts-Reveals

## Arbeitsprinzipien

- nur deutsche Texte
- statisch/server-first, `use client` nur wenn wirklich nötig
- Motion nur gezielt, nicht flächendeckend
- kleine, saubere Commits
- wiederverwendbare Blocks statt salonspezifischer Sonderlogik

## Nächster Einstiegspunkt

Wenn du als nächster Agent oder Entwickler weitermachst:

1. [CODEX_CONTEXT.md](./CODEX_CONTEXT.md) lesen
2. Status in Git prüfen
3. `npm.cmd run lint`
4. `npm.cmd run build`
5. dann den nächsten kleinen Builder-Schritt umsetzen
