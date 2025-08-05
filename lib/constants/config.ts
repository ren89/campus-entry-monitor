export const DEFAULT_USER = {
  fullName: "John Doe",
  room: "A-101",
  avatar: null,
} as const;

// RFID configuration
export const RFID_CONFIG = {
  minLength: 6,
  timeout: 500,
  bufferResetDelay: 200,
} as const;

// App metadata
export const APP_CONFIG = {
  name: "Campus Entry Monitor",
  shortName: "STI",
  copyright: "© 2025 STI College. All rights reserved.",
} as const;
