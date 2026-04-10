import { booking, type BookingConfig, type BookingFallbackAction } from "@/content/booking";
import type { SiteConfig } from "@/content/site";

export type BookingPresentationState = {
  mode: BookingConfig["mode"];
  isBookingEnabled: boolean;
  bookingEntryHref: string | null;
  visibleContactKinds: BookingFallbackAction[];
};

export function isBookingEnabled(bookingConfig: BookingConfig = booking) {
  return bookingConfig.mode === "booking";
}

export function getBookingEntryHref(bookingConfig: BookingConfig = booking) {
  return isBookingEnabled(bookingConfig) ? bookingConfig.entry.href : null;
}

export function resolveVisibleContactKinds(
  site: SiteConfig,
  bookingConfig: BookingConfig = booking
) {
  return bookingConfig.fallbackActions.filter((kind) => {
    if (kind === "phone") {
      return Boolean(site.contact.phone);
    }

    if (kind === "email") {
      return Boolean(site.contact.email);
    }

    return Boolean(site.contact.whatsapp);
  });
}

export function getBookingPresentationState(
  site: SiteConfig,
  bookingConfig: BookingConfig = booking
): BookingPresentationState {
  return {
    mode: bookingConfig.mode,
    isBookingEnabled: isBookingEnabled(bookingConfig),
    bookingEntryHref: getBookingEntryHref(bookingConfig),
    visibleContactKinds: resolveVisibleContactKinds(site, bookingConfig),
  };
}
