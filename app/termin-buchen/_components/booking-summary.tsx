"use client";

import type {
  PublicBookingServiceOptionDto,
  StylistPreferenceOptionsDto,
} from "../_lib/booking-flow-options";
import { formatTime, type PublicSlotDto } from "./slot-step";

type BookingSummaryProps = {
  selectedService: PublicBookingServiceOptionDto | null;
  stylistOptions: StylistPreferenceOptionsDto;
  selectedPreferenceId: string | null;
  selectedDate: string | null;
  selectedSlot: PublicSlotDto | null;
  submitLabel: string;
};

export function BookingSummary({
  selectedService,
  stylistOptions,
  selectedPreferenceId,
  selectedDate,
  selectedSlot,
  submitLabel,
}: BookingSummaryProps) {
  const selectedPreference = stylistOptions.options.find(
    (option) => option.id === selectedPreferenceId
  );
  const stylistLabel =
    selectedPreference?.label ??
    (stylistOptions.resolvedStaffId
      ? stylistOptions.eligibleStaff.find(
          (staff) => staff.id === stylistOptions.resolvedStaffId
        )?.name
      : null) ??
    "Wird automatisch passend gesucht";

  return (
    <aside className="surface-card rounded-lg p-5 sm:p-6 lg:sticky lg:top-6 lg:self-start">
      <h2 className="text-[20px] font-semibold leading-[1.2] tracking-normal">
        Deine Auswahl
      </h2>
      <dl className="mt-5 space-y-4 text-[16px] leading-[1.5]">
        <div>
          <dt className="text-[14px] font-semibold leading-[1.4] tracking-normal text-[var(--muted)]">
            Leistung
          </dt>
          <dd className="mt-1 font-semibold tracking-normal">
            {selectedService
              ? `${selectedService.title} · ${selectedService.durationLabel}`
              : "Noch keine Leistung gewaehlt"}
          </dd>
        </div>
        <div>
          <dt className="text-[14px] font-semibold leading-[1.4] tracking-normal text-[var(--muted)]">
            Stylist
          </dt>
          <dd className="mt-1 font-semibold tracking-normal">{stylistLabel}</dd>
        </div>
        <div>
          <dt className="text-[14px] font-semibold leading-[1.4] tracking-normal text-[var(--muted)]">
            Zeit
          </dt>
          <dd className="mt-1 font-semibold tracking-normal">
            {selectedSlot
              ? `${formatDate(selectedSlot.startAt)} um ${formatTime(selectedSlot.startAt)}`
              : selectedDate
                ? "Bitte eine freie Uhrzeit waehlen"
                : "Noch kein Datum gewaehlt"}
          </dd>
        </div>
      </dl>
      <p className="mt-6 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4 text-[16px] leading-[1.5] text-[var(--muted)]">
        {submitLabel} bleibt unverbindlich, bis der Salon den Termin bestaetigt.
      </p>
    </aside>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}
