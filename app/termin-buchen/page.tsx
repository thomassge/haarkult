import type { Metadata } from "next";
import { booking } from "@/content/booking";
import { site } from "@/content/site";
import { getBookingPresentationState } from "@/lib/site-mode";
import { BookingEntryShell } from "./_components/booking-entry-shell";
import { getBookingEntryContent } from "./_lib/booking-entry-content";

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

export default function BookingPage() {
  const { contactActions, pageCopy, subtitle } = getBookingEntryContent();

  return (
    <BookingEntryShell
      brandName={site.brand.name}
      contactActions={contactActions}
      pageCopy={pageCopy}
      subtitle={subtitle}
    />
  );
}
