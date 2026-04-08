import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { BodyText, FinePrint } from "@/components/ui/typography";
import { homePage } from "@/content/home";
import type { BookingFallbackAction } from "@/content/site";
import { site } from "@/content/site";
import { fillMessageTemplate, resolvePageActions } from "@/lib/home-page";

const isBookingEnabled = site.booking.mode === "online_booking";

const fallbackChannelLabels: Record<BookingFallbackAction, string> = {
  phone: "Telefon",
  whatsapp: "WhatsApp",
  email: "E-Mail",
};

export const metadata: Metadata = {
  title: isBookingEnabled
    ? `Termin buchen | ${site.brand.name}`
    : `Kontakt | ${site.brand.name}`,
  description: isBookingEnabled
    ? `Online-Terminbuchung fuer ${site.brand.name} in ${site.brand.city}.`
    : `Kontaktwege fuer ${site.brand.name} in ${site.brand.city}.`,
};

export default function BookingPage() {
  const whatsappMessage = fillMessageTemplate(homePage.actionMessages.whatsapp, {
    salonName: site.brand.name,
  });
  const contactActions = resolvePageActions(
    homePage.contact.actions,
    site,
    whatsappMessage
  );
  const fallbackChannels = site.booking.fallbackActions
    .map((kind) => fallbackChannelLabels[kind])
    .join(", ");

  return (
    <div className="relative min-h-screen overflow-hidden text-zinc-950 dark:text-zinc-50">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[30rem] bg-[radial-gradient(circle_at_top_left,rgba(248,242,233,0.92),transparent_42%),radial-gradient(circle_at_top_right,rgba(217,198,168,0.48),transparent_28%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(89,68,47,0.24),transparent_32%),radial-gradient(circle_at_top_right,rgba(72,56,40,0.22),transparent_26%)]"
      />
      <Section className="pt-14 sm:pt-20 lg:pt-24">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <Card
              className="relative overflow-hidden border-[var(--line-strong)] shadow-[var(--shadow-strong)]"
              padded
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.34),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.08),transparent_38%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_34%)]"
              />
              <div className="relative">
                <Heading
                  eyebrow={isBookingEnabled ? "Online-Buchung" : "Kontakt"}
                  title={
                    isBookingEnabled
                      ? "Termin buchen"
                      : "Online-Terminbuchung ist aktuell nicht aktiv"
                  }
                  subtitle={
                    isBookingEnabled
                      ? "Hier entsteht die digitale Terminbuchung. Bald kannst du Leistungen, freie Zeiten und optional dein Wunschteam direkt online waehlen."
                      : `Dieses Studio vergibt Termine derzeit direkt ueber ${fallbackChannels}.`
                  }
                />

                <BodyText className="mt-6 text-zinc-700 dark:text-zinc-300">
                  {isBookingEnabled
                    ? "Bis die komplette Buchungsstrecke live ist, bleiben die gewohnten Kontaktwege weiterhin verfuegbar."
                    : "Wenn du diese Seite direkt aufgerufen hast, nutze bitte die Kontaktmoeglichkeiten unten. So landest du ohne Umweg beim Salon."}
                </BodyText>
              </div>
            </Card>

            <Card padded>
              <FinePrint>{isBookingEnabled ? "So wird die Strecke" : "So geht es aktuell"}</FinePrint>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                {isBookingEnabled ? (
                  <>
                    <li>Leistung auswaehlen</li>
                    <li>Optional Stylistin oder Stylist festlegen</li>
                    <li>Freie Zeiten ansehen und Termin bestaetigen</li>
                  </>
                ) : (
                  <>
                    <li>Terminwunsch telefonisch, per WhatsApp oder per E-Mail senden</li>
                    <li>Rueckmeldung direkt vom Salon erhalten</li>
                    <li>Details bei Bedarf persoenlich abstimmen</li>
                  </>
                )}
              </ul>
            </Card>
          </div>

          <Card className="mt-6" padded>
            <FinePrint>Kontakt</FinePrint>
            <p className="mt-3 text-xl font-semibold tracking-[-0.03em] text-zinc-950 dark:text-zinc-50">
              {site.brand.name}
            </p>
            <BodyText className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-300">
              {isBookingEnabled
                ? "Bis die vollstaendige Online-Buchung live ist, erreichst du den Salon weiterhin direkt ueber die vorhandenen Kontaktkanaele."
                : "Die Kontaktwege bleiben die zentrale Terminoption, solange der Salon im Kontaktmodus laeuft."}
            </BodyText>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {contactActions.map((action) => (
                <Button
                  key={`${action.label}-${action.href}`}
                  href={action.href}
                  variant={action.variant}
                  external={action.external}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </Card>
        </Container>
      </Section>
    </div>
  );
}
