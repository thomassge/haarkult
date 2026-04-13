"use client";

import type {
  PublicBookingServiceOptionDto,
  StylistPreferenceOptionsDto,
} from "../_lib/booking-flow-options";

type BookingSummaryProps = {
  selectedService: PublicBookingServiceOptionDto | null;
  stylistOptions: StylistPreferenceOptionsDto;
  selectedPreferenceId: string | null;
  submitLabel: string;
};

export function BookingSummary({
  selectedService,
  stylistOptions,
  selectedPreferenceId,
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
    <aside className="rounded-lg border border-[#d9e1da] bg-white p-6 lg:sticky lg:top-6 lg:self-start">
      <h2 className="text-[20px] font-semibold leading-[1.2] tracking-normal">
        Deine Auswahl
      </h2>
      <dl className="mt-5 space-y-4 text-[16px] leading-[1.5]">
        <div>
          <dt className="text-[14px] font-semibold leading-[1.4] tracking-normal text-[#5f6b62]">
            Leistung
          </dt>
          <dd className="mt-1 font-semibold tracking-normal">
            {selectedService
              ? `${selectedService.title} · ${selectedService.durationLabel}`
              : "Noch keine Leistung gewaehlt"}
          </dd>
        </div>
        <div>
          <dt className="text-[14px] font-semibold leading-[1.4] tracking-normal text-[#5f6b62]">
            Stylist
          </dt>
          <dd className="mt-1 font-semibold tracking-normal">{stylistLabel}</dd>
        </div>
        <div>
          <dt className="text-[14px] font-semibold leading-[1.4] tracking-normal text-[#5f6b62]">
            Zeit
          </dt>
          <dd className="mt-1 font-semibold tracking-normal">
            Freie Zeiten folgen im naechsten Schritt.
          </dd>
        </div>
      </dl>
      <p className="mt-6 rounded-lg bg-[#eef4ef] p-4 text-[16px] leading-[1.5] text-[#5f6b62]">
        {submitLabel} bleibt unverbindlich, bis eine freie Zeit ausgewaehlt ist.
      </p>
    </aside>
  );
}
