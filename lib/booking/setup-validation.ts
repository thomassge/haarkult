import { z } from "zod";

import { bookableServices } from "@/lib/booking/catalog";

const bookableServiceIds = new Set(bookableServices.map((service) => service.id));

export function normalizeStaffSlug(name: string) {
  const normalized = name
    .trim()
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "stylist";
}

export function validateKnownBookableServiceIds(ids: string[]) {
  return ids.every((id) => bookableServiceIds.has(id));
}

export const staffInputSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().trim().min(1, "Bitte einen Namen eingeben."),
  active: z.boolean().default(true),
});

export const serviceAssignmentInputSchema = z
  .object({
    allServices: z.boolean().default(false),
    serviceIds: z.array(z.string()).default([]),
  })
  .transform((input) => ({
    allServices: input.allServices,
    serviceIds: Array.from(new Set(input.serviceIds)),
  }))
  .refine(
    (input) =>
      input.allServices ||
      (input.serviceIds.length > 0 && validateKnownBookableServiceIds(input.serviceIds)),
    {
      message: "Bitte mindestens eine bekannte buchbare Leistung auswählen.",
      path: ["serviceIds"],
    }
  );

export type StaffInput = z.infer<typeof staffInputSchema>;
export type ServiceAssignmentInput = z.infer<typeof serviceAssignmentInputSchema>;

export function resolveAssignedServiceIds(input: ServiceAssignmentInput) {
  if (input.allServices) {
    return bookableServices.map((service) => service.id);
  }

  return input.serviceIds;
}
