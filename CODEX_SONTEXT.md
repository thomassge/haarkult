# Salon Website Review und ToDos

Stand dieser Bewertung: 4. April 2026

Diese Datei ergänzt `CODEX_CONTEXT.md` um eine produktbezogene Bewertung aus Salon-Sicht:

- Was ist bereits gut umgesetzt?
- Was ist nur teilweise gelöst?
- Was müssen wir noch unbedingt umsetzen, damit die Seite nicht nur schön aussieht, sondern auch Kunden bringt?

## Kurzfazit

Der aktuelle Stand ist für eine Friseur-Website bereits stark bei:

- erstem visuellen Eindruck
- ruhiger Premium-Anmutung
- echten Bildern
- klarer Kontaktbasis
- sauberer technischer Grundstruktur

Die größten fachlichen Lücken sind aktuell:

1. Der Weg zur Terminbuchung ist noch nicht klar genug.
2. Vertrauen ist noch zu wenig systematisch aufgebaut.
3. Leistungen und Preise sind noch nicht konkret genug für echte Kaufentscheidungen.
4. Instagram und Social Proof fehlen.
5. Mobile-Performance und Bildgrößen sollten gezielt optimiert werden.

## Bewertung nach den 12 Kriterien

### 1. Sofort ein guter erster Eindruck

Status: weitgehend umgesetzt

Bereits gut:

- ruhige, hochwertige Bildsprache
- starke Hero-Fläche mit echtem Salonbild
- konsistente Farbwelt
- saubere Typografie
- kein visuelles Chaos

Noch offen:

- Charakter und Differenzierung des Salons könnten noch klarer werden
- der erste Screen könnte die Kernbotschaft noch präziser auf Nutzen und Buchung ausrichten

### 2. Mobile first

Status: teilweise umgesetzt

Bereits gut:

- responsive Layouts
- `next/image` wird verwendet
- Buttons und Blöcke brechen mobil grundsätzlich sinnvoll um
- die Seite ist technisch relativ leichtgewichtig

Noch offen:

- keine gezielte Mobile-QA dokumentiert
- keine sticky mobile CTA
- keine gezielte Prüfung auf Tap-Komfort, Scroll-Reibung und Conversion auf dem Handy
- Bildgrößen sind noch nicht konsequent optimiert

### 3. Termin buchen ohne Reibung

Status: noch nicht ausreichend umgesetzt

Aktueller Stand:

- es gibt `Anrufen` und `WhatsApp`
- Kontakt ist sichtbar

Aber noch nicht stark genug:

- kein klarer Haupt-CTA `Termin buchen` oder `Termin anfragen`
- kein eigener, extrem klarer Buchungsweg
- keine sticky mobile Buchungsaktion
- keine Buchungslogik oder Buchungsseite

Wichtig:

- Auch wenn ein komplettes Buchungssystem aktuell bewusst verschoben ist, muss die Seite kurzfristig trotzdem einen glasklaren Buchungsweg haben.

### 4. Preise und Leistungen klar zeigen

Status: teilweise umgesetzt

Bereits gut:

- Leistungen sind vorhanden
- Preise sind sichtbar
- Kategorien sind strukturiert
- Leistungen lassen sich jetzt kategoriert auf- und zuklappen

Noch offen:

- Dauer pro Leistung fehlt
- nicht alle Preise sind maximal konkret
- es fehlt noch stärkerer Fokus auf typische Kundenfragen:
  Was genau bekomme ich?
  Wie lange dauert es?
  Ab wann kostet es mehr?

### 5. Vertrauen aufbauen

Status: teilweise umgesetzt

Bereits gut:

- echte Salonfotos
- echte Teamfotos
- Galerie ist vorhanden

Noch offen:

- keine Bewertungen / Testimonials
- keine sichtbaren Google-Review-Signale
- keine Vorher-Nachher-Beispiele
- kein eigener Vertrauensblock mit kurzer, überzeugender Salonbeschreibung

### 6. Persönlichkeit statt 08/15

Status: weitgehend umgesetzt, aber ausbaufähig

Bereits gut:

- die Seite wirkt nicht wie ein Standard-Template
- das Design hat eine ruhige, elegante Richtung
- echte Assets des Salons sind eingebunden

Noch offen:

