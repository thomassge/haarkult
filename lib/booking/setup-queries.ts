import type { ServiceCategory } from "@/content/services";

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
