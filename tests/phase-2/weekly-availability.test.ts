import { describe, expect, it } from "vitest";

import {
  validateNoWeeklyOverlaps,
  weeklyAvailabilityInputSchema,
  weekdayLabelByIsoDay,
} from "@/lib/booking/setup-validation";

describe("weekly availability validation", () => {
  it("uses ISO weekdays 1..7 with Monday as 1", () => {
    expect(weekdayLabelByIsoDay[1]).toBe("Montag");
    expect(weekdayLabelByIsoDay[7]).toBe("Sonntag");
    expect(weeklyAvailabilityInputSchema.safeParse({ weekday: 0, startMinutes: 540, endMinutes: 600 }).success).toBe(false);
    expect(weeklyAvailabilityInputSchema.safeParse({ weekday: 8, startMinutes: 540, endMinutes: 600 }).success).toBe(false);
  });

  it("rejects minutes outside the day, inverted ranges, and non-slot-aligned values", () => {
    expect(weeklyAvailabilityInputSchema.safeParse({ weekday: 1, startMinutes: -15, endMinutes: 600 }).success).toBe(false);
    expect(weeklyAvailabilityInputSchema.safeParse({ weekday: 1, startMinutes: 540, endMinutes: 1441 }).success).toBe(false);
    expect(weeklyAvailabilityInputSchema.safeParse({ weekday: 1, startMinutes: 600, endMinutes: 540 }).success).toBe(false);
    expect(weeklyAvailabilityInputSchema.safeParse({ weekday: 1, startMinutes: 542, endMinutes: 600 }).success).toBe(false);
  });

  it("accepts adjacent weekly ranges and rejects overlapping ranges for the same stylist weekday", () => {
    expect(
      validateNoWeeklyOverlaps([
        { weekday: 1, startMinutes: 540, endMinutes: 720 },
        { weekday: 1, startMinutes: 720, endMinutes: 900 },
        { weekday: 2, startMinutes: 600, endMinutes: 780 },
      ])
    ).toEqual({ success: true });

    expect(
      validateNoWeeklyOverlaps([
        { weekday: 1, startMinutes: 540, endMinutes: 720 },
        { weekday: 1, startMinutes: 700, endMinutes: 900 },
      ])
    ).toEqual({
      success: false,
      message: "Arbeitszeiten duerfen sich pro Wochentag nicht ueberschneiden.",
    });
  });
});
