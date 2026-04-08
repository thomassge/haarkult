import { services, type Service, type ServiceCategory } from "@/content/services";

export type BookingServiceSnapshot = {
  serviceId: string;
  serviceTitle: string;
  serviceCategory: ServiceCategory;
  serviceDurationMinutes: number;
  servicePriceLabel: string;
};

export function isOnlineBookableService(service: Service) {
  return service.booking.onlineBookable;
}

export const bookableServices = services.filter(isOnlineBookableService);

export function getBookableServiceById(serviceId: string) {
  return bookableServices.find((service) => service.id === serviceId) ?? null;
}

export function createBookingServiceSnapshot(service: Service): BookingServiceSnapshot {
  return {
    serviceId: service.id,
    serviceTitle: service.title,
    serviceCategory: service.category,
    serviceDurationMinutes: service.booking.durationMinutes,
    servicePriceLabel: service.booking.priceLabel,
  };
}
