"use client";

import { useMemo, useState } from "react";

import { Container } from "@/components/ui/container";
import type { BookingConfig } from "@/content/booking";
import type { StaffSetupDto } from "@/lib/booking/setup-queries";
import {
  derivePublicBookingServiceOptions,
  deriveStylistPreferenceOptions,
  type PublicBookingServiceOptionDto,
} from "../_lib/booking-flow-options";
import { BookingSummary } from "./booking-summary";
import { ServiceStep } from "./service-step";
import { StylistStep } from "./stylist-step";

type BookingFlowProps = {
  booking: BookingConfig;
  brandName: string;
  staffRows: StaffSetupDto[];
};

function findInitialServiceId(
  services: PublicBookingServiceOptionDto[],
  staffRows: StaffSetupDto[]
) {
  return (
    services.find((service) =>
      staffRows.some(
        (staffRow) =>
          staffRow.active &&
          staffRow.assignedServices.some(
            (assignment) => assignment.serviceId === service.id
          )
      )
    )?.id ??
    services[0]?.id ??
    null
  );
}

export function BookingFlow({ booking, brandName, staffRows }: BookingFlowProps) {
  const serviceOptions = useMemo(() => derivePublicBookingServiceOptions(), []);
  const allServices = serviceOptions.categories.flatMap((category) => category.services);
  const [selectedCategory, setSelectedCategory] = useState(
    serviceOptions.initialCategory
  );
  const [selectedServiceId, setSelectedServiceId] = useState(() =>
    findInitialServiceId(allServices, staffRows)
  );
  const [selectedStylistPreferenceId, setSelectedStylistPreferenceId] =
    useState<string | null>(null);
  const [, setSelectedDate] = useState<string | null>(null);
  const [, setSelectedSlot] = useState<string | null>(null);

  const selectedService =
    allServices.find((service) => service.id === selectedServiceId) ?? null;
  const stylistOptions = selectedServiceId
    ? deriveStylistPreferenceOptions(selectedServiceId, staffRows)
    : deriveStylistPreferenceOptions("", staffRows);
  const showStylistStep = booking.allowStylistSelection && stylistOptions.showStylistStep;
  const submitLabel =
    booking.confirmationMode === "instant" ? "Termin buchen" : "Termin anfragen";
  const progressSteps = showStylistStep
    ? ["1 Leistung", "2 Stylist", "3 Zeit", "4 Kontakt"]
    : ["1 Leistung", "2 Zeit", "3 Kontakt"];

  function handleServiceChange(serviceId: string) {
    setSelectedServiceId(serviceId);
    setSelectedStylistPreferenceId(null);
    setSelectedDate(null);
    setSelectedSlot(null);
  }

  return (
    <main className="min-h-screen bg-[#f7f8f6] py-10 text-[#161a17] sm:py-14 lg:py-16">
      <Container>
        <div className="mb-6">
          <p className="text-[14px] font-semibold leading-[1.4] tracking-normal text-[#5f6b62]">
            {brandName}
          </p>
          <h1 className="mt-2 text-[28px] font-semibold leading-[1.2] tracking-normal">
            Termin buchen
          </h1>
        </div>

        <nav
          aria-label="Buchungsschritte"
          className="mb-6 flex flex-wrap gap-2 text-[14px] font-semibold leading-[1.4]"
        >
          {progressSteps.map((step, index) => (
            <span
              key={step}
              aria-current={index === 0 ? "step" : undefined}
              className={
                index === 0
                  ? "rounded-lg border border-[#23624f] bg-[#23624f] px-3 py-2 text-white"
                  : "rounded-lg border border-[#d9e1da] bg-white px-3 py-2 text-[#5f6b62]"
              }
            >
              {step}
            </span>
          ))}
        </nav>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.4fr)]">
          <div className="space-y-6">
            <ServiceStep
              options={serviceOptions}
              selectedCategory={selectedCategory}
              selectedServiceId={selectedServiceId}
              onCategoryChange={setSelectedCategory}
              onServiceChange={handleServiceChange}
            />

            {showStylistStep ? (
              <StylistStep
                options={stylistOptions.options}
                selectedPreferenceId={selectedStylistPreferenceId}
                onPreferenceChange={setSelectedStylistPreferenceId}
              />
            ) : null}

            <section className="rounded-lg border border-[#d9e1da] bg-white p-6">
              <h2 className="text-[20px] font-semibold leading-[1.2] tracking-normal">
                Zeit
              </h2>
              <p className="mt-3 text-[16px] leading-[1.5] text-[#5f6b62]">
                Online sind gerade keine Zeiten verfuegbar. Die freien Zeiten werden im
                naechsten Schritt freigeschaltet.
              </p>
            </section>

            <section className="rounded-lg border border-[#d9e1da] bg-white p-6">
              <h2 className="text-[20px] font-semibold leading-[1.2] tracking-normal">
                Kontakt
              </h2>
              <p className="mt-3 text-[16px] leading-[1.5] text-[#5f6b62]">
                Wir nutzen deine Angaben nur fuer diese Terminanfrage. Du brauchst kein
                Kundenkonto.
              </p>
              <button
                type="button"
                className="mt-5 min-h-11 rounded-lg bg-[#23624f] px-5 py-3 text-[14px] font-semibold leading-[1.4] tracking-normal text-white"
              >
                {submitLabel}
              </button>
            </section>
          </div>

          <BookingSummary
            selectedService={selectedService}
            stylistOptions={stylistOptions}
            selectedPreferenceId={selectedStylistPreferenceId}
            submitLabel={submitLabel}
          />
        </div>
      </Container>
    </main>
  );
}
