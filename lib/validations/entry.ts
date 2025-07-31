import { z } from "zod";

// Entry record schema
export const entryRecordSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  created_at: z.string().optional(),
});

// RFID entry schema
export const rfidEntrySchema = z.object({
  rfidId: z.string().min(6, "RFID ID must be at least 6 characters"),
  fullName: z.string().optional(),
  room: z.string().optional(),
  avatarUrl: z.string().url().optional().nullable(),
});

// Toast data schema
export const toastDataSchema = z.object({
  rfidId: z.string(),
  fullName: z.string().optional(),
  room: z.string().optional(),
  avatarUrl: z.string().url().optional().nullable(),
  isError: z.boolean().optional(),
  errorMessage: z.string().optional(),
});

// Export types
export type EntryRecord = z.infer<typeof entryRecordSchema>;
export type RfidEntry = z.infer<typeof rfidEntrySchema>;
export type ToastData = z.infer<typeof toastDataSchema>;
