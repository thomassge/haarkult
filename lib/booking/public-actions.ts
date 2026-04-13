"use server";

import { sql } from "drizzle-orm";

import { booking, type BookingConfig } from "@/content/booking";
import { bookingEvents, bookings } from "@/db/schema";
import type { AvailabilitySlot } from "@/lib/booking/availability";
import {
  createBookingServiceSnapshot,
  getBookableServiceById,
} from "@/lib/booking/catalog";
import {
  getPublicAvailableSlots,
  PublicSlotQueryError,
  type PublicAvailabilityDeps,
} from "@/lib/booking/public-queries";
import {
  publicBookingSubmissionSchema,
  type PublicBookingSubmissionInput,
  type SlotQueryInput,
} from "@/lib/booking/public-validation";

export type StaffDayBookingLockInput = {
  staffId: string;
  date: string;
};

type InsertReturning = {
  values: (row: Record<string, unknown>) => {
    returning: () => Promise<Record<string, unknown>[]>;
  };
};

type SelectFromClient = {
  select: () => {
    from: <TRow>(table: unknown) => Promise<TRow[]>;
  };
};

export type PublicBookingTransaction = SelectFromClient & {
  execute: (query: unknown) => Promise<unknown>;
  insert: (table: unknown) => InsertReturning;
};

type PublicBookingDb = {
  transaction: <TResult>(
    callback: (tx: PublicBookingTransaction) => Promise<TResult>
  ) => Promise<TResult>;
};

export type PublicBookingDeps = {
  db?: PublicBookingDb;
  now?: Date;
  confirmationMode?: BookingConfig["confirmationMode"] | "automatic";
  generateId?: () => string;
  getAvailableSlots?: (
    input: SlotQueryInput,
    deps: PublicAvailabilityDeps & { client: PublicBookingTransaction }
  ) => Promise<AvailabilitySlot[]>;
  acquireLock?: (
    tx: PublicBookingTransaction,
    input: StaffDayBookingLockInput
  ) => Promise<void>;
};

export type PublicBookingPreservedInput = PublicBookingSubmissionInput;

export type PublicBookingSuccessResult = {
  status: "success";
  bookingId: string;
  bookingStatus: "pending" | "confirmed";
  heading: "Deine Anfrage ist angekommen" | "Dein Termin ist gebucht";
  message: string;
  appointment: {
    serviceTitle: string;
    staffId: string;
    startAt: string;
    endAt: string;
  };
};

export type PublicBookingSlotConflictResult = {
  status: "slot_conflict";
  message: "Diese Zeit ist gerade nicht mehr verfuegbar. Deine Angaben bleiben erhalten. Bitte waehle eine neue Uhrzeit.";
  preservedInput: PublicBookingPreservedInput;
  clearSlot: true;
};

export type PublicBookingValidationErrorResult = {
  status: "validation_error";
  message: "Bitte pruefe deine Angaben.";
  fieldErrors: Record<string, string[]>;
  preservedInput: Partial<PublicBookingSubmissionInput>;
};

export type PublicBookingResult =
  | PublicBookingSuccessResult
  | PublicBookingSlotConflictResult
  | PublicBookingValidationErrorResult;

const slotConflictMessage =
  "Diese Zeit ist gerade nicht mehr verfuegbar. Deine Angaben bleiben erhalten. Bitte waehle eine neue Uhrzeit." as const;

export async function submitPublicBookingAction(
  _previousState: PublicBookingResult | null,
  formData: FormData
): Promise<PublicBookingResult> {
  return createPublicBooking({
    serviceId: getFormValue(formData, "serviceId"),
    date: getFormValue(formData, "date"),
    slotId: getFormValue(formData, "slotId"),
    staffId: getFormValue(formData, "staffId"),
    startAt: getFormValue(formData, "startAt"),
    stylistPreferenceStaffId: getFormValue(formData, "stylistPreferenceStaffId"),
    name: getFormValue(formData, "name"),
    phone: getFormValue(formData, "phone"),
    email: getFormValue(formData, "email"),
    note: getFormValue(formData, "note"),
  });
}

