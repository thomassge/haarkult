"use server";

import { randomUUID } from "node:crypto";

import { eq, like } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { availabilityExceptions, staff, staffServices, weeklyAvailability } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/admin-session";
import {
  availabilityExceptionInputSchema,
  normalizeStaffSlug,
  normalizeAvailabilityException,
  resolveAssignedServiceIds,
  serviceAssignmentInputSchema,
  staffInputSchema,
  validateNoWeeklyOverlaps,
  weeklyAvailabilityInputSchema,
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

function formString(formData: FormData, name: string) {
  const value = formData.get(name)?.toString().trim();

  return value || undefined;
}

function parseWeeklyAvailabilityFormData(formData: FormData) {
  const staffId = formString(formData, "staffId");

  if (!staffId) {
    throw new Error("Bitte eine Stylistin oder einen Stylisten auswaehlen.");
  }

  const rawRanges = formData.get("ranges")?.toString();
  const ranges = rawRanges
    ? JSON.parse(rawRanges)
    : formData.getAll("weekday").map((weekday, index) => ({
        weekday: weekday.toString(),
        startMinutes: formData.getAll("startMinutes")[index]?.toString(),
        endMinutes: formData.getAll("endMinutes")[index]?.toString(),
      }));
  const parsedRanges = weeklyAvailabilityInputSchema.array().parse(ranges);
  const overlapResult = validateNoWeeklyOverlaps(parsedRanges);

  if (!overlapResult.success) {
    throw new Error(overlapResult.message);
  }

  return {
    staffId,
    ranges: parsedRanges,
  };
}

function parseAvailabilityExceptionFormData(formData: FormData) {
  return normalizeAvailabilityException(
    availabilityExceptionInputSchema.parse({
      id: formString(formData, "id"),
      staffId: formString(formData, "staffId"),
      type: formString(formData, "type"),
      allDay: formBoolean(formData.getAll("allDay")),
      localDate: formString(formData, "localDate"),
      startAt: formString(formData, "startAt"),
      endAt: formString(formData, "endAt"),
      label: formString(formData, "label"),
      notes: formString(formData, "notes"),
    })
  );
}

async function assertStaffExists(staffId: string) {
  const { db } = await import("@/db");
  const [staffRow] = await db
    .select({ id: staff.id })
    .from(staff)
    .where(eq(staff.id, staffId))
    .limit(1);

  if (!staffRow) {
    throw new Error("Die ausgewaehlte Stylistin wurde nicht gefunden.");
  }
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

export async function saveWeeklyAvailabilityAction(formData: FormData) {
  await requireAdmin();

  const { db } = await import("@/db");
  const { staffId, ranges } = parseWeeklyAvailabilityFormData(formData);
  await assertStaffExists(staffId);
  const now = new Date();

  await db.transaction(async (tx) => {
    await tx.delete(weeklyAvailability).where(eq(weeklyAvailability.staffId, staffId));

    if (ranges.length > 0) {
      await tx.insert(weeklyAvailability).values(
        ranges.map((range) => ({
          id: randomUUID(),
          staffId,
          weekday: range.weekday,
          startMinutes: range.startMinutes,
          endMinutes: range.endMinutes,
          createdAt: now,
          updatedAt: now,
        }))
      );
    }
  });

  revalidatePath("/admin");
  revalidatePath("/admin/zeiten");
}

export async function saveAvailabilityExceptionAction(formData: FormData) {
  await requireAdmin();

  const { db } = await import("@/db");
  const input = parseAvailabilityExceptionFormData(formData);
  await assertStaffExists(input.staffId);
  const now = new Date();
  const exceptionId = input.id ?? randomUUID();
  const values = {
    staffId: input.staffId,
    type: input.type,
    label: input.label || null,
    allDay: input.allDay,
    startAt: input.startAt,
    endAt: input.endAt,
    notes: input.notes || null,
    updatedAt: now,
  };

  if (input.id) {
    await db
      .update(availabilityExceptions)
      .set(values)
      .where(eq(availabilityExceptions.id, input.id));
  } else {
    await db.insert(availabilityExceptions).values({
      id: exceptionId,
      ...values,
      createdAt: now,
    });
  }

  revalidatePath("/admin");
  revalidatePath("/admin/ausnahmen");
}

export async function deleteAvailabilityExceptionAction(formData: FormData) {
  await requireAdmin();

  const { db } = await import("@/db");
  const id = formString(formData, "id");

  if (!id) {
    throw new Error("Bitte eine Ausnahme auswaehlen.");
  }

  await db.delete(availabilityExceptions).where(eq(availabilityExceptions.id, id));

  revalidatePath("/admin");
  revalidatePath("/admin/ausnahmen");
}
