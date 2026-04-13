import type { Metadata } from "next";
import { booking } from "@/content/booking";
import { site } from "@/content/site";
import { isMissingBookingEnvError } from "@/lib/booking/env";
import { getStaffSetupData } from "@/lib/booking/setup-queries";
import { getBookingPresentationState } from "@/lib/site-mode";
import { BookingEntryShell } from "./_components/booking-entry-shell";
import { BookingFlow } from "./_components/booking-flow";
import { getBookingEntryContent } from "./_lib/booking-entry-content";
import { setupIncompleteFallbackCopy } from "./_lib/booking-flow-options";

const presentationState = getBookingPresentationState(site, booking);
const isBookingEnabled = presentationState.isBookingEnabled;

export const metadata: Metadata = {
  title: isBookingEnabled
    ? `Termin buchen | ${site.brand.name}`
    : `Kontakt | ${site.brand.name}`,
  description: isBookingEnabled
    ? `Online-Terminbuchung fuer ${site.brand.name} in ${site.brand.city}.`
    : `Kontaktwege fuer ${site.brand.name} in ${site.brand.city}.`,
};

export default async function BookingPage() {
  const { contactActions, pageCopy, subtitle } = getBookingEntryContent();

  if (isBookingEnabled) {
    const setupData = await getBookingSetupDataOrNull();

    if (setupData?.setupCompletion.complete) {
      return (
        <BookingFlow
          booking={booking}
          brandName={site.brand.name}
          staffRows={setupData.staff}
        />
      );
    }

    return (
      <BookingEntryShell
        brandName={site.brand.name}
        contactActions={contactActions}
        pageCopy={{
          ...setupIncompleteFallbackCopy,
          body: "Sende deinen Terminwunsch direkt an den Salon.",
          eyebrow: "Kontakt",
          stepsLabel: "So erreichst du uns",
          steps: [
            "Terminwunsch direkt senden",
            "Rueckmeldung vom Salon erhalten",
            "Details persoenlich abstimmen",
          ],
        }}
        subtitle={setupIncompleteFallbackCopy.body}
      />
    );
  }

  return (
    <BookingEntryShell
      brandName={site.brand.name}
      contactActions={contactActions}
      pageCopy={pageCopy}
      subtitle={subtitle}
    />
  );
}

async function getBookingSetupDataOrNull() {
  try {
    return await getStaffSetupData();
  } catch (error) {
    if (isMissingBookingEnvError(error)) {
      return null;
    }

    throw error;
  }
}
