"use client";

import { useState, useCallback } from "react";
import Input from "@/components/shared/Input";
import Button from "@/components/shared/Button";
import Select from "@/components/shared/Select";
import { RFIDInput } from "@/components/shared";
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
    phoneNumber: user?.phoneNumber || "",
    guardianPhoneNumber: user?.guardianPhoneNumber || "",
    rfid: user?.rfid || "100000",
    password: "", // Only used for new users
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof UserFormData, string>>
  >({});

  // Format phone number to 09xxxxxxxxx format
  const formatPhoneNumber = useCallback((value: string): string => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "");

    // Ensure it starts with 09 and limit to 11 digits
    if (digits.length === 0) return "";

    if (!digits.startsWith("09")) {
      // If user types something else, force it to start with 09
      return "09";
    }

    // Limit to 11 digits (09 + 9 more digits)
    return digits.slice(0, 11);
  }, []);

  const handleInputChange = useCallback(
    (field: keyof UserFormData, value: string) => {
      let processedValue = value;

      // Apply phone number formatting for phone number fields
      if (field === "phoneNumber" || field === "guardianPhoneNumber") {
        processedValue = formatPhoneNumber(value);
      }

      setFormData((prev) => ({ ...prev, [field]: processedValue }));

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
    },
    [formatPhoneNumber]
  );

  const handleValidation = () => {
    // For new users, password is required
    const validationData = { ...formData };
    if (!user && !formData.password) {
      setErrors((prev) => ({
        ...prev,
        password: "Password is required for new users",
      }));
      return false;
    }

    const validation = validateUserForm(validationData);
    setErrors(validation.errors);
    return validation.isValid;
  };

  const handleSave = async () => {
    if (!handleValidation()) {
      return;
    }

    try {
      await onSubmit(formData);
      console.log("User form submitted successfully", formData);
    } catch (error) {
      console.error("Error submitting user form:", error);
    }
  };

  return (
    <div className="space-y-4">
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
          placeholder="09123456789"
          maxLength={11}
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
          placeholder="09123456789"
          maxLength={11}
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

      <div className="flex justify-end space-x-3 pt-4 border-t">
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
          isLoading={isLoading}
          loadingText="Saving..."
        >
          Save
        </Button>
      </div>
    </div>
  );
}
