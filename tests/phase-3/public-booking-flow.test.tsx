import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { BookingConfig } from "@/content/booking";
import type { StaffSetupDataDto, StaffSetupDto } from "@/lib/booking/setup-queries";

import { bookableServices } from "@/lib/booking/catalog";
import {
  derivePublicBookingServiceOptions,
  setupIncompleteFallbackCopy,
} from "@/app/termin-buchen/_lib/booking-flow-options";

const submitPublicBookingActionMock = vi.hoisted(() =>
  vi.fn(async () => ({
    status: "success",
    bookingId: "booking-1",
    bookingStatus: "pending",
    heading: "Deine Anfrage ist angekommen",
    message: "Der Salon prueft den Termin und meldet sich persoenlich bei dir.",
    appointment: {
      serviceTitle: "Haarschnitt",
      staffId: "staff-1",
      startAt: "2026-06-15T07:00:00.000Z",
      endAt: "2026-06-15T07:45:00.000Z",
    },
  }))
);

vi.mock("@/lib/booking/public-actions", () => ({
  submitPublicBookingAction: submitPublicBookingActionMock,
}));

function createStaff(overrides: Partial<StaffSetupDto>): StaffSetupDto {
  return {
    id: "staff-1",
    name: "Mira",
    slug: "mira",
    active: true,
    assignedServices: [
      {
        staffId: "staff-1",
        serviceId: "damen-haarschnitt",
        serviceTitle: "Haarschnitt",
        serviceCategory: "Damen",
      },
    ],
    weeklyRanges: [
      {
        weekday: 2,
        startMinutes: 540,
        endMinutes: 1020,
      },
    ],
    ...overrides,
  };
}

function createSetupData(staff: StaffSetupDto[]): StaffSetupDataDto {
  return {
    staff,
    serviceOptions: bookableServices.map((service) => ({
      id: service.id,
      title: service.title,
      category: service.category,
    })),
    setupCompletion: {
      hasActiveStaff: staff.some((staffRow) => staffRow.active),
      staffMissingServices: [],
      staffMissingWeeklyHours: [],
      complete: true,
    },
  };
}

async function loadBookingPage(options: {
  booking?: (booking: BookingConfig) => BookingConfig;
  setupData: StaffSetupDataDto;
}) {
  vi.resetModules();
  vi.doUnmock("@/content/booking");
  vi.doMock("@/content/booking", async () => {
    const actual = await vi.importActual<typeof import("@/content/booking")>(
      "@/content/booking"
    );

    return {
      ...actual,
      booking: options.booking?.(actual.booking) ?? actual.booking,
    };
  });
  vi.doMock("@/lib/booking/setup-queries", () => ({
    getStaffSetupData: vi.fn(async () => options.setupData),
  }));

  const { default: BookingPage } = await import("@/app/termin-buchen/page");
  return BookingPage;
}

describe("public booking service options", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    submitPublicBookingActionMock.mockResolvedValue({
      status: "success",
      bookingId: "booking-1",
      bookingStatus: "pending",
      heading: "Deine Anfrage ist angekommen",
      message: "Der Salon prueft den Termin und meldet sich persoenlich bei dir.",
      appointment: {
        serviceTitle: "Haarschnitt",
        staffId: "staff-1",
        startAt: "2026-06-15T07:00:00.000Z",
        endAt: "2026-06-15T07:45:00.000Z",
      },
    });
    vi.stubGlobal("fetch", vi.fn(async () => createSlotsResponse([createSlot()])));
  });

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

