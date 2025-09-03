"use client";

import { useState, useRef, ChangeEvent } from "react";
import { Upload, User, X } from "lucide-react";
import Button from "./Button";
import { validateStorageFile } from "@/lib/validations/storage";

interface AvatarUploadProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
  error?: string;
  currentAvatarUrl?: string;
  className?: string;
}

export function AvatarUpload({
  onChange,
  disabled = false,
  error,
  currentAvatarUrl,
  className = "",
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    const validation = validateStorageFile(file);

    if (!validation.valid) {
      // Handle validation errors - you might want to show these to the user
      console.error("File validation failed:", validation.errors);
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    // Pass file to parent component
    onChange(file);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Show current avatar, new preview, or placeholder
  const displayImage = preview || currentAvatarUrl;

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Avatar
      </label>

      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${
            dragActive
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
              : "border-gray-300 dark:border-gray-600"
          }
          ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:border-gray-400 dark:hover:border-gray-500"
          }
          ${error ? "border-red-500" : ""}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={!disabled ? handleButtonClick : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileInputChange}
          disabled={disabled}
          className="hidden"
        />

        {displayImage ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayImage}
              alt="Avatar preview"
              className="w-24 h-24 mx-auto rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
            />
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X size={12} />
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="w-24 h-24 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <User size={32} className="text-gray-400" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Upload Avatar
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Drag & drop or click to browse
              </p>
            </div>
          </div>
        )}

        {!disabled && (
          <div className="absolute bottom-2 right-2">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
              <Upload size={16} />
            </div>
          </div>
        )}
      </div>

      {/* File requirements */}
      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <p>• JPEG, PNG, or WebP format</p>
        <p>• Maximum size: 5MB</p>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Additional actions */}
      {displayImage && !disabled && (
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleButtonClick}
            className="flex-1"
          >
            <Upload size={16} className="mr-2" />
            Change
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRemove}
            className="px-3"
          >
            <X size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}
