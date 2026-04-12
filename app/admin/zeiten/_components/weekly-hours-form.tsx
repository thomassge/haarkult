import { saveWeeklyAvailabilityAction } from "@/lib/booking/setup-actions";
import type { StaffSetupDto } from "@/lib/booking/setup-queries";
import { WEEKDAYS_ISO, weekdayLabelByIsoDay } from "@/lib/booking/setup-validation";

type WeeklyHoursFormProps = {
  stylist: StaffSetupDto;
};

function minutesToTime(minutes: number) {
  const hours = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const rest = (minutes % 60).toString().padStart(2, "0");

  return `${hours}:${rest}`;
}

export function WeeklyHoursForm({ stylist }: WeeklyHoursFormProps) {
  return (
    <form action={saveWeeklyAvailabilityAction} className="space-y-5">
      <input name="staffId" type="hidden" value={stylist.id} />

      <div className="grid gap-4">
        {WEEKDAYS_ISO.map((weekday) => {
          const existingRanges = stylist.weeklyRanges.filter(
            (range) => range.weekday === weekday
          );
          const rows = [...existingRanges, ...Array.from({ length: 2 }, () => null)];

          return (
            <fieldset key={weekday} className="rounded-lg border border-[var(--line)] p-4">
              <legend className="px-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {weekdayLabelByIsoDay[weekday]}
              </legend>
              <div className="mt-3 grid gap-3">
                {rows.map((range, index) => (
                  <div
                    key={`${weekday}-${index}`}
                    className="grid gap-2 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
                  >
                    <input name="weekday" type="hidden" value={weekday} />
                    <label className="block">
                      <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                        Von
                      </span>
                      <input
                        className="mt-1 w-full rounded-lg border border-[var(--line-strong)] bg-white/80 px-3 py-2 text-sm text-zinc-950 outline-none focus:border-zinc-900 dark:bg-white/5 dark:text-zinc-50 dark:focus:border-zinc-100"
                        name="startTime"
                        type="time"
                        step={900}
                        defaultValue={range ? minutesToTime(range.startMinutes) : ""}
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                        Bis
                      </span>
                      <input
                        className="mt-1 w-full rounded-lg border border-[var(--line-strong)] bg-white/80 px-3 py-2 text-sm text-zinc-950 outline-none focus:border-zinc-900 dark:bg-white/5 dark:text-zinc-50 dark:focus:border-zinc-100"
                        name="endTime"
                        type="time"
                        step={900}
                        defaultValue={range ? minutesToTime(range.endMinutes) : ""}
                      />
                    </label>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      {range ? "Gespeichert" : "Weitere Zeit"}
                    </div>
                  </div>
                ))}
              </div>
            </fieldset>
          );
        })}
      </div>

      <button
        className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 sm:w-auto dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        type="submit"
      >
        Arbeitszeiten speichern
      </button>
    </form>
  );
}
