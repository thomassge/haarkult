import { site } from "@/content/site";
import { telHref, whatsappHref } from "@/lib/links";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { ServicesGrid } from "@/components/blocks/services-grid";
import { TeamGrid } from "@/components/blocks/team-grid";
import { GalleryGrid } from "@/components/blocks/gallery-grid";

export default function Home() {
  const addressLine = `${site.address.street}, ${site.address.zip} ${site.address.city}`;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <main>
        {/* HERO */}
        <Section className="pt-20 md:pt-28">
          <Container>
            <div className="grid gap-10 md:grid-cols-2 md:items-center">
              <div className="space-y-8">
                <Heading
                  eyebrow={`Friseur in ${site.address.city}`}
                  title={site.name}
                  subtitle={addressLine}
                />

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button href={telHref(site.phone)} variant="primary" external>
                    Anrufen
                  </Button>

                  {site.whatsapp && (
                    <Button
                      href={whatsappHref(
                        site.whatsapp,
                        `Hi! Ich würde gern einen Termin bei ${site.name} machen.`
                      )}
                      variant="secondary"
                      external
                    >
                      WhatsApp
                    </Button>
                  )}
                </div>

                <div className="rounded-2xl border border-black/[.08] bg-white p-6 shadow-sm dark:border-white/[.12] dark:bg-zinc-950">
                  <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                    Öffnungszeiten
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-zinc-800 dark:text-zinc-100">
                    {site.openingHours.map((row) => (
                      <li key={row.label} className="flex items-center justify-between">
                        <span className="text-zinc-600 dark:text-zinc-300">{row.label}</span>
                        <span className="font-medium">{row.hours}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bild-Platzhalter: später ersetzen durch echtes Salon-Foto */}
              <div className="relative overflow-hidden rounded-3xl border border-black/[.08] bg-white shadow-sm dark:border-white/[.12] dark:bg-zinc-950">
                <div className="aspect-[4/3] w-full" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Hier kommt ein starkes Salon-Foto rein.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Nächste Sections kommen in Milestone 1/2: Leistungen, Team, Galerie, Kontakt */}
        <ServicesGrid />
        <TeamGrid />
        <GalleryGrid />
        
        <Section>
          <Container>
            <Heading
              eyebrow="Baukasten-Prinzip"
              title="Alles aus Daten aufgebaut"
              subtitle="Als Nächstes bauen wir Leistungen, Team und Galerie als wiederverwendbare Blocks – gespeist aus content/*.ts."
            />
          </Container>
        </Section>
      </main>
    </div>
  );
}
