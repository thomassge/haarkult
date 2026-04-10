import { describe, expect, it } from "vitest";
import { booking } from "@/content/booking";
import { site } from "@/content/site";
import {
  getBookingEntryHref,
  getBookingPresentationState,
  isBookingEnabled,
  resolveVisibleContactKinds,
} from "@/lib/site-mode";

describe("site mode selectors", () => {
  it("hides the booking entry in contact_only mode but keeps configured contacts", () => {
    const contactOnlyBooking = {
      ...booking,
      mode: "contact_only" as const,
    };

    expect(isBookingEnabled(contactOnlyBooking)).toBe(false);
    expect(getBookingEntryHref(contactOnlyBooking)).toBeNull();
    expect(resolveVisibleContactKinds(site, contactOnlyBooking)).toEqual(
      contactOnlyBooking.fallbackActions
    );
  });

  it("exposes /termin-buchen in booking mode and preserves configured fallback contacts", () => {
    const bookingModeConfig = {
      ...booking,
      mode: "booking" as const,
      fallbackActions: ["email", "whatsapp"] as const,
    };

    expect(isBookingEnabled(bookingModeConfig)).toBe(true);
    expect(getBookingEntryHref(bookingModeConfig)).toBe(booking.entry.href);
    expect(resolveVisibleContactKinds(site, bookingModeConfig)).toEqual([
      "email",
      "whatsapp",
    ]);
    expect(getBookingPresentationState(site, bookingModeConfig)).toMatchObject({
      mode: "booking",
      isBookingEnabled: true,
      bookingEntryHref: booking.entry.href,
      visibleContactKinds: ["email", "whatsapp"],
    });
  });

  it("filters out fallback channels without configured contact data", () => {
    const siteWithoutWhatsapp = {
      ...site,
      contact: {
        ...site.contact,
        whatsapp: null,
      },
    };

    expect(resolveVisibleContactKinds(siteWithoutWhatsapp, booking)).toEqual([
      "phone",
      "email",
    ]);
  });
});
