"use client";

import { useState, useCallback } from "react";
import Input from "@/components/shared/Input";
import Button from "@/components/shared/Button";
import { Room } from "@/lib/types/database";
import {
  validateRoomForm,
  RoomFormData,
  validateRoomField,
} from "@/lib/validations/room";

interface RoomFormProps {
  room?: Partial<Room>;
  onSubmit: (roomData: RoomFormData) => Promise<void>;
  onCancel: () => void;
  onDelete?: () => Promise<void>;
  isLoading?: boolean;
  isDeleting?: boolean;
}

export function RoomForm({
  room,
  onSubmit,
  onCancel,
  onDelete,
  isLoading = false,
  isDeleting = false,
}: RoomFormProps) {
  const [formData, setFormData] = useState<RoomFormData>({
    location: room?.location || "",
    description: room?.description || "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof RoomFormData, string>>
  >({});

  const handleInputChange = useCallback(
    (field: keyof RoomFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      const fieldValidation = validateRoomField(field, value);
      if (!fieldValidation.isValid) {
        setErrors((prev) => ({
          ...prev,
          [field]: fieldValidation.error || undefined,
        }));
      } else {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    []
  );

  const handleValidation = () => {
    const validation = validateRoomForm(formData);
    setErrors(validation.errors);
    return validation.isValid;
  };

  const handleSave = async () => {
    if (!handleValidation()) {
      return;
    }

    try {
      await onSubmit(formData);
      console.log("Room form submitted successfully", formData);
    } catch (error) {
      console.error("Error submitting room form:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Input
          label="Location"
          name="location"
          value={formData.location}
          onChange={(e) => handleInputChange("location", e.target.value)}
          required
          disabled={isLoading}
          className={errors.location ? "border-red-500" : ""}
          placeholder="e.g., Building 1, Floor 2, Room A-101"
        />
        {errors.location && (
          <p className="text-red-500 text-sm mt-1">{errors.location}</p>
        )}
      </div>

      <div>
        <Input
          label="Description"
          name="description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          disabled={isLoading}
          className={errors.description ? "border-red-500" : ""}
          placeholder="Optional description of the room"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        {room?.id ? (
          <Button
            type="button"
            variant="outline"
            onClick={onDelete}
            disabled={isDeleting || isLoading || !onDelete}
            isLoading={isDeleting}
            loadingText="Deleting..."
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Delete
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading || isDeleting}
          >
            Cancel
          </Button>
        )}
        <Button
          type="button"
          onClick={handleSave}
          isLoading={isLoading}
          loadingText="Saving..."
          disabled={isDeleting}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
