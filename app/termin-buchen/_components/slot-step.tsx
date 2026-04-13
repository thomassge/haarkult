"use client";

export type PublicSlotDto = {
  slotId: string;
  staffId: string;
  staffName: string;
  startAt: string;
  endAt: string;
};

type SlotStepProps = {
  dates: string[];
  selectedDate: string | null;
  slots: PublicSlotDto[];
  selectedSlotId: string | null;
  loading: boolean;
  error: string | null;
  conflictMessage: string | null;
  onDateSelect: (date: string) => void;
  onSlotSelect: (slot: PublicSlotDto) => void;
  onRetry: () => void;
};

export function SlotStep({
  dates,
  selectedDate,
  slots,
  selectedSlotId,
  loading,
  error,
  conflictMessage,
  onDateSelect,
  onSlotSelect,
  onRetry,
}: SlotStepProps) {
  return (
    <section className="surface-card rounded-lg p-5 sm:p-6">
      <h2 className="text-[20px] font-semibold leading-[1.2] tracking-normal">
        Zeit auswaehlen
      </h2>

      {conflictMessage ? (
        <p className="mt-4 rounded-lg border border-[#b42318] bg-white p-4 text-[16px] leading-[1.5] text-[#b42318]">
          {conflictMessage}
        </p>
      ) : null}

      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {dates.map((date) => (
          <button
            key={date}
            type="button"
            aria-pressed={date === selectedDate}
            aria-label={`Datum ${date}`}
            onClick={() => onDateSelect(date)}
            className={
              date === selectedDate
                ? "min-h-11 rounded-lg border border-[var(--accent)] bg-[var(--accent)] px-3 py-2 text-[14px] font-semibold leading-[1.4] tracking-normal text-[var(--accent-foreground)]"
                : "min-h-11 rounded-lg border border-[var(--line-strong)] bg-[var(--surface-strong)] px-3 py-2 text-[14px] font-semibold leading-[1.4] tracking-normal text-[var(--foreground)]"
            }
          >
            {formatDateLabel(date)}
          </button>
        ))}
      </div>

      <div className="mt-5 min-h-16">
        {!selectedDate ? (
          <p className="text-[16px] leading-[1.5] text-[#5f6b62]">
            Waehle zuerst ein Datum aus.
          </p>
        ) : null}

        {loading ? (
          <p className="text-[16px] leading-[1.5] text-[#5f6b62]">
            Freie Zeiten werden geladen...
          </p>
        ) : null}

        {error ? (
          <div className="rounded-lg bg-[#eef4ef] p-4">
            <p className="text-[16px] leading-[1.5] text-[#5f6b62]">{error}</p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 min-h-11 rounded-lg border border-[var(--accent)] px-4 py-2 text-[14px] font-semibold leading-[1.4] tracking-normal text-[var(--accent)]"
            >
              Zeiten neu laden
            </button>
          </div>
        ) : null}

        {selectedDate && !loading && !error && slots.length === 0 ? (
          <div className="rounded-lg bg-[#eef4ef] p-4">
            <h3 className="text-[20px] font-semibold leading-[1.2] tracking-normal">
              Keine freien Zeiten gefunden
            </h3>
            <p className="mt-2 text-[16px] leading-[1.5] text-[#5f6b62]">
              Waehle ein anderes Datum, eine andere Leistung oder eine andere Stylistin
              aus.
            </p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 min-h-11 rounded-lg border border-[var(--accent)] px-4 py-2 text-[14px] font-semibold leading-[1.4] tracking-normal text-[var(--accent)]"
            >
              Zeiten neu laden
            </button>
          </div>
        ) : null}

        {!loading && !error && slots.length > 0 ? (
          <div className="flex flex-wrap gap-2" aria-label="Freie Zeiten">
            {slots.map((slot) => (
              <button
                key={slot.slotId}
                type="button"
                aria-pressed={slot.slotId === selectedSlotId}
                onClick={() => onSlotSelect(slot)}
                className={
                  slot.slotId === selectedSlotId
                    ? "min-h-11 rounded-lg border border-[var(--accent)] bg-[var(--accent)] px-4 py-2 text-[14px] font-semibold leading-[1.4] tracking-normal text-[var(--accent-foreground)]"
                    : "min-h-11 rounded-lg border border-[var(--line-strong)] bg-[var(--surface-strong)] px-4 py-2 text-[14px] font-semibold leading-[1.4] tracking-normal text-[var(--foreground)]"
                }
              >
                {formatTime(slot.startAt)}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function formatDateLabel(date: string) {
  return new Intl.DateTimeFormat("de-DE", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(`${date}T12:00:00.000Z`));
}

export function formatTime(value: string) {
  return new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
