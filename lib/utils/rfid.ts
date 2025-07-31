import { RFID_CONFIG } from "@/lib/constants";

/**
 * Validates if an RFID ID meets minimum requirements
 */
export const validateRfidId = (id: string): boolean => {
  return id.trim().length >= RFID_CONFIG.minLength;
};

/**
 * Formats an RFID ID consistently
 */
export const formatRfidId = (id: string): string => {
  return id.trim().toUpperCase();
};

/**
 * Checks if an RFID ID appears to be valid format
 */
export const isValidRfidFormat = (id: string): boolean => {
  const formatted = formatRfidId(id);
  // Basic format validation - alphanumeric, minimum length
  return /^[A-Z0-9]+$/.test(formatted) && validateRfidId(formatted);
};

/**
 * Sanitizes RFID input by removing invalid characters
 */
export const sanitizeRfidInput = (input: string): string => {
  return input.replace(/[^a-zA-Z0-9]/g, "").trim();
};
