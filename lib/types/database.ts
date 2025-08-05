export interface EntryRecord {
  id: number;
  name: string;
  created_at: string;
}

export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: "Student" | "Staff" | "Professor" | "Admin";
  phoneNumber: string;
  guardianPhoneNumber: string;
  rfid: string;
  created_at?: string;
}
