"use client";

import { useState, useCallback } from "react";
import Input from "@/components/shared/Input";
import Button from "@/components/shared/Button";
import Select from "@/components/shared/Select";
import { RFIDInput } from "@/components/shared";
import { AvatarUpload } from "@/components/shared/AvatarUpload";
import { StorageService } from "@/lib/services";
import { User } from "@/lib/types/database";
import {
  validateUserForm,
  USER_TYPES,
  UserFormData,
  validateField,
} from "@/lib/validations/user";

interface UserFormProps {
  user?: Partial<User>;
  onSubmit: (userData: UserFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function UserForm({
  user,
  onSubmit,
  onCancel,
  isLoading = false,
}: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    userType: user?.userType || "Student",
    section: user?.section || "",
    phoneNumber: user?.phoneNumber || "",
    guardianPhoneNumber: user?.guardianPhoneNumber || "",
    rfid: user?.rfid || "",
    password: "", // Only used for new users
    avatar: user?.avatar || "",
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [errors, setErrors] = useState<
    Partial<Record<keyof UserFormData, string>>
  >({});

  // Format phone number to +639xxxxxxxxx format
  const formatPhoneNumber = useCallback((value: string): string => {
    // Remove all non-digit characters except the + sign
    const cleaned = value.replace(/[^\d+]/g, "");

    // If empty, return empty
    if (cleaned.length === 0) return "";

    // If it starts with +639, keep it as is and limit to 13 characters
    if (cleaned.startsWith("+639")) {
      return cleaned.slice(0, 13);
    }

    // If it starts with 639, add the + prefix
    if (cleaned.startsWith("639")) {
      return ("+" + cleaned).slice(0, 13);
    }

    // If it starts with 09, replace with +639
    if (cleaned.startsWith("09")) {
      return ("+639" + cleaned.slice(2)).slice(0, 13);
    }

    // If it starts with 9, assume it's a mobile number and add +639
    if (cleaned.startsWith("9")) {
      return ("+639" + cleaned).slice(0, 13);
    }

    // For any other input, start with +639
    return "+639";
  }, []);

  const handleInputChange = useCallback(
    (field: keyof UserFormData, value: string) => {
      let processedValue = value;

      // Apply phone number formatting for phone number fields
      if (field === "phoneNumber" || field === "guardianPhoneNumber") {
        processedValue = formatPhoneNumber(value);
      }

      setFormData((prev) => {
        const newData = { ...prev, [field]: processedValue };

        // Clear section field when user type changes from Student to something else
        if (field === "userType" && processedValue !== "Student") {
          newData.section = "";
        }

        return newData;
      });

      // Real-time field validation using Zod
      const fieldValidation = validateField(field, processedValue);
      if (!fieldValidation.isValid) {
        setErrors((prev) => ({
          ...prev,
          [field]: fieldValidation.error || undefined,
        }));
      } else {
        // Clear error when field becomes valid
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }

      // Clear section error when user type changes from Student
      if (field === "userType" && processedValue !== "Student") {
        setErrors((prev) => ({ ...prev, section: undefined }));
      }
    },
    [formatPhoneNumber]
  );

  const handleValidation = () => {
    const isUpdate = !!user;
    const validationData = { ...formData };

    // For new users, password is required
    if (!isUpdate && !formData.password) {
      setErrors((prev) => ({
        ...prev,
        password: "Password is required for new users",
      }));
      return false;
    }

    // Clean up phone numbers before validation
    if (validationData.phoneNumber && validationData.phoneNumber.length < 13) {
      setErrors((prev) => ({
        ...prev,
        phoneNumber:
          "Phone number must be exactly 13 characters (+639xxxxxxxxx)",
      }));
      return false;
    }

    // Clean up guardian phone number - if it's just "+639" or partial, make it empty
    if (
      validationData.guardianPhoneNumber &&
      validationData.guardianPhoneNumber.length > 0 &&
      validationData.guardianPhoneNumber.length < 13
    ) {
      if (validationData.guardianPhoneNumber === "+639") {
        validationData.guardianPhoneNumber = "";
      } else {
        setErrors((prev) => ({
          ...prev,
          guardianPhoneNumber:
            "Guardian phone number must be exactly 13 characters (+639xxxxxxxxx) or empty",
        }));
        return false;
      }
    }

    console.log("Validating form data:", validationData);
    const validation = validateUserForm(validationData, isUpdate);
    console.log("Validation result:", validation);
    setErrors(validation.errors);
    return validation.isValid;
  };

  const handleSave = async () => {
    console.log("Saving user form", formData);
    if (!handleValidation()) {
      console.log("Validation failed");
      return;
    }

    try {
      console.log("Validation passed");
      const finalFormData = { ...formData };

      // Handle avatar upload if a new file is selected
      if (avatarFile) {
        setUploadingAvatar(true);
        try {
          // For existing users, upload immediately
          // For new users, we'll need to upload after user creation with the actual user ID
          if (user?.id) {
            const uploadResult = await StorageService.updateAvatar({
              file: avatarFile,
              userId: user.id,
            });
            console.log("Upload result:", uploadResult);
            if (uploadResult.success && uploadResult.url) {
              finalFormData.avatar = uploadResult.url;
            } else {
              console.error("Avatar upload failed:", uploadResult.error);
              // Continue with form submission even if avatar upload fails
            }
          } else {
            // For new users, we'll upload after user creation
            // Pass the file in a special property for now
            (finalFormData as UserFormData & { avatarFile?: File }).avatarFile =
              avatarFile;
          }
        } catch (error) {
          console.error("Error uploading avatar:", error);
          // Continue with form submission even if avatar upload fails
        } finally {
          setUploadingAvatar(false);
        }
      }

      await onSubmit(finalFormData);
      console.log("User form submitted successfully", finalFormData);
    } catch (error) {
      console.error("Error submitting user form:", error);
    }
  };

  return (
    <div className="max-h-[75vh] overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            required
            disabled={isLoading}
            className={errors.firstName ? "border-red-500" : ""}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
          )}
        </div>

        <div>
          <Input
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            required
            disabled={isLoading}
            className={errors.lastName ? "border-red-500" : ""}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div>
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          required
          disabled={isLoading}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      {/* Password field - only show for new users */}
      {!user && (
        <div>
          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password || ""}
            onChange={(e) => handleInputChange("password", e.target.value)}
            required
            disabled={isLoading}
            className={errors.password ? "border-red-500" : ""}
            placeholder="Enter password for new account"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>
      )}

