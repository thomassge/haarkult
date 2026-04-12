import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  normalizeStaffSlug,
  staffInputSchema,
} from "@/lib/booking/setup-validation";

function readWorkspaceFile(relativePath: string) {
  return readFileSync(path.resolve(process.cwd(), relativePath), "utf8");
}

describe("staff setup validation", () => {
  it("requires a trimmed stylist name and defaults new stylists to active", () => {
    expect(() => staffInputSchema.parse({ name: "   " })).toThrow();

    const parsed = staffInputSchema.parse({ name: "  Ayse Yilmaz  " });

    expect(parsed).toEqual({
      id: undefined,
      name: "Ayse Yilmaz",
      active: true,
    });
  });

  it("accepts explicit inactive state for editing stylists", () => {
    const parsed = staffInputSchema.parse({
      id: "7d33c620-b105-4cb6-a19c-754d5f023f2c",
      name: "Mina",
      active: false,
    });

    expect(parsed.active).toBe(false);
  });

  it("normalizes names into stable lowercase kebab-case slugs", () => {
    expect(normalizeStaffSlug("  Änne Müller / Senior Stylist  ")).toBe(
      "aenne-mueller-senior-stylist"
    );
    expect(normalizeStaffSlug("Ayse  Yilmaz")).toBe("ayse-yilmaz");
  });

  it("keeps staff setup separate from public marketing team content", () => {
    const source = readWorkspaceFile("lib/booking/setup-validation.ts");

    expect(source).toMatch(/zod/);
    expect(source).toMatch(/bookableServices/);
    expect(source).not.toMatch(/content\/team|@\/content\/team/);
  });
});
