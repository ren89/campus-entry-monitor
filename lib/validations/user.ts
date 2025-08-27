import { z } from "zod";

export const USER_TYPES = ["Student", "Staff", "Professor", "Admin"] as const;
export type UserType = (typeof USER_TYPES)[number];

export const userFormSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "First name can only contain letters, spaces, hyphens, and apostrophes"
    ),

  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Last name can only contain letters, spaces, hyphens, and apostrophes"
    ),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .max(100, "Email must be less than 100 characters"),

  userType: z.enum(USER_TYPES).refine((val) => USER_TYPES.includes(val), {
    message: "Please select a valid user type",
  }),

  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^09\d{9}$/,
      "Phone number must be in format 09xxxxxxxxx (11 digits starting with 09)"
    )
    .length(11, "Phone number must be exactly 11 digits"),

  guardianPhoneNumber: z
    .string()
    .regex(
      /^09\d{9}$/,
      "Guardian phone number must be in format 09xxxxxxxxx (11 digits starting with 09)"
    )
    .length(11, "Guardian phone number must be exactly 11 digits")
    .optional()
    .or(z.literal("")),

  rfid: z
    .string()
    .min(1, "RFID is required")
    .min(4, "RFID must be at least 4 characters")
    .max(50, "RFID must be less than 50 characters")
    .regex(/^[A-Za-z0-9]+$/, "RFID can only contain letters and numbers"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters")
    .optional(),
});

export type UserFormData = z.infer<typeof userFormSchema>;

export const validateUserForm = (
  data: UserFormData
): {
  isValid: boolean;
  errors: Partial<Record<keyof UserFormData, string>>;
} => {
  const result = userFormSchema.safeParse(data);

  if (result.success) {
    return { isValid: true, errors: {} };
  }

  const errors: Partial<Record<keyof UserFormData, string>> = {};

  result.error.issues.forEach((issue) => {
    const path = issue.path[0] as keyof UserFormData;
    if (path && !errors[path]) {
      errors[path] = issue.message;
    }
  });

  return { isValid: false, errors };
};

export const validateField = (
  fieldName: keyof UserFormData,
  value: string | undefined
) => {
  try {
    const fieldSchema = userFormSchema.shape[fieldName];
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

export const getZodResolver = () => {
  return userFormSchema;
};
