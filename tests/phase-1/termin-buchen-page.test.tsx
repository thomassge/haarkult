import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { BookingConfig } from "@/content/booking";

const fallbackChannelLabels = {
  phone: "Telefon",
  whatsapp: "WhatsApp",
  email: "E-Mail",
} as const;

async function loadBookingPageWithBooking(
  overrideBooking: (booking: BookingConfig) => BookingConfig
) {
  vi.resetModules();
  vi.doUnmock("@/content/booking");
  vi.doMock("@/content/booking", async () => {
    const actual = await vi.importActual<typeof import("@/content/booking")>(
      "@/content/booking"
    );

    return {
      ...actual,
      booking: overrideBooking(actual.booking),
    };
  });

  const { booking } = await import("@/content/booking");
  const { homePage } = await import("@/content/home");
  const { site } = await import("@/content/site");
  const homePageLib = await import("@/lib/home-page");
  const siteModeLib = await import("@/lib/site-mode");
  const { default: BookingPage } = await import("@/app/termin-buchen/page");

  return {
    booking,
    BookingPage,
    homePage,
    site,
    fillMessageTemplate: homePageLib.fillMessageTemplate,
    formatInlineList: homePageLib.formatInlineList,
    resolvePageActions: homePageLib.resolvePageActions,
    resolveVisibleContactKinds: siteModeLib.resolveVisibleContactKinds,
  };
}

describe("/termin-buchen fallback", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("renders the configured contact-only copy and visible fallback actions", async () => {
    const {
      booking,
      BookingPage,
      homePage,
      site,
      fillMessageTemplate,
      formatInlineList,
      resolvePageActions,
      resolveVisibleContactKinds,
    } = await loadBookingPageWithBooking((actual) => ({
      ...actual,
      mode: "contact_only",
    }));
    const whatsappMessage = fillMessageTemplate(homePage.actionMessages.whatsapp, {
      salonName: site.brand.name,
    });
    const contactActions = resolvePageActions(
      homePage.contact.actions,
      site,
      booking,
      whatsappMessage
    );
    const fallbackChannels = resolveVisibleContactKinds(site, booking).map(
      (kind) => fallbackChannelLabels[kind]
    );
    const expectedSubtitle = `${booking.copy.contactOnly.subtitlePrefix} ${formatInlineList(fallbackChannels)}.`;

    render(await BookingPage());

    expect(screen.getByText(booking.copy.contactOnly.title)).toBeTruthy();
    expect(screen.getByText(expectedSubtitle)).toBeTruthy();
    expect(screen.getByText(booking.copy.contactOnly.body)).toBeTruthy();
    expect(screen.queryByText(booking.copy.booking.title)).toBeNull();

    for (const action of contactActions) {
      expect(screen.getByRole("link", { name: action.label })).toBeTruthy();
    }
  });

  it("keeps hidden fallback channels out of the rendered contact-only page", async () => {
    const { booking, BookingPage, site, formatInlineList, resolveVisibleContactKinds } =
      await loadBookingPageWithBooking((actual) => ({
        ...actual,
        mode: "contact_only",
        fallbackActions: ["phone"],
      }));
    const fallbackChannels = resolveVisibleContactKinds(site, booking).map(
      (kind) => fallbackChannelLabels[kind]
    );
    const expectedSubtitle = `${booking.copy.contactOnly.subtitlePrefix} ${formatInlineList(fallbackChannels)}.`;

    render(await BookingPage());

    expect(screen.getByText(expectedSubtitle)).toBeTruthy();
    expect(screen.getByRole("link", { name: /Anrufen/i })).toBeTruthy();
    expect(screen.queryByText(/WhatsApp/i)).toBeNull();
    expect(screen.queryByRole("link", { name: /WhatsApp/i })).toBeNull();
    expect(screen.queryByText(/E-Mail/i)).toBeNull();
    expect(screen.queryByRole("link", { name: /E-Mail/i })).toBeNull();
  });
});