- die Copy transportiert die Persönlichkeit des Salons noch nicht stark genug
- Markencharakter könnte klarer werden:
  eher modern, familiär, premium, präzise, herzlich, urban?

### 7. Kontakt sofort auffindbar

Status: weitgehend umgesetzt

Bereits gut:

- Telefonnummer vorhanden
- WhatsApp vorhanden
- Adresse vorhanden
- Öffnungszeiten vorhanden
- Maps-Link vorhanden
- Kontaktbereich ist klar erkennbar

Noch offen:

- Instagram fehlt aktuell
- eine dauerhaft sichtbare Schnellkontakt- oder Mobile-CTA-Leiste fehlt noch

### 8. Wenig Text, aber der richtige Text

Status: teilweise bis gut umgesetzt

Bereits gut:

- keine überladenen Textwüsten
- die Seite bleibt relativ kompakt

Noch offen:

- einige Texte sind noch eher generisch
- es fehlt noch mehr verkaufsstarke, sympathische, salonnahe Sprache
- Vertrauens- und Qualitätsargumente könnten knapper und stärker formuliert werden

### 9. Schnelligkeit

Status: teilweise umgesetzt

Bereits gut:

- statische Next.js-Seite
- keine unnötig komplexe Laufzeitlogik
- selektive statt übertriebene Animation

Noch offen:

- Hero-Bild ist aktuell relativ groß
- keine dokumentierte Performance-Prüfung
- keine gezielte Bildoptimierungsrunde für alle Assets

### 10. Instagram sinnvoll einbinden

Status: noch nicht umgesetzt

Aktueller Stand:

- Datenmodell für Instagram ist vorbereitet
- in `content/site.ts` ist `instagram` aktuell `null`

Noch offen:

- Instagram-Link aktiv setzen
- Instagram im UI sichtbar machen
- optional: ausgewählte aktuelle Arbeiten oder Feed-Anmutung integrieren, ohne die Website davon abhängig zu machen

### 11. Gute Bilder statt Stockfotos

Status: weitgehend umgesetzt

Bereits gut:

- Hero mit echtem Salonbild
- Galerie mit echten Fotos
- Teamfotos vorhanden

Noch offen:

- Bildqualität und Auswahl können weiter kuratiert werden
- Vorher-Nachher- bzw. Ergebnisbilder würden den Vertrauensaspekt deutlich stärken

### 12. Klare Struktur

Status: teilweise umgesetzt

Bereits gut:

- die Homepage deckt fast alle wichtigen Salon-Bausteine ab:
  Start, Leistungen, Team, Galerie, Kontakt

Noch offen:

- `Termin buchen` fehlt als eigener klarer Strukturpunkt
- es gibt noch keine echte Top-Level-Navigation für schnelles Springen
- langfristig sollte entschieden werden, ob One-Page reicht oder einzelne Unterseiten sinnvoll sind

## Was bereits klar erledigt ist

Diese Punkte können wir im aktuellen Stand als umgesetzt oder weitgehend umgesetzt betrachten:

- hochwertiger erster Eindruck
- echte Bilder statt Stockfotos
- ruhige Premium-Gestaltung
- kontaktstarke Basis mit Telefon, WhatsApp, Adresse, Öffnungszeiten, Maps
- klare inhaltliche Grundstruktur auf der Startseite
- responsive Grundlayouts
- prop-driven Builder-Architektur
- konfigurierbare Homepage-Sektionen
- selektive Motion statt Effekt-Overkill

## Was nur teilweise erledigt ist

- Mobile-first aus Conversion-Sicht
- Preise und Leistungen aus Kundensicht
- Vertrauensaufbau
- prägnante, stärkere Copy
- Performance-Feinschliff
- klare Seitenstruktur für Navigation und Conversion

## Was noch unbedingt umgesetzt werden muss

Diese Punkte sind die wichtigsten offenen Produkt-ToDos:

1. Reibungsfreien Buchungsweg definieren und sichtbar machen
2. Vertrauen gezielt aufbauen
3. Leistungen inhaltlich präzisieren
4. Instagram sauber einbinden
5. Mobile Conversion und Performance gezielt optimieren

## Priorisierte ToDos

### P0 - Unbedingt als Nächstes

#### 1. Klaren Buchungs-CTA einführen

Ziel:

- Besucher sollen in maximal wenigen Sekunden verstehen, wie sie einen Termin machen

