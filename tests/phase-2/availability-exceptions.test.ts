import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  availabilityExceptionInputSchema,
  normalizeAvailabilityException,
} from "@/lib/booking/setup-validation";

function readWorkspaceFile(relativePath: string) {
  return readFileSync(path.resolve(process.cwd(), relativePath), "utf8");
}

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

  it("protects exception persistence with admin auth, queries, and schema window checks", () => {
    const actionsSource = readWorkspaceFile("lib/booking/setup-actions.ts");
    const queriesSource = readWorkspaceFile("lib/booking/setup-queries.ts");
    const schemaSource = readWorkspaceFile("db/schema.ts");

    expect(actionsSource).toMatch(/saveAvailabilityExceptionAction/);
    expect(actionsSource).toMatch(/saveAvailabilityExceptionAction[\s\S]*requireAdmin\(\)/);
    expect(actionsSource).toMatch(/deleteAvailabilityExceptionAction/);
    expect(actionsSource).toMatch(/deleteAvailabilityExceptionAction[\s\S]*requireAdmin\(\)/);
    expect(queriesSource).toMatch(/getAvailabilityExceptionSetupData/);
    expect(schemaSource).toMatch(/availability_exceptions[\s\S]*check\(/);
    expect(schemaSource).toMatch(/endAt[\s\S]*>[\s\S]*startAt/);
  });
});
