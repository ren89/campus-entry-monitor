// Database row types (snake_case as stored in database)
export interface UserRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: "Student" | "Staff" | "Professor" | "Admin";
  section?: string;
  phone_number: string;
  guardian_phone_number: string;
  rfid: string;
  avatar?: string;
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
  avatar?: string;
  created_at: string;
  next_action?: "Entry" | "Exit";
}