describe("/termin-buchen public booking flow", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("renders the guided service and stylist flow when setup is complete", async () => {
    const BookingPage = await loadBookingPage({
      setupData: createSetupData([
        createStaff({ id: "staff-1", name: "Mira", slug: "mira" }),
        createStaff({ id: "staff-2", name: "Lea", slug: "lea" }),
      ]),
    });

    render(await BookingPage());

    expect(screen.getByText("1 Leistung")).toBeTruthy();
    expect(screen.getByText("2 Stylist")).toBeTruthy();
    expect(screen.getByText("3 Zeit")).toBeTruthy();
    expect(screen.getByText("4 Kontakt")).toBeTruthy();
    expect(screen.getByRole("button", { name: /Damen/i })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Haarschnitt/i })).toBeTruthy();
    expect(screen.getByText("Keine Praeferenz")).toBeTruthy();
    expect(screen.getByText("Termin anfragen")).toBeTruthy();
  });

  it("loads server slots after date selection and submits required contact fields", async () => {
    const BookingPage = await loadBookingPage({
      setupData: createSetupData([
        createStaff({ id: "staff-1", name: "Mira", slug: "mira" }),
      ]),
    });

    render(await BookingPage());
    fireEvent.click(screen.getAllByRole("button", { name: /^Datum /i })[0]);

    expect(screen.getByText("Freie Zeiten werden geladen...")).toBeTruthy();
    expect(await screen.findByRole("button", { name: /09:00/ })).toBeTruthy();
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/booking/slots?serviceId=damen-haarschnitt&date=")
    );

    fireEvent.click(screen.getByRole("button", { name: /09:00/ }));
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Mira Mustermann" },
    });
    fireEvent.change(screen.getByLabelText("Telefon"), {
      target: { value: "06181 12345" },
    });
    fireEvent.change(screen.getByLabelText("E-Mail"), {
      target: { value: "mira@example.test" },
    });
    fireEvent.change(screen.getByLabelText("Hinweis (optional)"), {
      target: { value: "Bitte vorher kurz anrufen." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Termin anfragen" }));

    await waitFor(() => expect(submitPublicBookingActionMock).toHaveBeenCalled());
    const submittedForm = submitPublicBookingActionMock.mock.calls[0]?.[1] as FormData;

    expect(submittedForm.get("serviceId")).toBe("damen-haarschnitt");
    expect(submittedForm.get("staffId")).toBe("staff-1");
    expect(submittedForm.get("name")).toBe("Mira Mustermann");
    expect(await screen.findByText("Deine Anfrage ist angekommen")).toBeTruthy();
    expect(screen.getByText("Der Salon prueft den Termin und meldet sich persoenlich bei dir.")).toBeTruthy();
  });

  it("preserves contact data and clears only the stale selected slot after conflict", async () => {
    submitPublicBookingActionMock.mockResolvedValueOnce({
      status: "slot_conflict",
      message:
        "Diese Zeit ist gerade nicht mehr verfuegbar. Deine Angaben bleiben erhalten. Bitte waehle eine neue Uhrzeit.",
      preservedInput: {
        serviceId: "damen-haarschnitt",
        date: "2026-06-15",
        slotId: "staff-1:2026-06-15T07:00:00.000Z",
        staffId: "staff-1",
        startAt: "2026-06-15T07:00:00.000Z",
        name: "Mira Mustermann",
        phone: "06181 12345",
        email: "mira@example.test",
        note: "Bitte vorher kurz anrufen.",
      },
      clearSlot: true,
    });
    const BookingPage = await loadBookingPage({
      setupData: createSetupData([
        createStaff({ id: "staff-1", name: "Mira", slug: "mira" }),
      ]),
    });

    render(await BookingPage());
    fireEvent.click(screen.getAllByRole("button", { name: /^Datum /i })[0]);
    fireEvent.click(await screen.findByRole("button", { name: /09:00/ }));
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Mira Mustermann" },
    });
    fireEvent.change(screen.getByLabelText("Telefon"), {
      target: { value: "06181 12345" },
    });
    fireEvent.change(screen.getByLabelText("E-Mail"), {
      target: { value: "mira@example.test" },
    });
    fireEvent.change(screen.getByLabelText("Hinweis (optional)"), {
      target: { value: "Bitte vorher kurz anrufen." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Termin anfragen" }));

    expect(
      await screen.findByText(
        "Diese Zeit ist gerade nicht mehr verfuegbar. Deine Angaben bleiben erhalten. Bitte waehle eine neue Uhrzeit."
      )
    ).toBeTruthy();
    expect((screen.getByLabelText("Name") as HTMLInputElement).value).toBe(
      "Mira Mustermann"
    );
    expect((screen.getByLabelText("Telefon") as HTMLInputElement).value).toBe(
      "06181 12345"
    );
    expect((screen.getByLabelText("E-Mail") as HTMLInputElement).value).toBe(
      "mira@example.test"
    );
    expect((screen.getByLabelText("Hinweis (optional)") as HTMLTextAreaElement).value).toBe(
      "Bitte vorher kurz anrufen."
    );
    expect(screen.getByRole("button", { name: "Termin anfragen" })).toHaveProperty(
      "disabled",
      true
    );
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("shows no-slot and retry states for slot lookup problems", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(createSlotsResponse([]));
    const BookingPage = await loadBookingPage({
      setupData: createSetupData([
        createStaff({ id: "staff-1", name: "Mira", slug: "mira" }),
      ]),
    });

    render(await BookingPage());
    fireEvent.click(screen.getAllByRole("button", { name: /^Datum /i })[0]);

    expect(await screen.findByText("Keine freien Zeiten gefunden")).toBeTruthy();
    expect(
      screen.getByText(
        "Waehle ein anderes Datum, eine andere Leistung oder eine andere Stylistin aus."
      )
    ).toBeTruthy();

    vi.mocked(fetch).mockRejectedValueOnce(new Error("network"));
    fireEvent.click(screen.getByText("Zeiten neu laden"));

    expect(
      await screen.findByText(
        "Freie Zeiten konnten nicht geladen werden. Bitte versuche es noch einmal."
      )
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: "Zeiten neu laden" })).toBeTruthy();
  });

  it("skips stylist selection when one eligible stylist can perform the service", async () => {
    const BookingPage = await loadBookingPage({
      setupData: createSetupData([
        createStaff({ id: "staff-1", name: "Mira", slug: "mira" }),
      ]),
    });

    render(await BookingPage());

    expect(screen.getByText("1 Leistung")).toBeTruthy();
    expect(screen.queryByText("2 Stylist")).toBeNull();
    expect(screen.queryByText("Keine Praeferenz")).toBeNull();
    expect(screen.getByText("2 Zeit")).toBeTruthy();
    expect(screen.getByText("3 Kontakt")).toBeTruthy();
  });

  it("renders public contact fallback without booking controls when setup is incomplete", async () => {
    const BookingPage = await loadBookingPage({
      setupData: {
        ...createSetupData([]),
        setupCompletion: {
          hasActiveStaff: false,
          staffMissingServices: [],
          staffMissingWeeklyHours: [],
          complete: false,
        },
      },
    });

    render(await BookingPage());

    expect(screen.getByText("Termin direkt anfragen")).toBeTruthy();
    expect(
      screen.getByText(
        "Online sind gerade keine Zeiten verfuegbar. Du erreichst den Salon direkt per Telefon, WhatsApp oder E-Mail."
      )
    ).toBeTruthy();
    expect(screen.getByRole("link", { name: /Anrufen/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /WhatsApp/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /E-Mail/i })).toBeTruthy();
    expect(screen.queryByText("1 Leistung")).toBeNull();
    expect(screen.queryByText(/setup|admin|technisch|datenbank|konfiguration/i)).toBeNull();
  });
});

function createSlot() {
  return {
    slotId: "staff-1:2026-06-15T07:00:00.000Z",
    staffId: "staff-1",
    staffName: "Mira",
    startAt: "2026-06-15T07:00:00.000Z",
    endAt: "2026-06-15T07:45:00.000Z",
  };
}

function createSlotsResponse(slots: ReturnType<typeof createSlot>[]) {
  return Response.json({ slots });
}
