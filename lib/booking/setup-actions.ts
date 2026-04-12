"use server";

import { randomUUID } from "node:crypto";

import { eq, like } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { staff, staffServices } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/admin-session";
import {
  normalizeStaffSlug,
  resolveAssignedServiceIds,
  serviceAssignmentInputSchema,
  staffInputSchema,
} from "@/lib/booking/setup-validation";

function formBoolean(values: FormDataEntryValue[], defaultValue = false) {
  if (values.length === 0) {
    return defaultValue;
  }

  const value = values.at(-1);

  return value === "on" || value === "true" || value === "1";
}

function parseStylistFormData(formData: FormData) {
  const staffInput = staffInputSchema.parse({
    id: formData.get("id")?.toString() || undefined,
    name: formData.get("name"),
    active: formBoolean(formData.getAll("active"), true),
  });
  const assignmentInput = serviceAssignmentInputSchema.parse({
    allServices: formBoolean(formData.getAll("allServices")),
    serviceIds: formData.getAll("serviceIds").map((value) => value.toString()),
  });

  return {
    staffInput,
    assignedServiceIds: resolveAssignedServiceIds(assignmentInput),
  };
}

async function createUniqueSlug(baseSlug: string, existingStaffId?: string) {
  const { db } = await import("@/db");
  const rows = await db
    .select({
      id: staff.id,
      slug: staff.slug,
    })
    .from(staff)
    .where(like(staff.slug, `${baseSlug}%`));
  const usedSlugs = new Set(
    rows.filter((row) => row.id !== existingStaffId).map((row) => row.slug)
  );

  if (!usedSlugs.has(baseSlug)) {
    return baseSlug;
  }

  let suffix = 2;
  while (usedSlugs.has(`${baseSlug}-${suffix}`)) {
    suffix += 1;
  }

  return `${baseSlug}-${suffix}`;
}

export async function saveStylistAction(formData: FormData) {
  await requireAdmin();

  const { db } = await import("@/db");
  const { staffInput, assignedServiceIds } = parseStylistFormData(formData);
  const now = new Date();
  const staffId = staffInput.id ?? randomUUID();
  const slug = await createUniqueSlug(normalizeStaffSlug(staffInput.name), staffInput.id);

  await db.transaction(async (tx) => {
    if (staffInput.id) {
      await tx
        .update(staff)
        .set({
          name: staffInput.name,
          slug,
          active: staffInput.active,
          updatedAt: now,
        })
        .where(eq(staff.id, staffInput.id));
    } else {
      await tx.insert(staff).values({
        id: staffId,
        name: staffInput.name,
        slug,
        active: staffInput.active,
        createdAt: now,
        updatedAt: now,
      });
    }

    await tx.delete(staffServices).where(eq(staffServices.staffId, staffId));

    if (assignedServiceIds.length > 0) {
      await tx.insert(staffServices).values(
        assignedServiceIds.map((serviceId) => ({
          staffId,
          serviceId,
        }))
      );
    }
  });

  revalidatePath("/admin");
  revalidatePath("/admin/stylisten");
}

export async function deactivateStylistAction(formData: FormData) {
  await requireAdmin();

  const { db } = await import("@/db");
  const { id } = staffInputSchema
    .pick({ id: true })
    .required()
    .parse({ id: formData.get("id")?.toString() });

  await db
    .update(staff)
    .set({
      active: false,
      updatedAt: new Date(),
    })
    .where(eq(staff.id, id));

  revalidatePath("/admin");
  revalidatePath("/admin/stylisten");
}
