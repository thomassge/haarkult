import { booking, type BookingConfig, type BookingFallbackAction } from "@/content/booking";
import type { SiteConfig } from "@/content/site";
import { mailtoHref, telHref, whatsappHref } from "@/lib/links";

export type BookingPresentationState = {
  mode: BookingConfig["mode"];
  isBookingEnabled: boolean;
  bookingEntryHref: string | null;
  visibleContactKinds: BookingFallbackAction[];
};

export type PublicSiteAction = {
  kind: "booking" | BookingFallbackAction;
  label: string;
  href: string;
  external: boolean;
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

export function resolvePublicSiteActions(
  site: SiteConfig,
  bookingConfig: BookingConfig = booking
): PublicSiteAction[] {
  const presentationState = getBookingPresentationState(site, bookingConfig);
  const actions: PublicSiteAction[] = [];

  if (presentationState.bookingEntryHref) {
    actions.push({
      kind: "booking",
      label: bookingConfig.entry.label,
      href: presentationState.bookingEntryHref,
      external: false,
    });
  }

  for (const kind of presentationState.visibleContactKinds) {
    if (kind === "phone") {
      actions.push({
        kind,
        label: "Telefon",
        href: telHref(site.contact.phone),
        external: true,
      });
      continue;
    }

    if (kind === "email") {
      actions.push({
        kind,
        label: "E-Mail",
        href: mailtoHref(site.contact.email),
        external: true,
      });
      continue;
    }

    if (!site.contact.whatsapp) {
      continue;
    }

    actions.push({
      kind,
      label: "WhatsApp",
      href: whatsappHref(site.contact.whatsapp),
      external: true,
    });
  }

  return actions;
}
