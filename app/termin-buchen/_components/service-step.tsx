"use client";

import type {
  PublicBookingServiceOptionDto,
  PublicBookingServiceOptionsDto,
} from "../_lib/booking-flow-options";

type ServiceStepProps = {
  options: PublicBookingServiceOptionsDto;
  selectedCategory: string | null;
  selectedServiceId: string | null;
  onCategoryChange: (category: PublicBookingServiceOptionDto["category"]) => void;
  onServiceChange: (serviceId: string) => void;
};

export function ServiceStep({
  options,
  selectedCategory,
  selectedServiceId,
  onCategoryChange,
  onServiceChange,
}: ServiceStepProps) {
  const activeCategory =
    options.categories.find((category) => category.id === selectedCategory) ??
    options.categories[0] ??
    null;

  return (
    <section className="surface-card rounded-lg p-5 sm:p-6">
      <h2 className="text-[20px] font-semibold leading-[1.2] tracking-normal">
        Leistung auswaehlen
      </h2>

      {options.showCategorySelector ? (
        <div className="mt-5 flex flex-wrap gap-2" aria-label="Leistungskategorien">
          {options.categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => onCategoryChange(category.id)}
              className={
                category.id === activeCategory?.id
                  ? "min-h-11 rounded-lg border border-[var(--accent)] bg-[var(--accent)] px-4 py-2 text-[14px] font-semibold leading-[1.4] tracking-normal text-[var(--accent-foreground)]"
                  : "min-h-11 rounded-lg border border-[var(--line-strong)] bg-[var(--surface-strong)] px-4 py-2 text-[14px] font-semibold leading-[1.4] tracking-normal text-[var(--foreground)]"
              }
            >
              {category.label}
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-5 space-y-3">
        {activeCategory?.services.map((service) => (
          <ServiceOptionButton
            key={service.id}
            service={service}
            selected={service.id === selectedServiceId}
            onSelect={onServiceChange}
          />
        ))}
      </div>
    </section>
  );
}

function ServiceOptionButton({
  service,
  selected,
  onSelect,
}: {
  service: PublicBookingServiceOptionDto;
  selected: boolean;
  onSelect: (serviceId: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(service.id)}
      className={
        selected
          ? "w-full rounded-lg border border-[var(--accent)] bg-[var(--surface-strong)] p-4 text-left"
          : "w-full rounded-lg border border-[var(--line-strong)] bg-[var(--surface)] p-4 text-left"
      }
    >
      <span className="block text-[16px] font-semibold leading-[1.5] tracking-normal text-[var(--foreground)]">
        {service.title}
      </span>
      <span className="mt-1 block text-[14px] font-semibold leading-[1.4] tracking-normal text-[var(--muted)]">
        {service.durationLabel} · {service.priceLabel}
      </span>
      <span className="mt-2 block text-[16px] leading-[1.5] text-[var(--muted)]">
        {service.description}
      </span>
      {service.note ? (
        <span className="mt-2 block text-[14px] font-semibold leading-[1.4] tracking-normal text-[var(--muted)]">
          {service.note}
        </span>
      ) : null}
    </button>
  );
}
