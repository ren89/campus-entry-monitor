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

export interface EntryRecordRow {
  id: string;
  created_at: string;
  name: string;
  rfid: string;
  action: "Entry" | "Exit";
  location: string;
  user_id: string;
}

export interface RecentEntryRow {
  created_at: string;
  name: string;
  action: "Entry" | "Exit";
  location: string;
}

export interface RoomRow {
  id: string;
  location: string;
  description?: string;
}
