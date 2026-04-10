import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { homePage } from "@/content/home";
import { site } from "@/content/site";
import { fillMessageTemplate, resolvePageActions } from "@/lib/home-page";
import { resolveVisibleContactKinds } from "@/lib/site-mode";

const fallbackChannelLabels = {
  phone: "Telefon",
  whatsapp: "WhatsApp",
  email: "E-Mail",
} as const;

vi.mock("@/content/booking", async () => {
  const actual = await vi.importActual<typeof import("@/content/booking")>(
    "@/content/booking"
  );

  return {
    ...actual,
    booking: {
      ...actual.booking,
      mode: "contact_only",
    },
  };
});

describe("/termin-buchen fallback", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("renders the configured contact-only copy and visible fallback actions", async () => {
    const [{ booking }, { default: BookingPage }] = await Promise.all([
      import("@/content/booking"),
      import("@/app/termin-buchen/page"),
    ]);
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
    const expectedSubtitle = `${booking.copy.contactOnly.subtitlePrefix} ${fallbackChannels.join(", ")}.`;

    render(<BookingPage />);

    expect(screen.getByText(booking.copy.contactOnly.title)).toBeTruthy();
    expect(screen.getByText(expectedSubtitle)).toBeTruthy();
    expect(screen.getByText(booking.copy.contactOnly.body)).toBeTruthy();
    expect(screen.queryByText(booking.copy.booking.title)).toBeNull();

    for (const action of contactActions) {
      expect(screen.getByRole("link", { name: action.label })).toBeTruthy();
    }
  });
});
