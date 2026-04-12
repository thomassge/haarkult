import { z } from "zod";

import { booking } from "@/content/booking";
import { bookableServices } from "@/lib/booking/catalog";

const bookableServiceIds = new Set(bookableServices.map((service) => service.id));
const berlinTimeZone = "Europe/Berlin";
const invalidExceptionRangeMessage = "Bitte einen gueltigen Zeitraum angeben.";

export const WEEKDAYS_ISO = [1, 2, 3, 4, 5, 6, 7] as const;
export type IsoWeekday = (typeof WEEKDAYS_ISO)[number];

// ISO weekdays are 1..7 with Monday as 1. Phase 3 availability uses this convention.
export const weekdayLabelByIsoDay: Record<IsoWeekday, string> = {
  1: "Montag",
  2: "Dienstag",
  3: "Mittwoch",
  4: "Donnerstag",
  5: "Freitag",
  6: "Samstag",
  7: "Sonntag",
};

const exceptionTypes = ["vacation", "break", "blocked"] as const;

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

export const weeklyAvailabilityInputSchema = z
  .object({
    weekday: z.coerce.number().int().min(1).max(7),
    startMinutes: z.coerce.number().int().min(0).max(1440),
    endMinutes: z.coerce.number().int().min(0).max(1440),
  })
  .refine((input) => input.startMinutes < input.endMinutes, {
    message: "Die Startzeit muss vor der Endzeit liegen.",
    path: ["endMinutes"],
  })
  .refine(
    (input) =>
      input.startMinutes % booking.slotStepMinutes === 0 &&
      input.endMinutes % booking.slotStepMinutes === 0,
    {
      message: "Arbeitszeiten muessen zum Buchungsraster passen.",
      path: ["startMinutes"],
    }
  );

export type WeeklyAvailabilityInput = z.infer<typeof weeklyAvailabilityInputSchema>;

export function validateNoWeeklyOverlaps(ranges: WeeklyAvailabilityInput[]) {
  const rangesByWeekday = new Map<number, WeeklyAvailabilityInput[]>();

  for (const range of ranges) {
    const current = rangesByWeekday.get(range.weekday) ?? [];
    current.push(range);
    rangesByWeekday.set(range.weekday, current);
  }

  for (const weekdayRanges of rangesByWeekday.values()) {
    const sortedRanges = [...weekdayRanges].sort(
      (left, right) => left.startMinutes - right.startMinutes
    );

    for (let index = 1; index < sortedRanges.length; index += 1) {
      const previous = sortedRanges[index - 1];
      const current = sortedRanges[index];

      if (current.startMinutes < previous.endMinutes) {
        return {
          success: false as const,
          message: "Arbeitszeiten duerfen sich pro Wochentag nicht ueberschneiden.",
        };
      }
    }
  }

  return { success: true as const };
}

const localDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const dateTimeSchema = z.union([z.string().trim().min(1), z.date()]).optional();

export const availabilityExceptionInputSchema = z
  .object({
    id: z.uuid().optional(),
    staffId: z.string().trim().min(1, "Bitte eine Stylistin oder einen Stylisten auswaehlen."),
    type: z.enum(exceptionTypes),
    allDay: z.coerce.boolean().default(false),
    localDate: localDateSchema.optional(),
    startAt: dateTimeSchema,
    endAt: dateTimeSchema,
    label: z.string().trim().max(120).optional(),
    notes: z.string().trim().max(1000).optional(),
  })
  .refine((input) => (input.allDay ? Boolean(input.localDate) : Boolean(input.startAt && input.endAt)), {
    message: "Bitte den Zeitraum vollstaendig angeben.",
    path: ["startAt"],
  });

export type AvailabilityExceptionInput = z.infer<typeof availabilityExceptionInputSchema>;

export function resolveAssignedServiceIds(input: ServiceAssignmentInput) {
  if (input.allServices) {
    return bookableServices.map((service) => service.id);
  }

  return input.serviceIds;
}

function getZonedDateTimeParts(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  return Object.fromEntries(
    formatter.formatToParts(date).map((part) => [part.type, part.value])
  );
}

function getTimeZoneOffsetMs(date: Date, timeZone: string) {
  const parts = getZonedDateTimeParts(date, timeZone);
  const zonedTimestamp = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  );

  return zonedTimestamp - date.getTime();
}

function assertValidExceptionDate(date: Date) {
  if (Number.isNaN(date.getTime())) {
    throw new Error(invalidExceptionRangeMessage);
  }

  return date;
}

function assertBerlinLocalDateTimeRoundTrip(
  date: Date,
  localDate: string,
  hour: number,
  minute: number
) {
  const parts = getZonedDateTimeParts(date, berlinTimeZone);
  const [year, month, day] = localDate.split("-");

  if (
    parts.year !== year ||
    parts.month !== month ||
    parts.day !== day ||
    parts.hour !== String(hour).padStart(2, "0") ||
    parts.minute !== String(minute).padStart(2, "0")
  ) {
    throw new Error(invalidExceptionRangeMessage);
  }
}

function berlinLocalDateTimeToUtc(localDate: string, hour = 0, minute = 0) {
  const [year, month, day] = localDate.split("-").map(Number);
  const localTimestamp = Date.UTC(year, month - 1, day, hour, minute, 0);
  const firstPass = new Date(localTimestamp - getTimeZoneOffsetMs(new Date(localTimestamp), berlinTimeZone));
  const secondOffset = getTimeZoneOffsetMs(firstPass, berlinTimeZone);
  const utcDate = assertValidExceptionDate(new Date(localTimestamp - secondOffset));

  assertBerlinLocalDateTimeRoundTrip(utcDate, localDate, hour, minute);

  return utcDate;
}

function addLocalDays(localDate: string, days: number) {
  const [year, month, day] = localDate.split("-").map(Number);
  const next = new Date(Date.UTC(year, month - 1, day + days));

  return next.toISOString().slice(0, 10);
}

function parseExceptionDate(input: string | Date | undefined) {
  if (!input) {
    throw new Error("Bitte den Zeitraum vollstaendig angeben.");
  }

  if (typeof input === "string") {
    const localMatch = input.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})$/);

    if (localMatch) {
      return berlinLocalDateTimeToUtc(localMatch[1], Number(localMatch[2]), Number(localMatch[3]));
    }
  }

  return assertValidExceptionDate(input instanceof Date ? input : new Date(input));
}

export function normalizeAvailabilityException(input: AvailabilityExceptionInput) {
  const parsed = availabilityExceptionInputSchema.parse(input);

  if (parsed.allDay) {
    const localDate = parsed.localDate;

    if (!localDate) {
      throw new Error("Bitte den Zeitraum vollstaendig angeben.");
    }

    return {
      ...parsed,
      startAt: berlinLocalDateTimeToUtc(localDate),
      endAt: berlinLocalDateTimeToUtc(addLocalDays(localDate, 1)),
    };
  }

  const startAt = parseExceptionDate(parsed.startAt);
  const endAt = parseExceptionDate(parsed.endAt);

  if (endAt <= startAt) {
    throw new Error("Das Ende muss nach dem Start liegen.");
  }

  return {
    ...parsed,
    startAt,
    endAt,
    localDate: undefined,
  };
}
