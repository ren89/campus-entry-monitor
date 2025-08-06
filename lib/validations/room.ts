import { z } from "zod";

export const roomFormSchema = z.object({
  location: z
    .string()
    .min(1, "Location is required")
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location must be less than 100 characters")
    .regex(
      /^[a-zA-Z0-9\s\-.,#()]+$/,
      "Location can only contain letters, numbers, spaces, and common symbols"
    ),

  description: z
    .string()
    .max(255, "Description must be less than 255 characters")
    .optional()
    .or(z.literal("")),
});

export type RoomFormData = z.infer<typeof roomFormSchema>;

export const validateRoomForm = (
  data: RoomFormData
): {
  isValid: boolean;
  errors: Partial<Record<keyof RoomFormData, string>>;
} => {
  const result = roomFormSchema.safeParse(data);

  if (result.success) {
    return { isValid: true, errors: {} };
  }

  const errors: Partial<Record<keyof RoomFormData, string>> = {};

  result.error.issues.forEach((issue) => {
    const path = issue.path[0] as keyof RoomFormData;
    if (path && !errors[path]) {
      errors[path] = issue.message;
    }
  });

  return { isValid: false, errors };
};

export const validateRoomField = (
  fieldName: keyof RoomFormData,
  value: string | undefined
) => {
  try {
    const fieldSchema = roomFormSchema.shape[fieldName];
    fieldSchema.parse(value);
    return { isValid: true, error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        error: error.issues[0]?.message || "Invalid value",
      };
    }
    return { isValid: false, error: "Validation error" };
  }
};

export const getRoomZodResolver = () => {
  return roomFormSchema;
};
