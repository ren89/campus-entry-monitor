import { useEffect } from "react";
import { RFID_CONFIG } from "@/lib/constants";
import type { UseRFIDScannerProps } from "@/lib/types";

export const useRFIDScanner = ({
  onScan,
  minLength = RFID_CONFIG.minLength,
  timeout = RFID_CONFIG.timeout,
}: UseRFIDScannerProps) => {
  useEffect(() => {
    let rfidBuffer = "";
    let rfidTimeout: NodeJS.Timeout;

    const handleKeyPress = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      clearTimeout(rfidTimeout);

      if (event.key === "Enter") {
        // RFID cards typically end with Enter
        if (rfidBuffer.length > minLength) {
          onScan(rfidBuffer);
        }
        rfidBuffer = "";
      } else if (event.key.length === 1) {
        // Add character to buffer
        rfidBuffer += event.key;

        // Reset buffer after timeout of inactivity
        rfidTimeout = setTimeout(() => {
          rfidBuffer = "";
        }, timeout);
      }
    };

    document.addEventListener("keypress", handleKeyPress);

    return () => {
      document.removeEventListener("keypress", handleKeyPress);
      clearTimeout(rfidTimeout);
    };
  }, [onScan, minLength, timeout]);
};
