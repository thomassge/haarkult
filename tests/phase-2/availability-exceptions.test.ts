import { describe, expect, it } from "vitest";

import {
  availabilityExceptionInputSchema,
  normalizeAvailabilityException,
} from "@/lib/booking/setup-validation";

describe("availability exception validation", () => {
  it("accepts vacation, break, and blocked exception types", () => {
    const input = {
      staffId: "staff-1",
      type: "vacation",
      allDay: true,
      localDate: "2026-06-15",
    };

    expect(availabilityExceptionInputSchema.safeParse(input).success).toBe(true);
    expect(availabilityExceptionInputSchema.safeParse({ ...input, type: "break" }).success).toBe(true);
    expect(availabilityExceptionInputSchema.safeParse({ ...input, type: "blocked" }).success).toBe(true);
    expect(availabilityExceptionInputSchema.safeParse({ ...input, type: "holiday" }).success).toBe(false);
  });

  it("normalizes all-day exceptions to Europe/Berlin local-day UTC windows", () => {
    const normalized = normalizeAvailabilityException({
      staffId: "staff-1",
      type: "vacation",
      allDay: true,
      localDate: "2026-06-15",
      label: "Sommerurlaub",
      notes: "Ganzer Tag",
    });

    expect(normalized.startAt.toISOString()).toBe("2026-06-14T22:00:00.000Z");
    expect(normalized.endAt.toISOString()).toBe("2026-06-15T22:00:00.000Z");
    expect(normalized.label).toBe("Sommerurlaub");
    expect(normalized.notes).toBe("Ganzer Tag");
  });

  it("preserves timed exception timestamps and requires endAt after startAt", () => {
    const normalized = normalizeAvailabilityException({
      staffId: "staff-1",
      type: "break",
      allDay: false,
      startAt: "2026-06-15T10:00:00.000Z",
      endAt: "2026-06-15T10:30:00.000Z",
    });

    expect(normalized.startAt.toISOString()).toBe("2026-06-15T10:00:00.000Z");
    expect(normalized.endAt.toISOString()).toBe("2026-06-15T10:30:00.000Z");
    expect(() =>
      normalizeAvailabilityException({
        staffId: "staff-1",
        type: "break",
        allDay: false,
        startAt: "2026-06-15T10:30:00.000Z",
        endAt: "2026-06-15T10:00:00.000Z",
      })
    ).toThrow("Das Ende muss nach dem Start liegen.");
  });
});
