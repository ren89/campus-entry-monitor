// Database row types (snake_case as stored in database)
// These represent the actual structure returned from Supabase queries

// User table row types
export interface UserRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: "Student" | "Staff" | "Professor" | "Admin";
  phone_number: string;
  guardian_phone_number: string;
  rfid: string;
  created_at: string;
  next_action?: "Entry" | "Exit";
}

export interface UserRFIDRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  guardian_phone_number: string;
  rfid: string;
  created_at: string;
  next_action?: "Entry" | "Exit";
}

// Entry records table row types
export interface EntryRecordRow {
  id: string;
  created_at: string;
  name: string;
  rfid: string;
  action: "Entry" | "Exit";
  location: string;
  user_id: string;
}

// Room table row types (if you have rooms)
export interface RoomRow {
  id: string;
  name: string;
  capacity?: number;
  location?: string;
  created_at: string;
  updated_at: string;
}

// Add more database row types as needed
// Example: AdminRow, LogRow, SettingsRow, etc.