      <div>
        <Select
          label="User Type"
          value={formData.userType}
          onValueChange={(value) => handleInputChange("userType", value)}
          options={USER_TYPES.map((type) => ({
            value: type,
            label: type,
          }))}
          required
          disabled={isLoading}
          error={errors.userType}
          placeholder="Select user type"
        />
      </div>

      {/* Section field - only show for Students */}
      {formData.userType === "Student" && (
        <div>
          <Input
            label="Section"
            name="section"
            value={formData.section}
            onChange={(e) => handleInputChange("section", e.target.value)}
            required
            disabled={isLoading}
            className={errors.section ? "border-red-500" : ""}
            placeholder="e.g., BSIT-1A, BSCS-2B"
            maxLength={20}
          />
          {errors.section && (
            <p className="text-red-500 text-sm mt-1">{errors.section}</p>
          )}
        </div>
      )}

      <div>
        <Input
          label="Phone Number"
          name="phoneNumber"
          type="tel"
          value={formData.phoneNumber}
          onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
          required
          disabled={isLoading}
          className={errors.phoneNumber ? "border-red-500" : ""}
          placeholder="+639123456789"
          maxLength={13}
        />
        {errors.phoneNumber && (
          <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
        )}
      </div>

      <div>
        <Input
          label="Guardian Phone Number"
          name="guardianPhoneNumber"
          type="tel"
          value={formData.guardianPhoneNumber}
          onChange={(e) =>
            handleInputChange("guardianPhoneNumber", e.target.value)
          }
          required
          disabled={isLoading}
          className={errors.guardianPhoneNumber ? "border-red-500" : ""}
          placeholder="+639123456789"
          maxLength={13}
        />
        {errors.guardianPhoneNumber && (
          <p className="text-red-500 text-sm mt-1">
            {errors.guardianPhoneNumber}
          </p>
        )}
      </div>

      <div>
        <RFIDInput
          label="RFID Card"
          name="rfid"
          value={formData.rfid}
          onChange={(value) => handleInputChange("rfid", value)}
          required
          disabled={isLoading}
          error={errors.rfid}
        />
      </div>

      {/* Avatar Upload */}
      <div>
        <AvatarUpload
          value={avatarFile}
          onChange={setAvatarFile}
          disabled={isLoading || uploadingAvatar}
          currentAvatarUrl={formData.avatar}
          error={errors.avatar}
        />
      </div>

      {/* Action Buttons Below Form */}
      <div className="flex justify-end space-x-3 pt-4 mt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleSave}
          isLoading={isLoading || uploadingAvatar}
          loadingText={uploadingAvatar ? "Uploading avatar..." : "Saving..."}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
