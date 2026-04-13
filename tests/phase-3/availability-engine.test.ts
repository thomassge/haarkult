import { describe, expect, it } from "vitest";

import { booking } from "@/content/booking";
import {
  availabilityExceptions as availabilityExceptionsTable,
  bookings as bookingsTable,
  staff as staffTable,
  staffServices as staffServicesTable,
  weeklyAvailability as weeklyAvailabilityTable,
} from "@/db/schema";
import { GET as getSlotsRoute } from "@/app/api/booking/slots/route";
import {
  calculateAvailableSlots,
  formatSlotId,
  getIsoWeekday,
  overlaps,
  type AvailabilityInput,
  type AvailabilityStaff,
} from "@/lib/booking/availability";
import {
  getPublicAvailableSlots,
  loadPublicAvailabilityInput,
  PublicSlotQueryError,
} from "@/lib/booking/public-queries";
import { slotQuerySchema } from "@/lib/booking/public-validation";

const serviceId = "damen-haarschnitt";
const serviceDurationMinutes = 45;

const baseRules = {
  leadTimeHours: booking.leadTimeHours,
  maxAdvanceDays: booking.maxAdvanceDays,
  slotStepMinutes: booking.slotStepMinutes,
};

const anna: AvailabilityStaff = {
  id: "staff-anna",
  name: "Anna",
  active: true,
  serviceIds: [serviceId],
  weeklyRanges: [{ weekday: 1, startMinutes: 9 * 60, endMinutes: 12 * 60 }],
};

const bernd: AvailabilityStaff = {
  id: "staff-bernd",
  name: "Bernd",
  active: true,
  serviceIds: [serviceId],
  weeklyRanges: [{ weekday: 1, startMinutes: 10 * 60, endMinutes: 11 * 60 }],
};

function createInput(overrides: Partial<AvailabilityInput> = {}): AvailabilityInput {
  return {
    serviceId,
    serviceDurationMinutes,
    localDate: "2026-06-15",
    now: new Date("2026-06-14T08:00:00.000Z"),
    staff: [anna],
    exceptions: [],
    existingBookings: [],
    stylistPreference: { kind: "staff", staffId: anna.id },
    rules: baseRules,
    ...overrides,
  };
}

describe("availability engine", () => {
  it("uses ISO weekdays and half-open window overlaps", () => {
    expect(getIsoWeekday(new Date("2026-06-15T10:00:00.000Z"))).toBe(1);
    expect(getIsoWeekday(new Date("2026-06-21T10:00:00.000Z"))).toBe(7);

    expect(
      overlaps(
        { startAt: new Date("2026-06-15T09:00:00.000Z"), endAt: new Date("2026-06-15T09:30:00.000Z") },
        { startAt: new Date("2026-06-15T09:30:00.000Z"), endAt: new Date("2026-06-15T10:00:00.000Z") }
      )
    ).toBe(false);
    expect(
      overlaps(
        { startAt: new Date("2026-06-15T09:00:00.000Z"), endAt: new Date("2026-06-15T09:45:00.000Z") },
        { startAt: new Date("2026-06-15T09:30:00.000Z"), endAt: new Date("2026-06-15T10:00:00.000Z") }
      )
    ).toBe(true);
  });

  it("generates slot-step candidates that fit the full service duration inside weekly ranges", () => {
    const slots = calculateAvailableSlots(createInput());

    expect(slots.map((slot) => slot.startAt.toISOString())).toEqual([
      "2026-06-15T07:00:00.000Z",
      "2026-06-15T07:15:00.000Z",
      "2026-06-15T07:30:00.000Z",
      "2026-06-15T07:45:00.000Z",
      "2026-06-15T08:00:00.000Z",
      "2026-06-15T08:15:00.000Z",
      "2026-06-15T08:30:00.000Z",
      "2026-06-15T08:45:00.000Z",
      "2026-06-15T09:00:00.000Z",
      "2026-06-15T09:15:00.000Z",
    ]);
    expect(slots[0]).toMatchObject({
      staffId: "staff-anna",
      staffName: "Anna",
      endAt: new Date("2026-06-15T07:45:00.000Z"),
    });
    expect(formatSlotId(slots[0])).toBe("staff-anna:2026-06-15T07:00:00.000Z");
    expect(slots[0].slotId).toBe(formatSlotId(slots[0]));
  });

  it("enforces lead time and booking horizon from booking rules", () => {
    expect(
      calculateAvailableSlots(
        createInput({
          localDate: "2026-06-14",
          now: new Date("2026-06-14T08:00:00.000Z"),
        })
      )
    ).toEqual([]);

    expect(
      calculateAvailableSlots(
        createInput({
          localDate: "2026-08-20",
          now: new Date("2026-06-14T08:00:00.000Z"),
        })
      )
    ).toEqual([]);
  });

  it("blocks exception windows and active booking overlaps while ignoring closed booking statuses", () => {
    const slots = calculateAvailableSlots(
      createInput({
        exceptions: [
          {
            staffId: anna.id,
            startAt: new Date("2026-06-15T07:30:00.000Z"),
            endAt: new Date("2026-06-15T08:15:00.000Z"),
          },
        ],
        existingBookings: [
          {
            staffId: anna.id,
            status: "confirmed",
            startAt: new Date("2026-06-15T08:45:00.000Z"),
            endAt: new Date("2026-06-15T09:15:00.000Z"),
          },
          {
            staffId: anna.id,
            status: "cancelled",
            startAt: new Date("2026-06-15T09:15:00.000Z"),
            endAt: new Date("2026-06-15T10:00:00.000Z"),
          },
          {
            staffId: anna.id,
            status: "completed",
            startAt: new Date("2026-06-15T09:15:00.000Z"),
            endAt: new Date("2026-06-15T10:00:00.000Z"),
          },
          {
            staffId: anna.id,
            status: "no_show",
            startAt: new Date("2026-06-15T09:15:00.000Z"),
            endAt: new Date("2026-06-15T10:00:00.000Z"),
          },
        ],
      })
    );

    expect(slots.map((slot) => slot.startAt.toISOString())).toEqual([
      "2026-06-15T09:15:00.000Z",
    ]);
  });

  it("returns no slots for inactive, unassigned, or unknown selected staff", () => {
    const inactiveStaff = { ...anna, active: false };
    const unassignedStaff = { ...anna, serviceIds: [] };

    expect(calculateAvailableSlots(createInput({ staff: [inactiveStaff] }))).toEqual([]);
    expect(calculateAvailableSlots(createInput({ staff: [unassignedStaff] }))).toEqual([]);
    expect(
      calculateAvailableSlots(
        createInput({
          stylistPreference: { kind: "staff", staffId: "missing-staff" },
        })
      )
    ).toEqual([]);
  });

  it("searches all eligible staff for Keine Praeferenz and returns concrete staff ids", () => {
    const slots = calculateAvailableSlots(
      createInput({
        staff: [anna, bernd, { ...anna, id: "staff-inactive", active: false }],
        stylistPreference: { kind: "none" },
      })
    );

    expect(slots).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ staffId: "staff-anna", staffName: "Anna" }),
        expect.objectContaining({ staffId: "staff-bernd", staffName: "Bernd" }),
      ])
    );
    expect(slots.every((slot) => Boolean(slot.staffId) && Boolean(slot.slotId))).toBe(true);
  });
});

