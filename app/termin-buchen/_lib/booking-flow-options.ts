import {
  bookableServices,
  getBookableServiceById,
  type BookingServiceSnapshot,
} from "@/lib/booking/catalog";
import type { Service, ServiceCategory } from "@/content/services";
import { serviceCategoryOrder } from "@/content/services";
import type { StaffSetupDto } from "@/lib/booking/setup-queries";

export type PublicBookingServiceOptionDto = BookingServiceSnapshot & {
  id: string;
  title: string;
  category: ServiceCategory;
  description: string;
  durationMinutes: number;
  durationLabel: string;
  priceLabel: string;
  note?: string;
};

export type PublicBookingServiceCategoryOptionDto = {
  id: ServiceCategory;
  label: ServiceCategory;
  services: PublicBookingServiceOptionDto[];
};

export type PublicBookingServiceOptionsDto = {
  categories: PublicBookingServiceCategoryOptionDto[];
  showCategorySelector: boolean;
  initialCategory: ServiceCategory | null;
};

export type PublicBookingStaffOptionDto = {
  id: string;
  name: string;
  slug: string;
};

export type StylistPreferenceOptionDto =
  | {
      id: "any";
      kind: "any";
      label: "Keine Praeferenz";
      staffId: null;
    }
  | {
      id: string;
      kind: "staff";
      label: string;
      staffId: string;
    };

export type StylistPreferenceOptionsDto = {
  eligibleStaff: PublicBookingStaffOptionDto[];
  options: StylistPreferenceOptionDto[];
  resolvedStaffId: string | null;
  showStylistStep: boolean;
};

export const setupIncompleteFallbackCopy = {
  title: "Termin direkt anfragen",
  body: "Online sind gerade keine Zeiten verfuegbar. Du erreichst den Salon direkt per Telefon, WhatsApp oder E-Mail.",
  contactTitle: "Direkter Kontakt",
  contactBody: "Wir finden gemeinsam einen passenden Termin.",
};

function createServiceOption(service: Service): PublicBookingServiceOptionDto {
  return {
    id: service.id,
    title: service.title,
    category: service.category,
    description: service.description,
    durationMinutes: service.booking.durationMinutes,
    durationLabel: service.durationHint,
    priceLabel: service.booking.priceLabel,
    note: service.note,
    serviceId: service.id,
    serviceTitle: service.title,
    serviceCategory: service.category,
    serviceDurationMinutes: service.booking.durationMinutes,
    servicePriceLabel: service.booking.priceLabel,
  };
}

export function derivePublicBookingServiceOptions(
  services: Service[] = bookableServices
): PublicBookingServiceOptionsDto {
  const categories = serviceCategoryOrder
    .map((category) => {
      const categoryServices = services
        .filter((service) => service.category === category)
        .map(createServiceOption);

      return {
        id: category,
        label: category,
        services: categoryServices,
      } satisfies PublicBookingServiceCategoryOptionDto;
    })
    .filter((category) => category.services.length > 0);

  return {
    categories,
    showCategorySelector: categories.length > 1,
    initialCategory: categories[0]?.id ?? null,
  };
}

export function deriveStylistPreferenceOptions(
  serviceId: string,
  staffRows: StaffSetupDto[]
): StylistPreferenceOptionsDto {
  const service = getBookableServiceById(serviceId);
  const eligibleStaff = service
    ? staffRows
        .filter(
          (staffRow) =>
            staffRow.active &&
            staffRow.assignedServices.some(
              (assignment) => assignment.serviceId === service.id
            )
        )
        .map((staffRow) => ({
          id: staffRow.id,
          name: staffRow.name,
          slug: staffRow.slug,
        }))
    : [];

  if (eligibleStaff.length === 1) {
    return {
      eligibleStaff,
      options: [],
      resolvedStaffId: eligibleStaff[0]?.id ?? null,
      showStylistStep: false,
    };
  }

  if (eligibleStaff.length > 1) {
    return {
      eligibleStaff,
      options: [
        {
          id: "any",
          kind: "any",
          label: "Keine Praeferenz",
          staffId: null,
        },
        ...eligibleStaff.map((staffRow) => ({
          id: staffRow.id,
          kind: "staff" as const,
          label: staffRow.name,
          staffId: staffRow.id,
        })),
      ],
      resolvedStaffId: null,
      showStylistStep: true,
    };
  }

  return {
    eligibleStaff,
    options: [],
    resolvedStaffId: null,
    showStylistStep: false,
  };
}
