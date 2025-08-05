"use client";

import React from "react";
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
  size?: "sm" | "default";
  name?: string;
}

export function Select({
  label,
  placeholder = "Select an option...",
  value,
  onValueChange,
  options,
  required = false,
  disabled = false,
  className,
  error,
  size = "default",
  name,
}: SelectProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-900">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <ShadcnSelect
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        name={name}
      >
        <SelectTrigger
          className={cn(
            "w-full",
            error && "border-red-500 focus-visible:ring-red-500/20",
            className
          )}
          size={size}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </ShadcnSelect>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}

export default Select;
