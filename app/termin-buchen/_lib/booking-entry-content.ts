import { booking } from "@/content/booking";
import { homePage } from "@/content/home";
import { site } from "@/content/site";
import {
  fillMessageTemplate,
  formatInlineList,
  resolvePageActions,
} from "@/lib/home-page";
import { getBookingPresentationState } from "@/lib/site-mode";

const fallbackChannelLabels = {
  phone: "Telefon",
  whatsapp: "WhatsApp",
  email: "E-Mail",
};

export function getBookingEntryContent() {
  const presentationState = getBookingPresentationState(site, booking);
  const whatsappMessage = fillMessageTemplate(homePage.actionMessages.whatsapp, {
    salonName: site.brand.name,
  });
  const contactActions = resolvePageActions(
    homePage.contact.actions,
    site,
    booking,
    whatsappMessage
  );
  const fallbackChannels = presentationState.visibleContactKinds.map(
    (kind) => fallbackChannelLabels[kind]
  );
  const formattedFallbackChannels = formatInlineList(fallbackChannels);
  const pageCopy = presentationState.isBookingEnabled
    ? booking.copy.booking
    : booking.copy.contactOnly;
  const subtitle = presentationState.isBookingEnabled
    ? booking.copy.booking.subtitle
    : `${booking.copy.contactOnly.subtitlePrefix} ${formattedFallbackChannels}.`;

  return {
    contactActions,
    isBookingEnabled: presentationState.isBookingEnabled,
    pageCopy,
    subtitle,
  };
}