describe("public slot queries", () => {
  it("validates public slot query params with optional Keine Praeferenz staff", () => {
    expect(
      slotQuerySchema.parse({
        serviceId: "damen-haarschnitt",
        date: "2026-06-15",
        staffId: "",
      })
    ).toEqual({
      serviceId: "damen-haarschnitt",
      date: "2026-06-15",
      staffId: undefined,
    });
    expect(
      slotQuerySchema.safeParse({
        serviceId: "damen-haarschnitt",
        date: "15.06.2026",
      }).success
    ).toBe(false);
  });

  it("rejects invalid service ids and unknown staff ids before returning slots", async () => {
    await expect(
      loadPublicAvailabilityInput(
        { serviceId: "does-not-exist", date: "2026-06-15", staffId: undefined },
        { client: createPublicClient(), now: new Date("2026-06-14T08:00:00.000Z") }
      )
    ).rejects.toBeInstanceOf(PublicSlotQueryError);

    await expect(
      loadPublicAvailabilityInput(
        { serviceId, date: "2026-06-15", staffId: "missing-staff" },
        { client: createPublicClient(), now: new Date("2026-06-14T08:00:00.000Z") }
      )
    ).rejects.toBeInstanceOf(PublicSlotQueryError);
  });

  it("uses an injected transaction-like client and builds availability input for submit re-checks", async () => {
    const selectedTables: unknown[] = [];
    const client = createPublicClient(selectedTables);
    const input = await loadPublicAvailabilityInput(
      { serviceId, date: "2026-06-15", staffId: "staff-anna" },
      { client, now: new Date("2026-06-14T08:00:00.000Z") }
    );

    expect(selectedTables).toEqual([
      staffTable,
      staffServicesTable,
      weeklyAvailabilityTable,
      availabilityExceptionsTable,
      bookingsTable,
    ]);
    expect(input).toMatchObject({
      serviceId,
      serviceDurationMinutes,
      localDate: "2026-06-15",
      stylistPreference: { kind: "staff", staffId: "staff-anna" },
    });
    expect(input.staff).toEqual(
      expect.arrayContaining([
      expect.objectContaining({
        id: "staff-anna",
        serviceIds: [serviceId],
        weeklyRanges: [{ weekday: 1, startMinutes: 540, endMinutes: 720 }],
      }),
      ])
    );
  });

  it("returns no-preference slots with concrete staff ids and same-date JSON-safe shape", async () => {
    const slots = await getPublicAvailableSlots(
      { serviceId, date: "2026-06-15", staffId: undefined },
      { client: createPublicClient(), now: new Date("2026-06-14T08:00:00.000Z") }
    );
    const json = JSON.parse(JSON.stringify({ slots }));

    expect(slots).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ staffId: "staff-anna", staffName: "Anna" }),
        expect.objectContaining({ staffId: "staff-bernd", staffName: "Bernd" }),
      ])
    );
    expect(slots.every((slot) => slot.startAt.toISOString().startsWith("2026-06-15"))).toBe(true);
    expect(json.slots[0]).toEqual({
      slotId: expect.stringContaining("staff-"),
      staffId: expect.any(String),
      staffName: expect.any(String),
      startAt: expect.stringMatching(/^2026-06-15T/),
      endAt: expect.stringMatching(/^2026-06-15T/),
    });
  });

  it("returns a public-safe 400 error from the route for invalid service ids", async () => {
    const response = await getSlotsRoute(
      new Request("https://example.test/api/booking/slots?serviceId=bad&date=2026-06-15")
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Ungueltige Anfrage." });
  });
});

