import { z } from "zod";

export const slotQuerySchema = z.object({
  serviceId: z.string().trim().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  staffId: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined)),
});

export type SlotQueryInput = z.infer<typeof slotQuerySchema>;

const optionalTrimmedString = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : undefined));

export const publicBookingSubmissionSchema = z.object({
  serviceId: z.string().trim().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  slotId: z.string().trim().min(1),
  staffId: z.string().trim().min(1),
  startAt: z.string().datetime(),
  stylistPreferenceStaffId: optionalTrimmedString,
  name: z.string().trim().min(1, "Bitte gib deinen Namen ein."),
  phone: z
    .string()
    .trim()
    .min(1, "Bitte gib eine Telefonnummer fuer Rueckfragen ein."),
  email: z
    .string()
    .trim()
    .email("Bitte gib eine gueltige E-Mail-Adresse ein."),
  note: optionalTrimmedString,
});

export type PublicBookingSubmissionInput = z.infer<typeof publicBookingSubmissionSchema>;