ToDo:

- Haupt-CTA textlich auf `Termin buchen` oder `Termin anfragen` umstellen
- CTA in Hero und mobilen Sichtbereichen noch klarer priorisieren
- prüfen, ob zusätzlich eine sticky mobile CTA-Leiste sinnvoll ist
- festlegen, ob der Primärweg Telefon, WhatsApp oder eine eigene Buchungsseite ist

#### 2. Vertrauensblock ergänzen

Ziel:

- mehr Sicherheit geben, warum man genau diesem Salon vertraut

ToDo:

- kurzer Abschnitt `Warum Haarkult?`
- 2-4 echte Vertrauenspunkte ergänzen
- optional echte Kundenzitate / Testimonials
- optional Bewertungsschnitt oder Google-Review-Hinweis

#### 3. Leistungen um Dauer erweitern

Ziel:

- Preise und Leistungen sollen schneller entscheidbar sein

ToDo:

- `duration` oder `durationHint` pro Service im Content-Modell ergänzen
- im UI sichtbar machen
- bei Bedarf `ab`-Preise und Zuschläge verständlicher strukturieren

### P1 - Sehr wichtig danach

#### 4. Instagram aktivieren

Ziel:

- visuelles Vertrauen und Social Proof erhöhen

ToDo:

- Instagram-URL in `content/site.ts` pflegen
- Instagram-Link im Kontaktbereich oder Hero sichtbar machen
- optional kuratierte Instagram-/Arbeiten-Sektion

#### 5. Vorher-Nachher- oder Ergebnisbilder ergänzen

Ziel:

- Friseurleistung nicht nur als Raum und Team, sondern als Ergebnis zeigen

ToDo:

- neue Bildkategorie für Arbeiten / Ergebnisse definieren
- optional eigener Block für Ergebnisse statt nur Salonatmosphäre

#### 6. Mobile Conversion gezielt testen

Ziel:

- sicherstellen, dass die Seite auf dem Smartphone wirklich überzeugt

ToDo:

- CTA-Sichtbarkeit auf kleineren Screens prüfen
- Abstände, Scrollfluss und Öffnen der Service-Kategorien mobil testen
- prüfen, ob Kontakt und Buchung schnell genug erreichbar sind

### P2 - Technisch wichtig

#### 7. Bildoptimierung

Ziel:

- schnellere Ladezeit und professionellerer Eindruck

ToDo:

- Hero-Bild komprimieren oder in modernerem Format bereitstellen
- große Assets in `public/` prüfen
- Bildgrößen gezielt für Mobile reduzieren

#### 8. Basis-Performance-Audit dokumentieren

Ziel:

- Performance nicht nur vermuten, sondern nachweisen

ToDo:

- Lighthouse oder ähnliche Prüfung durchführen
- kritische Werte dokumentieren
- größte Bottlenecks festhalten

### P3 - Strategisch / Struktur

#### 9. Navigation schärfen

Ziel:

- Besucher sollen sofort zu Leistungen, Team, Galerie, Kontakt oder Buchung springen können

ToDo:

- einfache Top-Navigation oder Section-Jump-Navigation prüfen
- `Termin buchen` als klaren Navigationspunkt ergänzen

#### 10. Textschärfung / Markenprofil

Ziel:

- mehr Charakter, weniger generische Salon-Sprache

ToDo:

- Hero-Text stärker differenzieren
- Team-/Salontext persönlicher und prägnanter machen
- Markenprofil in wenigen klaren Aussagen zuspitzen

## Empfohlene nächste Reihenfolge

1. Buchungs-CTA schärfen
2. Vertrauensblock / Bewertungen ergänzen
3. Leistungen um Dauer und klarere Leistungsdetails erweitern
4. Instagram einbinden
5. Mobile Conversion + Bildperformance gezielt optimieren

## Wichtigste Produktwahrheit für dieses Projekt

Die Seite ist aktuell schon deutlich stärker im Bereich Design und Struktur als viele klassische Salonseiten.

Damit sie aber nicht nur schön aussieht, sondern konsequent Kunden bringt, müssen jetzt vor allem diese drei Dinge nachgeschärft werden:

1. Buchung ohne Reibung
2. Vertrauen ohne Zweifel
3. Klarheit ohne Überladung
