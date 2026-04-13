"use client";

import type { StylistPreferenceOptionDto } from "../_lib/booking-flow-options";

type StylistStepProps = {
  options: StylistPreferenceOptionDto[];
  selectedPreferenceId: string | null;
  onPreferenceChange: (preferenceId: string) => void;
};

export function StylistStep({
  options,
  selectedPreferenceId,
  onPreferenceChange,
}: StylistStepProps) {
  return (
    <section className="surface-card rounded-lg p-5 sm:p-6">
      <h2 className="text-[20px] font-semibold leading-[1.2] tracking-normal">
        Stylist auswaehlen
      </h2>
      <div className="mt-5 space-y-3">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onPreferenceChange(option.id)}
            className={
              option.id === selectedPreferenceId
                ? "min-h-11 w-full rounded-lg border border-[var(--accent)] bg-[var(--surface-strong)] px-4 py-3 text-left text-[16px] font-semibold leading-[1.5] tracking-normal"
                : "min-h-11 w-full rounded-lg border border-[var(--line-strong)] bg-[var(--surface)] px-4 py-3 text-left text-[16px] font-semibold leading-[1.5] tracking-normal"
            }
          >
            {option.label}
          </button>
        ))}
      </div>
    </section>
  );
}
