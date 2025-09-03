import { z } from "zod";

// File upload validation schema
export const fileUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size > 0, "File is required")
    .refine(
      (file) => file.size <= 5 * 1024 * 1024, // 5MB
      "File size must be less than 5MB"
    )
    .refine(
      (file) =>
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          file.type
        ),
      "File must be a JPEG, PNG, or WebP image"
    ),
  userId: z.string().uuid("Invalid user ID format"),
});

// Avatar upload validation schema
export const avatarUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size > 0, "Avatar file is required")
    .refine(
      (file) => file.size <= 5 * 1024 * 1024, // 5MB
      "Avatar file size must be less than 5MB"
    )
    .refine(
      (file) =>
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          file.type
        ),
      "Avatar must be a JPEG, PNG, or WebP image"
    )
    .refine((file) => {
      // Basic dimension check (if needed)
      return true; // Could add image dimension validation here
    }, "Invalid image dimensions"),
  userId: z.string().uuid("Invalid user ID format"),
});

// Form data validation for file uploads
export const avatarUploadFormSchema = z.object({
  avatar: z
    .any()
    .refine((files) => files?.length === 1, "Avatar file is required")
    .transform((files) => files[0] as File)
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "Avatar file size must be less than 5MB"
    )
    .refine(
      (file) =>
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          file.type
        ),
      "Avatar must be a JPEG, PNG, or WebP image"
    ),
});

// Storage bucket validation
export const bucketOperationSchema = z.object({
  bucketName: z.string().min(1, "Bucket name is required"),
  filePath: z.string().min(1, "File path is required"),
});

// File deletion validation
export const fileDeleteSchema = z.object({
  userId: z.string().uuid("Invalid user ID format"),
  bucketName: z.string().optional().default("avatar"),
});

// Type exports for use in components/services
export type FileUploadData = z.infer<typeof fileUploadSchema>;
export type AvatarUploadData = z.infer<typeof avatarUploadSchema>;
export type AvatarUploadFormData = z.infer<typeof avatarUploadFormSchema>;
export type BucketOperationData = z.infer<typeof bucketOperationSchema>;
export type FileDeleteData = z.infer<typeof fileDeleteSchema>;

// Helper function to validate file before upload
export function validateStorageFile(file: File): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check file size
  if (file.size > 5 * 1024 * 1024) {
    errors.push("File size must be less than 5MB");
  }

  // Check file type
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    errors.push("File must be a JPEG, PNG, or WebP image");
  }

  // Check if file is empty
  if (file.size === 0) {
    errors.push("File cannot be empty");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
