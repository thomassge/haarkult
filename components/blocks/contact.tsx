import { site } from "@/content/site";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { mapsHref, telHref, whatsappHref } from "@/lib/links";

export function ContactBlock() {
  const addressLine = `${site.address.street}, ${site.address.zip} ${site.address.city}`;

  return (
    <Section className="pb-24">
      <Container>
        <div className="grid gap-10 md:grid-cols-2 md:items-start">
          <Heading
            eyebrow="Kontakt"
            title="So erreichst du uns"
            subtitle="Ruf an, schreib uns oder lass dich direkt per Maps führen."
          />

          <div className="rounded-3xl border border-black/[.08] bg-white p-6 shadow-sm dark:border-white/[.12] dark:bg-zinc-950">
            <div className="space-y-2">
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                Adresse
              </p>
              <p className="text-base font-semibold tracking-tight">
                {site.name}
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                {addressLine}
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button href={mapsHref(addressLine)} variant="secondary" external>
                Route planen
              </Button>
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

            {/* Öffnungszeiten kompakt (ruhig, nicht dominant) */}
            <div className="mt-8 border-t border-black/[.08] pt-6 dark:border-white/[.12]">
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                Öffnungszeiten
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {site.openingHours.map((row) => (
                  <li key={row.label} className="flex justify-between">
                    <span className="text-zinc-600 dark:text-zinc-300">
                      {row.label}
                    </span>
                    <span className="font-medium">{row.hours}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
