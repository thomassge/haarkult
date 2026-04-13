import { describe, expect, it } from "vitest";

import type { StaffSetupDto } from "@/lib/booking/setup-queries";
import { deriveStylistPreferenceOptions } from "@/app/termin-buchen/_lib/booking-flow-options";

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
    weeklyRanges: [],
    ...overrides,
  };
}

describe("deriveStylistPreferenceOptions", () => {
  it("skips stylist selection when one active eligible stylist exists", () => {
    const options = deriveStylistPreferenceOptions("damen-haarschnitt", [
      createStaff({ id: "staff-1", name: "Mira", slug: "mira" }),
      createStaff({
        id: "staff-2",
        name: "Lea",
        slug: "lea",
        assignedServices: [],
      }),
    ]);

    expect(options.showStylistStep).toBe(false);
    expect(options.resolvedStaffId).toBe("staff-1");
    expect(options.options).toEqual([]);
  });

  it("shows Keine Praeferenz first when multiple active stylists are eligible", () => {
    const options = deriveStylistPreferenceOptions("damen-haarschnitt", [
      createStaff({ id: "staff-1", name: "Mira", slug: "mira" }),
      createStaff({ id: "staff-2", name: "Lea", slug: "lea" }),
    ]);

    expect(options.showStylistStep).toBe(true);
    expect(options.resolvedStaffId).toBeNull();
    expect(options.options).toEqual([
      {
        id: "any",
        kind: "any",
        label: "Keine Praeferenz",
        staffId: null,
      },
      {
        id: "staff-1",
        kind: "staff",
        label: "Mira",
        staffId: "staff-1",
      },
      {
        id: "staff-2",
        kind: "staff",
        label: "Lea",
        staffId: "staff-2",
      },
    ]);
  });

  it("excludes inactive and unassigned staff from stylist eligibility", () => {
    const options = deriveStylistPreferenceOptions("damen-haarschnitt", [
      createStaff({ id: "staff-1", name: "Mira", slug: "mira", active: false }),
      createStaff({
        id: "staff-2",
        name: "Lea",
        slug: "lea",
        assignedServices: [],
      }),
      createStaff({ id: "staff-3", name: "Nora", slug: "nora" }),
    ]);

    expect(options.showStylistStep).toBe(false);
    expect(options.resolvedStaffId).toBe("staff-3");
    expect(options.options).toEqual([]);
  });
});