export async function createPublicBooking(
  input: PublicBookingSubmissionInput,
  deps: PublicBookingDeps = {}
): Promise<PublicBookingResult> {
  const parsed = publicBookingSubmissionSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "validation_error",
      message: "Bitte pruefe deine Angaben.",
      fieldErrors: parsed.error.flatten().fieldErrors,
      preservedInput: preserveFormInput(input),
    };
  }

  const submission = parsed.data;
  const service = getBookableServiceById(submission.serviceId);

  if (!service) {
    return {
      status: "validation_error",
      message: "Bitte pruefe deine Angaben.",
      fieldErrors: { serviceId: ["Ungueltige Anfrage."] },
      preservedInput: submission,
    };
  }

  const db = deps.db ?? (await import("@/db")).db;
  const generateId = deps.generateId ?? crypto.randomUUID;
  const confirmationMode = deps.confirmationMode ?? booking.confirmationMode;
  const getAvailableSlots = deps.getAvailableSlots ?? getDefaultAvailableSlots;
  const acquireLock = deps.acquireLock ?? acquireStaffDayBookingLock;
  const initialStatus = confirmationMode === "manual" ? "pending" : "confirmed";

  try {
    return await db.transaction(async (tx) => {
      await acquireLock(tx, { staffId: submission.staffId, date: submission.date });

      const availableSlots = await getAvailableSlots(
        {
          serviceId: submission.serviceId,
          date: submission.date,
          staffId: submission.stylistPreferenceStaffId,
        },
        {
          client: tx,
          now: deps.now,
        }
      );
      const selectedSlot = findSelectedSlot(availableSlots, submission);

      if (!selectedSlot) {
        return createSlotConflictResult(submission);
      }

      const bookingId = generateId();
      const eventId = generateId();
      const serviceSnapshot = createBookingServiceSnapshot(service);
      const now = deps.now ?? new Date();
      const bookingRow = {
        id: bookingId,
        status: initialStatus,
        serviceId: serviceSnapshot.serviceId,
        serviceTitle: serviceSnapshot.serviceTitle,
        serviceCategory: serviceSnapshot.serviceCategory,
        serviceDurationMinutes: serviceSnapshot.serviceDurationMinutes,
        servicePriceLabel: serviceSnapshot.servicePriceLabel,
        staffId: selectedSlot.staffId,
        customerName: submission.name,
        customerPhone: submission.phone,
        customerEmail: submission.email,
        customerNote: submission.note ?? null,
        startAt: selectedSlot.startAt,
        endAt: selectedSlot.endAt,
        source: "online",
        createdAt: now,
        updatedAt: now,
      };

      await tx.insert(bookings).values(bookingRow).returning();
      await tx
        .insert(bookingEvents)
        .values({
          id: eventId,
          bookingId,
          eventType: "created",
          actorType: "customer",
          actorId: null,
          actorLabel: submission.name,
          metadata: {
            source: "public_booking",
            confirmationMode,
          },
          createdAt: now,
        })
        .returning();

      return {
        status: "success",
        bookingId,
        bookingStatus: initialStatus,
        heading:
          initialStatus === "pending"
            ? "Deine Anfrage ist angekommen"
            : "Dein Termin ist gebucht",
        message:
          initialStatus === "pending"
            ? "Wir pruefen deine Anfrage und melden uns zur Bestaetigung."
            : "Dein Termin wurde direkt bestaetigt.",
        appointment: {
          serviceTitle: serviceSnapshot.serviceTitle,
          staffId: selectedSlot.staffId,
          startAt: selectedSlot.startAt.toISOString(),
          endAt: selectedSlot.endAt.toISOString(),
        },
      };
    });
  } catch (error) {
    if (error instanceof PublicSlotQueryError) {
      return createSlotConflictResult(submission);
    }

    throw error;
  }
}

export async function acquireStaffDayBookingLock(
  tx: PublicBookingTransaction,
  input: StaffDayBookingLockInput
): Promise<void> {
  const lockKey = `public-booking:${input.staffId}:${input.date}`;

  await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${lockKey}, 0))`);
}

function findSelectedSlot(
  slots: AvailabilitySlot[],
  submission: PublicBookingSubmissionInput
) {
  return (
    slots.find(
      (slot) =>
        slot.slotId === submission.slotId &&
        slot.staffId === submission.staffId &&
        slot.startAt.toISOString() === submission.startAt
    ) ?? null
  );
}

async function getDefaultAvailableSlots(
  input: SlotQueryInput,
  deps: PublicAvailabilityDeps & { client: PublicBookingTransaction }
) {
  return getPublicAvailableSlots(input, deps);
}

function createSlotConflictResult(
  preservedInput: PublicBookingSubmissionInput
): PublicBookingSlotConflictResult {
  return {
    status: "slot_conflict",
    message: slotConflictMessage,
    preservedInput,
    clearSlot: true,
  };
}

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

function preserveFormInput(input: PublicBookingSubmissionInput) {
  return {
    serviceId: input.serviceId,
    date: input.date,
    slotId: input.slotId,
    staffId: input.staffId,
    startAt: input.startAt,
    stylistPreferenceStaffId: input.stylistPreferenceStaffId,
    name: input.name,
    phone: input.phone,
    email: input.email,
    note: input.note,
  };
}
