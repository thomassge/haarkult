import { asc } from "drizzle-orm";

import type { ServiceCategory } from "@/content/services";
import {
  availabilityExceptions,
  staff,
  staffServices,
  weeklyAvailability,
} from "@/db/schema";
import { bookableServices, getBookableServiceById } from "@/lib/booking/catalog";

export type StaffSummaryDto = {
  id: string;
  name: string;
  slug: string;
  active: boolean;
};

export type StaffServiceAssignmentDto = {
  staffId: string;
  serviceId: string;
  serviceTitle: string;
  serviceCategory: ServiceCategory;
};

export type BookableServiceOptionDto = {
  id: string;
  title: string;
  category: ServiceCategory;
};

export type WeeklyRangeDto = {
  weekday: number;
  startMinutes: number;
  endMinutes: number;
};

export type StaffSetupCompletionInput = {
  id: string;
  name: string;
  active: boolean;
  serviceIds: string[];
  weeklyRanges: WeeklyRangeDto[];
};

export type SetupMissingStaffDto = {
  id: string;
  name: string;
};

export type SetupCompletionDto = {
  hasActiveStaff: boolean;
  staffMissingServices: SetupMissingStaffDto[];
  staffMissingWeeklyHours: SetupMissingStaffDto[];
  complete: boolean;
};

export type StaffSetupDto = StaffSummaryDto & {
  assignedServices: StaffServiceAssignmentDto[];
  weeklyRanges: WeeklyRangeDto[];
};

export type WeeklyAvailabilityDto = WeeklyRangeDto & {
  id: string;
  staffId: string;
};

export type AvailabilityExceptionDto = {
  id: string;
  staffId: string;
  type: "vacation" | "break" | "blocked";
  label: string | null;
  allDay: boolean;
  startAt: Date;
  endAt: Date;
  notes: string | null;
};

export type StaffSetupDataDto = {
  staff: StaffSetupDto[];
  serviceOptions: BookableServiceOptionDto[];
  setupCompletion: SetupCompletionDto;
};

export type AdminSetupOverviewDto = {
  setupCompletion: SetupCompletionDto;
  counts: {
    activeStaff: number;
    assignedServices: number;
    weeklyRanges: number;
  };
};

export type WeeklyAvailabilitySetupDataDto = {
  staff: StaffSetupDto[];
  weeklyRanges: WeeklyAvailabilityDto[];
  setupCompletion: SetupCompletionDto;
};

export type AvailabilityExceptionSetupDataDto = {
  staff: StaffSetupDto[];
  exceptions: AvailabilityExceptionDto[];
  setupCompletion: SetupCompletionDto;
};

export function deriveSetupCompletion(
  staffRows: StaffSetupCompletionInput[]
): SetupCompletionDto {
  const activeStaff = staffRows.filter((staffRow) => staffRow.active);
  const staffMissingServices = activeStaff
    .filter((staffRow) => staffRow.serviceIds.length === 0)
    .map(({ id, name }) => ({ id, name }));
  const staffMissingWeeklyHours = activeStaff
    .filter((staffRow) => staffRow.weeklyRanges.length === 0)
    .map(({ id, name }) => ({ id, name }));

  return {
    hasActiveStaff: activeStaff.length > 0,
    staffMissingServices,
    staffMissingWeeklyHours,
    complete:
      activeStaff.length > 0 &&
      staffMissingServices.length === 0 &&
      staffMissingWeeklyHours.length === 0,
  };
}

export function getBookableServiceOptions(): BookableServiceOptionDto[] {
  return bookableServices.map((service) => ({
    id: service.id,
    title: service.title,
    category: service.category,
  }));
}

function createAssignmentDto(row: { staffId: string; serviceId: string }) {
  const service = getBookableServiceById(row.serviceId);

  return {
    staffId: row.staffId,
    serviceId: row.serviceId,
    serviceTitle: service?.title ?? row.serviceId,
    serviceCategory: service?.category ?? "Damen",
  } satisfies StaffServiceAssignmentDto;
}

export async function getStaffSetupData(): Promise<StaffSetupDataDto> {
  const { db } = await import("@/db");
  const [staffRows, serviceRows, weeklyRows] = await Promise.all([
    db.select().from(staff).orderBy(asc(staff.name)),
    db.select().from(staffServices),
    db.select().from(weeklyAvailability),
  ]);

  const staffDtos = staffRows.map((staffRow) => {
    const assignedServices = serviceRows
      .filter((serviceRow) => serviceRow.staffId === staffRow.id)
      .map(createAssignmentDto);
    const weeklyRanges = weeklyRows
      .filter((weeklyRow) => weeklyRow.staffId === staffRow.id)
      .map(({ weekday, startMinutes, endMinutes }) => ({
        weekday,
        startMinutes,
        endMinutes,
      }));

    return {
      id: staffRow.id,
      name: staffRow.name,
      slug: staffRow.slug,
      active: staffRow.active,
      assignedServices,
      weeklyRanges,
    } satisfies StaffSetupDto;
  });

  return {
    staff: staffDtos,
    serviceOptions: getBookableServiceOptions(),
    setupCompletion: deriveSetupCompletion(
      staffDtos.map((staffRow) => ({
        id: staffRow.id,
        name: staffRow.name,
        active: staffRow.active,
        serviceIds: staffRow.assignedServices.map((service) => service.serviceId),
        weeklyRanges: staffRow.weeklyRanges,
      }))
    ),
  };
}

export async function getAdminSetupOverview(): Promise<AdminSetupOverviewDto> {
  const setupData = await getStaffSetupData();
  const activeStaff = setupData.staff.filter((staffRow) => staffRow.active);

  return {
    setupCompletion: setupData.setupCompletion,
    counts: {
      activeStaff: activeStaff.length,
      assignedServices: activeStaff.reduce(
        (total, staffRow) => total + staffRow.assignedServices.length,
        0
      ),
      weeklyRanges: activeStaff.reduce(
        (total, staffRow) => total + staffRow.weeklyRanges.length,
        0
      ),
    },
  };
}

export async function getWeeklyAvailabilitySetupData(): Promise<WeeklyAvailabilitySetupDataDto> {
  const setupData = await getStaffSetupData();

  return {
    staff: setupData.staff.filter((staffRow) => staffRow.active),
    weeklyRanges: setupData.staff.flatMap((staffRow) =>
      staffRow.weeklyRanges.map((range) => ({
        id: `${staffRow.id}-${range.weekday}-${range.startMinutes}-${range.endMinutes}`,
        staffId: staffRow.id,
        ...range,
      }))
    ),
    setupCompletion: setupData.setupCompletion,
  };
}

export async function getAvailabilityExceptionSetupData(): Promise<AvailabilityExceptionSetupDataDto> {
  const setupData = await getStaffSetupData();
  const { db } = await import("@/db");
  const exceptionRows = await db
    .select()
    .from(availabilityExceptions)
    .orderBy(asc(availabilityExceptions.startAt));

  return {
    staff: setupData.staff.filter((staffRow) => staffRow.active),
    exceptions: exceptionRows.map((exceptionRow) => ({
      id: exceptionRow.id,
      staffId: exceptionRow.staffId,
      type: exceptionRow.type,
      label: exceptionRow.label,
      allDay: exceptionRow.allDay,
      startAt: exceptionRow.startAt,
      endAt: exceptionRow.endAt,
      notes: exceptionRow.notes,
    })),
    setupCompletion: setupData.setupCompletion,
  };
}
