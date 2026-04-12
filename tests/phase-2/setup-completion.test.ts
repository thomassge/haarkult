import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { bookableServices } from "@/lib/booking/catalog";
import {
  deriveSetupCompletion,
  type StaffSetupCompletionInput,
} from "@/lib/booking/setup-queries";

function readWorkspaceFile(relativePath: string) {
  return readFileSync(path.resolve(process.cwd(), relativePath), "utf8");
}

const completeStaff: StaffSetupCompletionInput = {
  id: "staff-1",
  name: "Mina",
  active: true,
  serviceIds: [bookableServices[0].id],
  weeklyRanges: [{ weekday: 2, startMinutes: 540, endMinutes: 1020 }],
};

describe("admin setup completion", () => {
  it("is incomplete when there is no active stylist", () => {
    expect(deriveSetupCompletion([])).toEqual({
      hasActiveStaff: false,
      staffMissingServices: [],
      staffMissingWeeklyHours: [],
      complete: false,
    });
  });

  it("reports active stylists with no assigned services", () => {
    const result = deriveSetupCompletion([
      {
        ...completeStaff,
        serviceIds: [],
      },
    ]);

    expect(result.hasActiveStaff).toBe(true);
    expect(result.staffMissingServices).toEqual([{ id: "staff-1", name: "Mina" }]);
    expect(result.complete).toBe(false);
  });

  it("reports active stylists with no weekly hours", () => {
    const result = deriveSetupCompletion([
      {
        ...completeStaff,
        weeklyRanges: [],
      },
    ]);

    expect(result.staffMissingWeeklyHours).toEqual([{ id: "staff-1", name: "Mina" }]);
    expect(result.complete).toBe(false);
  });

  it("ignores inactive stylists and completes only when every active stylist has services and hours", () => {
    const result = deriveSetupCompletion([
      completeStaff,
      {
        id: "inactive-staff",
        name: "Nicht buchbar",
        active: false,
        serviceIds: [],
        weeklyRanges: [],
      },
    ]);

    expect(result).toEqual({
      hasActiveStaff: true,
      staffMissingServices: [],
      staffMissingWeeklyHours: [],
      complete: true,
    });
  });

  it("keeps setup query DTOs separate from admin credentials and public team content", () => {
    const source = readWorkspaceFile("lib/booking/setup-queries.ts");

    expect(source).not.toMatch(/adminUsers|passwordHash/);
    expect(source).not.toMatch(/content\/team|@\/content\/team/);
  });
});