function createPublicClient(selectedTables: unknown[] = []) {
  const rows = new Map<unknown, unknown[]>([
    [
      staffTable,
      [
        {
          id: "staff-anna",
          name: "Anna",
          slug: "anna",
          active: true,
          createdAt: new Date("2026-01-01T00:00:00.000Z"),
          updatedAt: new Date("2026-01-01T00:00:00.000Z"),
        },
        {
          id: "staff-bernd",
          name: "Bernd",
          slug: "bernd",
          active: true,
          createdAt: new Date("2026-01-01T00:00:00.000Z"),
          updatedAt: new Date("2026-01-01T00:00:00.000Z"),
        },
        {
          id: "staff-inactive",
          name: "Inactive",
          slug: "inactive",
          active: false,
          createdAt: new Date("2026-01-01T00:00:00.000Z"),
          updatedAt: new Date("2026-01-01T00:00:00.000Z"),
        },
      ],
    ],
    [
      staffServicesTable,
      [
        {
          staffId: "staff-anna",
          serviceId,
          createdAt: new Date("2026-01-01T00:00:00.000Z"),
        },
        {
          staffId: "staff-bernd",
          serviceId,
          createdAt: new Date("2026-01-01T00:00:00.000Z"),
        },
      ],
    ],
    [
      weeklyAvailabilityTable,
      [
        {
          id: "weekly-anna",
          staffId: "staff-anna",
          weekday: 1,
          startMinutes: 540,
          endMinutes: 720,
          createdAt: new Date("2026-01-01T00:00:00.000Z"),
          updatedAt: new Date("2026-01-01T00:00:00.000Z"),
        },
        {
          id: "weekly-bernd",
          staffId: "staff-bernd",
          weekday: 1,
          startMinutes: 600,
          endMinutes: 660,
          createdAt: new Date("2026-01-01T00:00:00.000Z"),
          updatedAt: new Date("2026-01-01T00:00:00.000Z"),
        },
      ],
    ],
    [
      availabilityExceptionsTable,
      [
        {
          id: "exception-other-day",
          staffId: "staff-anna",
          type: "break",
          label: null,
          allDay: false,
          startAt: new Date("2026-06-16T07:30:00.000Z"),
          endAt: new Date("2026-06-16T08:00:00.000Z"),
          notes: null,
          createdAt: new Date("2026-01-01T00:00:00.000Z"),
          updatedAt: new Date("2026-01-01T00:00:00.000Z"),
        },
      ],
    ],
    [
      bookingsTable,
      [
        {
          id: "booking-confirmed",
          status: "confirmed",
          serviceId,
          serviceTitle: "Haarschnitt",
          serviceCategory: "Damen",
          serviceDurationMinutes,
          servicePriceLabel: "ab 26 EUR",
          staffId: "staff-anna",
          customerName: "Kundin",
          customerPhone: "06181",
          customerEmail: "kundin@example.test",
          customerNote: null,
          startAt: new Date("2026-06-15T07:30:00.000Z"),
          endAt: new Date("2026-06-15T08:15:00.000Z"),
          source: "online",
          createdAt: new Date("2026-01-01T00:00:00.000Z"),
          updatedAt: new Date("2026-01-01T00:00:00.000Z"),
        },
        {
          id: "booking-cancelled",
          status: "cancelled",
          serviceId,
          serviceTitle: "Haarschnitt",
          serviceCategory: "Damen",
          serviceDurationMinutes,
          servicePriceLabel: "ab 26 EUR",
          staffId: "staff-bernd",
          customerName: "Kunde",
          customerPhone: "06181",
          customerEmail: "kunde@example.test",
          customerNote: null,
          startAt: new Date("2026-06-15T08:00:00.000Z"),
          endAt: new Date("2026-06-15T08:45:00.000Z"),
          source: "online",
          createdAt: new Date("2026-01-01T00:00:00.000Z"),
          updatedAt: new Date("2026-01-01T00:00:00.000Z"),
        },
      ],
    ],
  ]);

  return {
    select: () => ({
      from: async <TRow,>(table: unknown) => {
        selectedTables.push(table);

        return (rows.get(table) ?? []) as TRow[];
      },
    }),
  };
}
