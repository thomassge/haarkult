import type { WeeklyRangeDto } from "@/lib/booking/setup-queries";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "no_show";

export type AvailabilityStaff = {
  id: string;
  name: string;
  active: boolean;
  serviceIds: string[];
  weeklyRanges: WeeklyRangeDto[];
};

export type AvailabilityExceptionWindow = {
  staffId: string;
  startAt: Date;
  endAt: Date;
};

export type ExistingBookingWindow = {
  staffId: string | null;
  status: BookingStatus;
  startAt: Date;
  endAt: Date;
};

export type AvailabilityRules = {
  leadTimeHours: number;
  maxAdvanceDays: number;
  slotStepMinutes: number;
};

export type StylistPreference =
  | { kind: "none" }
  | { kind: "staff"; staffId: string };

export type AvailabilityInput = {
  serviceId: string;
  serviceDurationMinutes: number;
  localDate: string;
  now: Date;
  staff: AvailabilityStaff[];
  exceptions: AvailabilityExceptionWindow[];
  existingBookings: ExistingBookingWindow[];
  stylistPreference: StylistPreference;
  rules: AvailabilityRules;
};

export type AvailabilitySlot = {
  slotId: string;
  staffId: string;
  staffName: string;
  startAt: Date;
  endAt: Date;
};

type Window = {
  startAt: Date;
  endAt: Date;
};

const blockedBookingStatuses = new Set<BookingStatus>(["pending", "confirmed"]);
const berlinTimeZone = "Europe/Berlin";

export function overlaps(left: Window, right: Window) {
  return left.startAt < right.endAt && right.startAt < left.endAt;
}

export function getIsoWeekday(date: Date) {
  const weekday = date.getUTCDay();

  return weekday === 0 ? 7 : weekday;
}

export function formatSlotId(slot: Pick<AvailabilitySlot, "staffId" | "startAt">) {
  return `${slot.staffId}:${slot.startAt.toISOString()}`;
}

export function calculateAvailableSlots(input: AvailabilityInput): AvailabilitySlot[] {
  if (!isValidLocalDate(input.localDate) || input.rules.slotStepMinutes <= 0) {
    return [];
  }

  const selectedDay = createUtcDateForLocalMinute(input.localDate, 0);
  const horizonEnd = new Date(input.now.getTime() + input.rules.maxAdvanceDays * 24 * 60 * 60 * 1000);

  if (selectedDay > horizonEnd) {
    return [];
  }

  const minStart = new Date(input.now.getTime() + input.rules.leadTimeHours * 60 * 60 * 1000);
  const weekday = getIsoWeekday(createUtcDateForCalendarDay(input.localDate));
  const eligibleStaff = resolveEligibleStaff(input);
  const slots = eligibleStaff.flatMap((staffMember) =>
    calculateStaffSlots({
      staffMember,
      serviceId: input.serviceId,
      serviceDurationMinutes: input.serviceDurationMinutes,
      localDate: input.localDate,
      weekday,
      minStart,
      horizonEnd,
      slotStepMinutes: input.rules.slotStepMinutes,
      exceptions: input.exceptions,
      existingBookings: input.existingBookings,
    })
  );

  return slots.sort(
    (left, right) =>
      left.startAt.getTime() - right.startAt.getTime() ||
      left.staffName.localeCompare(right.staffName) ||
      left.staffId.localeCompare(right.staffId)
  );
}

function calculateStaffSlots(input: {
  staffMember: AvailabilityStaff;
  serviceId: string;
  serviceDurationMinutes: number;
  localDate: string;
  weekday: number;
  minStart: Date;
  horizonEnd: Date;
  slotStepMinutes: number;
  exceptions: AvailabilityExceptionWindow[];
  existingBookings: ExistingBookingWindow[];
}) {
  const ranges = input.staffMember.weeklyRanges.filter((range) => range.weekday === input.weekday);
  const blockedWindows = getBlockedWindowsForStaff(
    input.staffMember.id,
    input.exceptions,
    input.existingBookings
  );
  const slots: AvailabilitySlot[] = [];

  for (const range of ranges) {
    const lastStart = range.endMinutes - input.serviceDurationMinutes;

    for (
      let startMinutes = range.startMinutes;
      startMinutes <= lastStart;
      startMinutes += input.slotStepMinutes
    ) {
      const startAt = createUtcDateForLocalMinute(input.localDate, startMinutes);
      const endAt = createUtcDateForLocalMinute(
        input.localDate,
        startMinutes + input.serviceDurationMinutes
      );
      const candidate = { startAt, endAt };

      if (startAt < input.minStart || startAt > input.horizonEnd) {
        continue;
      }

      if (blockedWindows.some((blockedWindow) => overlaps(candidate, blockedWindow))) {
        continue;
      }

      const slot = {
        staffId: input.staffMember.id,
        staffName: input.staffMember.name,
        startAt,
        endAt,
      };

      slots.push({
        ...slot,
        slotId: formatSlotId(slot),
      });
    }
  }

  return slots;
}

function resolveEligibleStaff(input: AvailabilityInput) {
  return input.staff.filter((staffMember) => {
    if (!staffMember.active || !staffMember.serviceIds.includes(input.serviceId)) {
      return false;
    }

    if (input.stylistPreference.kind === "staff") {
      return staffMember.id === input.stylistPreference.staffId;
    }

    return true;
  });
}

function getBlockedWindowsForStaff(
  staffId: string,
  exceptions: AvailabilityExceptionWindow[],
  existingBookings: ExistingBookingWindow[]
) {
  return [
    ...exceptions.filter((exception) => exception.staffId === staffId),
    ...existingBookings.filter(
      (booking) => booking.staffId === staffId && blockedBookingStatuses.has(booking.status)
    ),
  ];
}

function isValidLocalDate(localDate: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(localDate)) {
    return false;
  }

  const [year, month, day] = localDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return date.toISOString().slice(0, 10) === localDate;
}

function createUtcDateForLocalMinute(localDate: string, minuteOfDay: number) {
  const [year, month, day] = localDate.split("-").map(Number);
  const hour = Math.floor(minuteOfDay / 60);
  const minute = minuteOfDay % 60;
  const utcTimestamp = Date.UTC(year, month - 1, day, hour, minute, 0);

  return new Date(utcTimestamp - getTimeZoneOffsetMs(new Date(utcTimestamp), berlinTimeZone));
}

function createUtcDateForCalendarDay(localDate: string) {
  const [year, month, day] = localDate.split("-").map(Number);

  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
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
