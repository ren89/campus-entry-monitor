"use client";

import { useRef, useEffect } from "react";

interface RFIDInputProps {
  label?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  placeholder?: string;
  className?: string;
  minLength?: number;
}

export default function RFIDInput({
  label = "RFID Card",
  name = "rfid",
  value,
  onChange,
  required = true,
  disabled = false,
  error,
  placeholder = "Click here and scan RFID card",
  className = "",
  minLength = 5,
}: RFIDInputProps) {
  const rfidInputRef = useRef<HTMLInputElement>(null);

  // RFID Scanner Effect
  useEffect(() => {
    let rfidBuffer = "";
    let rfidTimeout: NodeJS.Timeout;

    const handleKeyPress = (event: KeyboardEvent) => {
      // Only capture when RFID input is focused or no input is focused
      const activeElement = document.activeElement;
      const isRFIDInputFocused = activeElement === rfidInputRef.current;
      const isNoInputFocused =
        !(
          activeElement instanceof HTMLInputElement ||
          activeElement instanceof HTMLTextAreaElement
        ) || isRFIDInputFocused;

      if (!isNoInputFocused && !isRFIDInputFocused) {
        return;
      }

      clearTimeout(rfidTimeout);

      if (event.key === "Enter") {
        // RFID scan complete
        if (rfidBuffer.length >= minLength) {
          onChange(rfidBuffer);
          if (rfidInputRef.current) {
            rfidInputRef.current.blur();
          }
        }
        rfidBuffer = "";
        if (isRFIDInputFocused) {
          event.preventDefault();
        }
      } else if (event.key.length === 1) {
        // Add character to buffer
        rfidBuffer += event.key;

        // Reset buffer after timeout
        rfidTimeout = setTimeout(() => {
          rfidBuffer = "";
        }, 200);
      }
    };

    document.addEventListener("keypress", handleKeyPress);

    return () => {
      document.removeEventListener("keypress", handleKeyPress);
      clearTimeout(rfidTimeout);
    };
  }, [onChange, minLength]);

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          ref={rfidInputRef}
          id={name}
          name={name}
          type="text"
          value={value}
          onChange={() => {
            // Prevent React warning - actual changes handled by useEffect
          }}
          onKeyDown={(e) => {
            // Prevent manual typing by blocking slow keystrokes
            if (e.key.length === 1) {
              const now = Date.now();
              const target = e.target as HTMLInputElement & {
                lastKeyTime?: number;
              };
              const lastKeyTime = target.lastKeyTime || 0;
              const timeDiff = now - lastKeyTime;

              // Block manual typing (slow keystrokes)
              if (timeDiff > 100 && lastKeyTime > 0) {
                e.preventDefault();
              }

              target.lastKeyTime = now;
            }
          }}
          onPaste={(e) => e.preventDefault()}
          required={required}
          disabled={disabled}
          className={`border rounded p-2 w-full pr-24 ${
            value ? "bg-green-50 border-green-300" : "bg-gray-50"
          } ${error ? "border-red-500" : ""} ${className}`}
          placeholder={placeholder}
          autoComplete="off"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500 flex items-center">
          <span className="mr-1">📱</span>
          Scanner Only
        </div>
      </div>
      <p className="text-xs text-gray-600">
        Scan your RFID card. Manual typing is disabled.
      </p>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
