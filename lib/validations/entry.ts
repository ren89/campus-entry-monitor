import { z } from "zod";

export const rfidEntrySchema = z.object({
  rfidId: z.string().min(6, "RFID ID must be at least 6 characters"),
  fullName: z.string().optional(),
  room: z.string().optional(),
  avatarUrl: z.string().url().optional().nullable(),
});

export const toastDataSchema = z.object({
  rfidId: z.string(),
  fullName: z.string().optional(),
  room: z.string().optional(),
  avatarUrl: z.string().url().optional().nullable(),
  isError: z.boolean().optional(),
  errorMessage: z.string().optional(),
});

export type RfidEntry = z.infer<typeof rfidEntrySchema>;
export type ToastData = z.infer<typeof toastDataSchema>;
