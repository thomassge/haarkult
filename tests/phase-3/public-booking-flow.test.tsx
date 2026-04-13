import { describe, expect, it } from "vitest";

import { bookableServices } from "@/lib/booking/catalog";
import {
  derivePublicBookingServiceOptions,
  setupIncompleteFallbackCopy,
} from "@/app/termin-buchen/_lib/booking-flow-options";

describe("public booking service options", () => {
  it("groups bookable catalog services by category in catalog order", () => {
    const options = derivePublicBookingServiceOptions();

    expect(options.categories.map((category) => category.label)).toEqual([
      "Damen",
      "Herren",
      "Jugend",
      "Kinder",
      "Beauty",
    ]);
    expect(options.showCategorySelector).toBe(true);
    expect(options.categories.flatMap((category) => category.services).length).toBe(
      bookableServices.length
    );
  });

  it("skips category selection when only one category is available", () => {
    const services = bookableServices.filter((service) => service.category === "Kinder");
    const options = derivePublicBookingServiceOptions(services);

    expect(options.showCategorySelector).toBe(false);
    expect(options.categories).toHaveLength(1);
    expect(options.categories[0]?.label).toBe("Kinder");
    expect(options.categories[0]?.services.map((service) => service.id)).toEqual([
      "kinder-haarschnitt",
    ]);
  });

  it("exposes service metadata needed by the selection UI", () => {
    const options = derivePublicBookingServiceOptions();
    const service = options.categories
      .flatMap((category) => category.services)
      .find((item) => item.id === "damen-haarschnitt");

    expect(service).toMatchObject({
      id: "damen-haarschnitt",
      category: "Damen",
      title: "Haarschnitt",
      durationMinutes: 45,
      durationLabel: "45 Min.",
      priceLabel: "ab 26 €",
      note: "ab Schulter +15 €",
    });
  });

  it("keeps setup-incomplete fallback copy public and non-technical", () => {
    const renderedCopy = [
      setupIncompleteFallbackCopy.title,
      setupIncompleteFallbackCopy.body,
      setupIncompleteFallbackCopy.contactTitle,
      setupIncompleteFallbackCopy.contactBody,
    ].join(" ");

    expect(renderedCopy).toContain("Online sind gerade keine Zeiten verfuegbar");
    expect(renderedCopy).not.toMatch(/setup|admin|technisch|datenbank|konfiguration/i);
  });
});
