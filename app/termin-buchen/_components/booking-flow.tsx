"use client";

import { useMemo, useState } from "react";

import { Container } from "@/components/ui/container";
import type { BookingConfig } from "@/content/booking";
import {
  submitPublicBookingAction,
  type PublicBookingResult,
  type PublicBookingSuccessResult,
} from "@/lib/booking/public-actions";
import type { StaffSetupDto } from "@/lib/booking/setup-queries";
import {
  derivePublicBookingServiceOptions,
  deriveStylistPreferenceOptions,
  type PublicBookingServiceOptionDto,
} from "../_lib/booking-flow-options";
import { BookingResult } from "./booking-result";
import { BookingSummary } from "./booking-summary";
import { ContactStep } from "./contact-step";
import { ServiceStep } from "./service-step";
import { SlotStep, type PublicSlotDto } from "./slot-step";
import { StylistStep } from "./stylist-step";

type BookingFlowProps = {
  booking: BookingConfig;
  brandName: string;
  staffRows: StaffSetupDto[];
};

const staleSlotConflictCopy =
  "Diese Zeit ist gerade nicht mehr verfuegbar. Deine Angaben bleiben erhalten. Bitte waehle eine neue Uhrzeit.";

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
  const dateOptions = useMemo(
    () => createDateOptions(booking.leadTimeHours, booking.maxAdvanceDays),
    [booking.leadTimeHours, booking.maxAdvanceDays]
  );
  const [selectedCategory, setSelectedCategory] = useState(
    serviceOptions.initialCategory
  );
  const [selectedServiceId, setSelectedServiceId] = useState(() =>
    findInitialServiceId(allServices, staffRows)
  );
  const [selectedStylistPreferenceId, setSelectedStylistPreferenceId] =
    useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [slots, setSlots] = useState<PublicSlotDto[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<PublicSlotDto | null>(null);
  const [slotLoading, setSlotLoading] = useState(false);
  const [slotError, setSlotError] = useState<string | null>(null);
  const [conflictMessage, setConflictMessage] = useState<string | null>(null);
  const [contact, setContact] = useState({
    name: "",
    phone: "",
    email: "",
    note: "",
  });
  const [submitPending, setSubmitPending] = useState(false);
  const [submitResult, setSubmitResult] = useState<PublicBookingResult | null>(null);

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
    setSlots([]);
    setSlotError(null);
    setConflictMessage(null);
    setSubmitResult(null);
  }

  function handleStylistChange(preferenceId: string) {
    setSelectedStylistPreferenceId(preferenceId);
    setSelectedDate(null);
    setSelectedSlot(null);
    setSlots([]);
    setSlotError(null);
    setConflictMessage(null);
    setSubmitResult(null);
  }

  async function loadSlots(date: string) {
    if (!selectedServiceId) {
      return;
    }

    setSlotLoading(true);
    setSlotError(null);

    try {
      const params = new URLSearchParams({
        serviceId: selectedServiceId,
        date,
      });
      const staffPreferenceId =
        selectedStylistPreferenceId && selectedStylistPreferenceId !== "any"
          ? selectedStylistPreferenceId
          : null;

      if (staffPreferenceId) {
        params.set("staffId", staffPreferenceId);
      }

      const response = await fetch(`/api/booking/slots?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Slot lookup failed");
      }

      const payload = (await response.json()) as { slots?: PublicSlotDto[] };
      setSlots(payload.slots ?? []);
    } catch {
      setSlots([]);
      setSlotError(
        "Freie Zeiten konnten nicht geladen werden. Bitte versuche es noch einmal."
      );
    } finally {
      setSlotLoading(false);
    }
  }

  function handleDateSelect(date: string) {
    setSelectedDate(date);
    setSelectedSlot(null);
    setConflictMessage(null);
    setSubmitResult(null);
    void loadSlots(date);
  }

  function handleContactChange(field: keyof typeof contact, value: string) {
    setContact((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit() {
    if (!selectedServiceId || !selectedDate || !selectedSlot) {
      return;
    }

    const formData = new FormData();
    formData.set("serviceId", selectedServiceId);
    formData.set("date", selectedDate);
    formData.set("slotId", selectedSlot.slotId);
    formData.set("staffId", selectedSlot.staffId);
    formData.set("startAt", selectedSlot.startAt);

    if (selectedStylistPreferenceId && selectedStylistPreferenceId !== "any") {
      formData.set("stylistPreferenceStaffId", selectedStylistPreferenceId);
    }

    formData.set("name", contact.name);
    formData.set("phone", contact.phone);
    formData.set("email", contact.email);
    formData.set("note", contact.note);

    setSubmitPending(true);
    const result = await submitPublicBookingAction(submitResult, formData);
    setSubmitPending(false);
    setSubmitResult(result);

    if (result.status === "slot_conflict") {
      setConflictMessage(result.message || staleSlotConflictCopy);
      setSelectedSlot(null);
      setContact({
        name: result.preservedInput.name,
        phone: result.preservedInput.phone,
        email: result.preservedInput.email,
        note: result.preservedInput.note ?? "",
      });
      setSelectedDate(result.preservedInput.date);
      await loadSlots(result.preservedInput.date);
    }
  }

  const fieldErrors =
    submitResult?.status === "validation_error" ? submitResult.fieldErrors : undefined;
  const successResult =
    submitResult?.status === "success"
      ? (submitResult as PublicBookingSuccessResult)
      : null;

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
                onPreferenceChange={handleStylistChange}
              />
            ) : null}

            {successResult ? (
              <BookingResult result={successResult} />
            ) : (
              <>
                <SlotStep
                  dates={dateOptions}
                  selectedDate={selectedDate}
                  slots={slots}
                  selectedSlotId={selectedSlot?.slotId ?? null}
                  loading={slotLoading}
                  error={slotError}
                  conflictMessage={conflictMessage}
                  onDateSelect={handleDateSelect}
                  onSlotSelect={setSelectedSlot}
                  onRetry={() => selectedDate && void loadSlots(selectedDate)}
                />

                <ContactStep
                  submitLabel={submitLabel}
                  pending={submitPending}
                  disabled={!selectedSlot}
                  fieldErrors={fieldErrors}
                  contact={contact}
                  onContactChange={handleContactChange}
                  onSubmit={handleSubmit}
                />
              </>
            )}
          </div>

          <BookingSummary
            selectedService={selectedService}
            stylistOptions={stylistOptions}
            selectedPreferenceId={selectedStylistPreferenceId}
            selectedDate={selectedDate}
            selectedSlot={selectedSlot}
            submitLabel={submitLabel}
          />
        </div>
      </Container>
    </main>
  );
}

function createDateOptions(leadTimeHours: number, maxAdvanceDays: number) {
  const now = new Date();
  const firstDate = new Date(now.getTime() + leadTimeHours * 60 * 60 * 1000);
  const count = Math.min(14, Math.max(1, maxAdvanceDays));

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(
      Date.UTC(
        firstDate.getUTCFullYear(),
        firstDate.getUTCMonth(),
        firstDate.getUTCDate() + index,
        12,
        0,
        0
      )
    );

    return date.toISOString().slice(0, 10);
  });
}
