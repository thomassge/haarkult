import { describe, expect, it } from "vitest";

import { booking } from "@/content/booking";
import {
  calculateAvailableSlots,
  formatSlotId,
  getIsoWeekday,
  overlaps,
  type AvailabilityInput,
  type AvailabilityStaff,
} from "@/lib/booking/availability";

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
      "2026-06-15T09:00:00.000Z",
      "2026-06-15T09:15:00.000Z",
      "2026-06-15T09:30:00.000Z",
      "2026-06-15T09:45:00.000Z",
      "2026-06-15T10:00:00.000Z",
      "2026-06-15T10:15:00.000Z",
      "2026-06-15T10:30:00.000Z",
      "2026-06-15T10:45:00.000Z",
      "2026-06-15T11:00:00.000Z",
      "2026-06-15T11:15:00.000Z",
    ]);
    expect(slots[0]).toMatchObject({
      staffId: "staff-anna",
      staffName: "Anna",
      endAt: new Date("2026-06-15T09:45:00.000Z"),
    });
    expect(formatSlotId(slots[0])).toBe("staff-anna:2026-06-15T09:00:00.000Z");
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
            startAt: new Date("2026-06-15T09:30:00.000Z"),
            endAt: new Date("2026-06-15T10:15:00.000Z"),
          },
        ],
        existingBookings: [
          {
            staffId: anna.id,
            status: "confirmed",
            startAt: new Date("2026-06-15T10:45:00.000Z"),
            endAt: new Date("2026-06-15T11:15:00.000Z"),
          },
          {
            staffId: anna.id,
            status: "cancelled",
            startAt: new Date("2026-06-15T11:15:00.000Z"),
            endAt: new Date("2026-06-15T12:00:00.000Z"),
          },
          {
            staffId: anna.id,
            status: "completed",
            startAt: new Date("2026-06-15T11:15:00.000Z"),
            endAt: new Date("2026-06-15T12:00:00.000Z"),
          },
          {
            staffId: anna.id,
            status: "no_show",
            startAt: new Date("2026-06-15T11:15:00.000Z"),
            endAt: new Date("2026-06-15T12:00:00.000Z"),
          },
        ],
      })
    );

    expect(slots.map((slot) => slot.startAt.toISOString())).toEqual([
      "2026-06-15T10:15:00.000Z",
      "2026-06-15T11:15:00.000Z",
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
