import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { bookableServices } from "@/lib/booking/catalog";
import {
  resolveAssignedServiceIds,
  serviceAssignmentInputSchema,
  validateKnownBookableServiceIds,
} from "@/lib/booking/setup-validation";

function readWorkspaceFile(relativePath: string) {
  return readFileSync(path.resolve(process.cwd(), relativePath), "utf8");
}

describe("service assignment validation", () => {
  it("resolves Alle Leistungen to every current bookable service id", () => {
    const parsed = serviceAssignmentInputSchema.parse({
      allServices: true,
      serviceIds: [],
    });

    expect(resolveAssignedServiceIds(parsed)).toEqual(
      bookableServices.map((service) => service.id)
    );
  });

  it("accepts a non-empty unique list of known individual service ids", () => {
    const [firstService, secondService] = bookableServices;

    const parsed = serviceAssignmentInputSchema.parse({
      allServices: false,
      serviceIds: [firstService.id, secondService.id, firstService.id],
    });

    expect(resolveAssignedServiceIds(parsed)).toEqual([firstService.id, secondService.id]);
  });

  it("rejects unknown service ids in individual mode", () => {
    expect(() =>
      serviceAssignmentInputSchema.parse({
        allServices: false,
        serviceIds: [bookableServices[0].id, "marketing-only-service"],
      })
    ).toThrow();
    expect(validateKnownBookableServiceIds(["marketing-only-service"])).toBe(false);
  });

  it("keeps assignment persistence tied to service ids only", () => {
    const validationSource = readWorkspaceFile("lib/booking/setup-validation.ts");

    expect(validationSource).toMatch(/allServices/);
    expect(validationSource).toMatch(/bookableServices/);
    expect(validationSource).not.toMatch(/content\/team|@\/content\/team/);
  });

  it("guards staff service mutations and persists service ids without catalog snapshots", () => {
    const source = readWorkspaceFile("lib/booking/setup-actions.ts");
    const requireAdminCalls = source.match(/requireAdmin\(\)/g) ?? [];

    expect(source).toMatch(/"use server"/);
    expect(source).toMatch(/saveStylistAction/);
    expect(source).toMatch(/deactivateStylistAction/);
    expect(requireAdminCalls.length).toBeGreaterThanOrEqual(2);
    expect(source).toMatch(/staffServices/);
    expect(source).toMatch(/serviceId/);
    expect(source).not.toMatch(/serviceTitle|servicePriceLabel|serviceDurationMinutes/);
  });
});
