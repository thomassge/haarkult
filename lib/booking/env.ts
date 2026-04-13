export type BookingEnv = {
  DATABASE_URL: string;
  AUTH_SECRET?: string;
  RESEND_API_KEY?: string;
  BOOKING_FROM_EMAIL?: string;
  BOOKING_NOTIFICATION_EMAIL?: string;
};

let cachedBookingEnv: BookingEnv | null = null;

export function isMissingBookingEnvError(error: unknown) {
  return (
    error instanceof Error &&
    error.message.startsWith("Missing required booking environment variable:")
  );
}

function readRequiredEnv(name: keyof BookingEnv) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required booking environment variable: ${name}`);
  }

  return value;
}

function readOptionalEnv(name: keyof BookingEnv) {
  const value = process.env[name];
  return value && value.length > 0 ? value : undefined;
}

export function getBookingEnv(): BookingEnv {
  if (cachedBookingEnv) {
    return cachedBookingEnv;
  }

  cachedBookingEnv = {
    DATABASE_URL: readRequiredEnv("DATABASE_URL"),
    AUTH_SECRET: readOptionalEnv("AUTH_SECRET"),
    RESEND_API_KEY: readOptionalEnv("RESEND_API_KEY"),
    BOOKING_FROM_EMAIL: readOptionalEnv("BOOKING_FROM_EMAIL"),
    BOOKING_NOTIFICATION_EMAIL: readOptionalEnv("BOOKING_NOTIFICATION_EMAIL"),
  };

  return cachedBookingEnv;
}
