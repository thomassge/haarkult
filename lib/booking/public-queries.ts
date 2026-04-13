import { booking } from "@/content/booking";
import {
  availabilityExceptions,
  bookings,
  staff,
  staffServices,
  weeklyAvailability,
} from "@/db/schema";
import {
  calculateAvailableSlots,
  overlaps,
  type AvailabilityInput,
  type AvailabilitySlot,
  type ExistingBookingWindow,
} from "@/lib/booking/availability";
import { getBookableServiceById } from "@/lib/booking/catalog";
import type { SlotQueryInput } from "@/lib/booking/public-validation";

type StaffRow = typeof staff.$inferSelect;
type StaffServiceRow = typeof staffServices.$inferSelect;
type WeeklyAvailabilityRow = typeof weeklyAvailability.$inferSelect;
type AvailabilityExceptionRow = typeof availabilityExceptions.$inferSelect;
type BookingRow = typeof bookings.$inferSelect;

type SelectFromClient = {
  select: () => {
    from: <TRow>(table: unknown) => Promise<TRow[]>;
  };
};

export type PublicAvailabilityDeps = {
  client?: SelectFromClient;
  now?: Date;
};

export class PublicSlotQueryError extends Error {
  constructor(message = "Ungueltige Anfrage.") {
    super(message);
    this.name = "PublicSlotQueryError";
  }
}

export async function getPublicAvailableSlots(input: SlotQueryInput, deps: PublicAvailabilityDeps = {}): Promise<AvailabilitySlot[]> {
  return calculateAvailableSlots(await loadPublicAvailabilityInput(input, deps));
}

export async function loadPublicAvailabilityInput(
  input: SlotQueryInput,
  deps: PublicAvailabilityDeps = {}
): Promise<AvailabilityInput> {
  const service = getBookableServiceById(input.serviceId);

  if (!service || !isValidLocalDate(input.date)) {
    throw new PublicSlotQueryError();
  }

  const client = (deps.client ?? (await import("@/db")).db) as SelectFromClient;
  const [staffRows, serviceRows, weeklyRows, exceptionRows, bookingRows] = await Promise.all([
    selectFrom<StaffRow>(client, staff),
    selectFrom<StaffServiceRow>(client, staffServices),
    selectFrom<WeeklyAvailabilityRow>(client, weeklyAvailability),
    selectFrom<AvailabilityExceptionRow>(client, availabilityExceptions),
    selectFrom<BookingRow>(client, bookings),
  ]);
  const eligibleStaff = staffRows
    .map((staffRow) => ({
      id: staffRow.id,
      name: staffRow.name,
      active: staffRow.active,
      serviceIds: serviceRows
        .filter((serviceRow) => serviceRow.staffId === staffRow.id)
        .map((serviceRow) => serviceRow.serviceId),
      weeklyRanges: weeklyRows
        .filter((weeklyRow) => weeklyRow.staffId === staffRow.id)
        .map(({ weekday, startMinutes, endMinutes }) => ({
          weekday,
          startMinutes,
          endMinutes,
        })),
    }))
    .filter((staffRow) => staffRow.active && staffRow.serviceIds.includes(service.id));

  if (input.staffId && !eligibleStaff.some((staffRow) => staffRow.id === input.staffId)) {
    throw new PublicSlotQueryError();
  }

  const dayWindow = getBerlinDayWindow(input.date);

  return {
    serviceId: service.id,
    serviceDurationMinutes: service.booking.durationMinutes,
    localDate: input.date,
    now: deps.now ?? new Date(),
    staff: eligibleStaff,
    exceptions: exceptionRows
      .filter((exceptionRow) =>
        overlaps(
          { startAt: exceptionRow.startAt, endAt: exceptionRow.endAt },
          dayWindow
        )
      )
      .map(({ staffId, startAt, endAt }) => ({
        staffId,
        startAt,
        endAt,
      })),
    existingBookings: bookingRows
      .filter(
        (bookingRow) =>
          (bookingRow.status === "pending" || bookingRow.status === "confirmed") &&
          overlaps({ startAt: bookingRow.startAt, endAt: bookingRow.endAt }, dayWindow)
      )
      .map(({ staffId, status, startAt, endAt }) => ({
        staffId,
        status,
        startAt,
        endAt,
      })) satisfies ExistingBookingWindow[],
    stylistPreference: input.staffId
      ? { kind: "staff", staffId: input.staffId }
      : { kind: "none" },
    rules: {
      leadTimeHours: booking.leadTimeHours,
      maxAdvanceDays: booking.maxAdvanceDays,
      slotStepMinutes: booking.slotStepMinutes,
    },
  };
}

async function selectFrom<TRow>(client: SelectFromClient, table: unknown) {
  return client.select().from<TRow>(table);
}

function isValidLocalDate(localDate: string) {
  const [year, month, day] = localDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return date.toISOString().slice(0, 10) === localDate;
}

function getBerlinDayWindow(localDate: string) {
  return {
    startAt: createUtcDateForLocalMinute(localDate, 0),
    endAt: createUtcDateForLocalMinute(addLocalDays(localDate, 1), 0),
  };
}

function addLocalDays(localDate: string, days: number) {
  const [year, month, day] = localDate.split("-").map(Number);
  const next = new Date(Date.UTC(year, month - 1, day + days));

  return next.toISOString().slice(0, 10);
}

function createUtcDateForLocalMinute(localDate: string, minuteOfDay: number) {
  const [year, month, day] = localDate.split("-").map(Number);
  const hour = Math.floor(minuteOfDay / 60);
  const minute = minuteOfDay % 60;
  const utcTimestamp = Date.UTC(year, month - 1, day, hour, minute, 0);

  return new Date(utcTimestamp - getTimeZoneOffsetMs(new Date(utcTimestamp), "Europe/Berlin"));
}

function getTimeZoneOffsetMs(date: Date, timeZone: string) {
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
  const parts = Object.fromEntries(
    formatter.formatToParts(date).map((part) => [part.type, part.value])
  );
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
