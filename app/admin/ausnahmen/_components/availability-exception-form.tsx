import { saveAvailabilityExceptionAction } from "@/lib/booking/setup-actions";
import type { StaffSetupDto } from "@/lib/booking/setup-queries";

type AvailabilityExceptionFormProps = {
  staff: StaffSetupDto[];
};

export function AvailabilityExceptionForm({ staff }: AvailabilityExceptionFormProps) {
  return (
    <form action={saveAvailabilityExceptionAction} className="space-y-5">
      <label className="block">
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          Stylistin oder Stylist
        </span>
        <select
          className="mt-2 w-full rounded-lg border border-[var(--line-strong)] bg-white/80 px-3 py-3 text-sm text-zinc-950 outline-none focus:border-zinc-900 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-100"
          name="staffId"
          required
        >
          <option value="">Bitte auswaehlen</option>
          {staff.map((staffRow) => (
            <option key={staffRow.id} value={staffRow.id}>
              {staffRow.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          Art
        </span>
        <select
          className="mt-2 w-full rounded-lg border border-[var(--line-strong)] bg-white/80 px-3 py-3 text-sm text-zinc-950 outline-none focus:border-zinc-900 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-100"
          name="type"
          required
        >
          <option value="vacation">Urlaub</option>
          <option value="break">Pause</option>
          <option value="blocked">Blockierte Zeit</option>
        </select>
      </label>

      <label className="flex items-center gap-3 text-sm text-zinc-800 dark:text-zinc-200">
        <input name="allDay" type="hidden" value="false" />
        <input
          className="h-4 w-4 rounded border-[var(--line-strong)]"
          name="allDay"
          type="checkbox"
          value="true"
        />
        Ganztaegig
      </label>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Datum
          </span>
          <input
            className="mt-2 w-full rounded-lg border border-[var(--line-strong)] bg-white/80 px-3 py-3 text-sm text-zinc-950 outline-none focus:border-zinc-900 dark:bg-white/5 dark:text-zinc-50 dark:focus:border-zinc-100"
            name="localDate"
            type="date"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Start
          </span>
          <input
            className="mt-2 w-full rounded-lg border border-[var(--line-strong)] bg-white/80 px-3 py-3 text-sm text-zinc-950 outline-none focus:border-zinc-900 dark:bg-white/5 dark:text-zinc-50 dark:focus:border-zinc-100"
            name="startAt"
            type="datetime-local"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Ende
          </span>
          <input
            className="mt-2 w-full rounded-lg border border-[var(--line-strong)] bg-white/80 px-3 py-3 text-sm text-zinc-950 outline-none focus:border-zinc-900 dark:bg-white/5 dark:text-zinc-50 dark:focus:border-zinc-100"
            name="endAt"
            type="datetime-local"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          Bezeichnung optional
        </span>
        <input
          className="mt-2 w-full rounded-lg border border-[var(--line-strong)] bg-white/80 px-3 py-3 text-sm text-zinc-950 outline-none focus:border-zinc-900 dark:bg-white/5 dark:text-zinc-50 dark:focus:border-zinc-100"
          name="label"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          Notizen optional
        </span>
        <textarea
          className="mt-2 min-h-28 w-full rounded-lg border border-[var(--line-strong)] bg-white/80 px-3 py-3 text-sm text-zinc-950 outline-none focus:border-zinc-900 dark:bg-white/5 dark:text-zinc-50 dark:focus:border-zinc-100"
          name="notes"
        />
      </label>

      <button
        className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 sm:w-auto dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        type="submit"
      >
        Ausnahme speichern
      </button>
    </form>
  );
}
