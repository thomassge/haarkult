"use client";

import type { PublicBookingSuccessResult } from "@/lib/booking/public-actions";
import { formatTime } from "./slot-step";

type BookingResultProps = {
  result: PublicBookingSuccessResult;
};

export function BookingResult({ result }: BookingResultProps) {
  return (
    <section className="surface-card rounded-lg p-5 sm:p-6">
      <p className="text-[14px] font-semibold leading-[1.4] tracking-normal text-[var(--accent)]">
        {result.bookingStatus === "pending" ? "Anfrage gesendet" : "Termin bestaetigt"}
      </p>
      <h2 className="mt-2 text-[20px] font-semibold leading-[1.2] tracking-normal">
        {result.heading}
      </h2>
      <p className="mt-3 text-[16px] leading-[1.5] text-[var(--muted)]">
        {result.message}
      </p>
      <dl className="mt-5 grid gap-3 text-[16px] leading-[1.5]">
        <div>
          <dt className="text-[14px] font-semibold leading-[1.4] tracking-normal text-[var(--muted)]">
            Leistung
          </dt>
          <dd className="font-semibold tracking-normal">{result.appointment.serviceTitle}</dd>
        </div>
        <div>
          <dt className="text-[14px] font-semibold leading-[1.4] tracking-normal text-[var(--muted)]">
            Zeit
          </dt>
          <dd className="font-semibold tracking-normal">
            {formatTime(result.appointment.startAt)}
          </dd>
        </div>
      </dl>
    </section>
  );
}
