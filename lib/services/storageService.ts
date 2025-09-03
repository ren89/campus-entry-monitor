import { createClient } from "../supabase/client";
import type { StorageUploadResponse, AvatarUploadData } from "../types/storage";

export class StorageService {
  private static readonly BUCKET_NAME = "avatar";

  /**
   * Upload an avatar file for a specific user
   */
  static async uploadAvatar(
    uploadData: AvatarUploadData
  ): Promise<StorageUploadResponse> {
    const supabase = createClient();
    const { file, userId } = uploadData;

    try {
      // Create a unique file path using userId and timestamp
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Error uploading avatar:", error);
        return {
          success: false,
          error: error.message || "Failed to upload avatar",
        };
      }

      // Get public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(filePath);

      return {
        success: true,
        url: urlData.publicUrl,
        path: filePath,
      };
    } catch (error) {
      console.error("Unexpected error uploading avatar:", error);
      return {
        success: false,
        error: "Unexpected error occurred during upload",
      };
    }
  }

  /**
   * Get the public URL for a user's avatar
   */
  static async getAvatarUrl(userId: string): Promise<string | null> {
    const supabase = createClient();

    try {
      // List files in the user's avatar directory
      const { data: files, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(`avatars`, {
          search: userId,
        });

      if (error || !files || files.length === 0) {
        return null;
      }

      // Find the most recent avatar file for this user
      const userAvatar = files
        .filter((file) => file.name.startsWith(userId))
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0];

      if (!userAvatar) {
        return null;
      }

      const filePath = `avatars/${userAvatar.name}`;
      const { data: urlData } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error("Error getting avatar URL:", error);
      return null;
    }
  }

  /**
   * Delete a user's avatar
   */
  static async deleteAvatar(userId: string): Promise<boolean> {
    const supabase = createClient();

    try {
      // List files in the user's avatar directory
      const { data: files, error: listError } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(`avatars`, {
          search: userId,
        });

      if (listError || !files || files.length === 0) {
        console.warn("No avatar files found for user:", userId);
        return true; // Consider it successful if no files exist
      }

      // Get all avatar files for this user
      const userAvatarPaths = files
        .filter((file) => file.name.startsWith(userId))
        .map((file) => `avatars/${file.name}`);

      if (userAvatarPaths.length === 0) {
        return true; // No files to delete
      }

      // Delete all avatar files for this user
      const { error: deleteError } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove(userAvatarPaths);

      if (deleteError) {
        console.error("Error deleting avatar files:", deleteError);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Unexpected error deleting avatar:", error);
      return false;
    }
  }

  /**
   * Update/replace a user's avatar (deletes old one and uploads new one)
   */
  static async updateAvatar(
    uploadData: AvatarUploadData
  ): Promise<StorageUploadResponse> {
    try {
      // First, delete existing avatar(s)
      await this.deleteAvatar(uploadData.userId);

      // Then upload the new avatar
      return await this.uploadAvatar(uploadData);
    } catch (error) {
      console.error("Error updating avatar:", error);
      return {
        success: false,
        error: "Failed to update avatar",
      };
    }
  }

  /**
   * Get file size and validate file type
   */
  static validateAvatarFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: "File type not supported. Please use JPEG, PNG, or WebP format.",
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: "File size too large. Maximum size is 5MB.",
      };
    }

    return { valid: true };
  }

  /**
   * Get storage usage statistics for the avatar bucket
   */
  static async getStorageStats(): Promise<{
    totalFiles: number;
    totalSize: number;
  } | null> {
    const supabase = createClient();

    try {
      const { data: files, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list("avatars");

      if (error || !files) {
        return null;
      }

      const totalFiles = files.length;
      const totalSize = files.reduce(
        (sum, file) => sum + (file.metadata?.size || 0),
        0
      );

      return { totalFiles, totalSize };
    } catch (error) {
      console.error("Error getting storage stats:", error);
      return null;
    }
  }
}
