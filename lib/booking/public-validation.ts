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
