export interface EntryRecord {
  id?: string;
  created_at?: string;
  name: string;
  rfid: string;
  action: "Entry" | "Exit";
  location: string;
  user_id: string;
  guardian_phone_number?: string;
  avatarUrl?: string;
}

export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: "Student" | "Staff" | "Professor" | "Admin";
  section?: string;
  phoneNumber: string;
  guardianPhoneNumber: string;
  rfid: string;
  avatar?: string;
  created_at?: string;
  nextAction?: string;
}

export interface Room {
  id?: string;
  location: string;
  created_at?: string;
  description?: string;
}
