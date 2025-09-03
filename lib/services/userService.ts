import { createClient } from "../supabase/client";
import type { EntryRecord, User, UserRow, UserRFIDRow } from "../types";
import { UserFormData } from "../validations/user";

type UserDataForDB = Omit<UserFormData, "password">;

export class UserService {
  static async createUserAccount(
    email: string,
    password: string
  ): Promise<void> {
    const response = await fetch("/api/admin/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create user account");
    }
  }

  static async getAll(): Promise<User[]> {
    const supabase = createClient();

    const {
      data: users,
      error,
    }: {
      data: UserRow[] | null;
      error: Error | null;
    } = await supabase
      .from("users")
      .select(
        "id, first_name, last_name, email, user_type, section, phone_number, guardian_phone_number, rfid, avatar, created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching users:", error);
      return [];
    }

    return (
      users?.map((user) => ({
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        userType: user.user_type,
        section: user.section,
        phoneNumber: user.phone_number,
        guardianPhoneNumber: user.guardian_phone_number,
        rfid: user.rfid,
        avatar: user.avatar,
        created_at: user.created_at,
      })) || []
    );
  }

  static async create(userData: UserDataForDB): Promise<User> {
    const supabase = createClient();

    const {
      data,
      error,
    }: {
      data: UserRow | null;
      error: Error | null;
    } = await supabase
      .from("users")
      .insert({
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        user_type: userData.userType,
        section: userData.section || null,
        phone_number: userData.phoneNumber,
        guardian_phone_number: userData.guardianPhoneNumber,
        rfid: userData.rfid,
        avatar: userData.avatar || null,
      })
      .select()
      .single();

    if (error || !data) {
      console.error("Error creating user:", error);
      throw error || new Error("Failed to create user");
    }

    return {
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      userType: data.user_type,
      section: data.section,
      phoneNumber: data.phone_number,
      guardianPhoneNumber: data.guardian_phone_number,
      rfid: data.rfid,
      avatar: data.avatar,
      created_at: data.created_at,
    };
  }

  static async update(id: string, userData: UserDataForDB): Promise<User> {
    const supabase = createClient();

    const {
      data,
      error,
    }: {
      data: UserRow | null;
      error: Error | null;
    } = await supabase
      .from("users")
      .update({
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        user_type: userData.userType,
        section: userData.section || null,
        phone_number: userData.phoneNumber,
        guardian_phone_number: userData.guardianPhoneNumber,
        rfid: userData.rfid,
        avatar: userData.avatar || null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      console.error("Error updating user:", error);
      throw error || new Error("Failed to update user");
    }

    return {
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      userType: data.user_type,
      section: data.section,
      phoneNumber: data.phone_number,
      guardianPhoneNumber: data.guardian_phone_number,
      rfid: data.rfid,
      avatar: data.avatar,
      created_at: data.created_at,
    };
  }

  static async getByRFID(rfid: string): Promise<Partial<EntryRecord> | null> {
    const supabase = createClient();

    const {
      data,
      error,
    }: {
      data: UserRFIDRow | null;
      error: Error | null;
    } = await supabase
      .from("users")
      .select(
        "id, first_name, last_name, email, guardian_phone_number, rfid, avatar, created_at, next_action"
      )
      .eq("rfid", rfid)
      .single();

    if (error || !data) {
      console.warn("No user found with the provided RFID");
      return null;
    }

    return {
      name: `${data.first_name} ${data.last_name}`,
      user_id: data.id,
      rfid: data.rfid,
      action: data.next_action,
      guardian_phone_number: data.guardian_phone_number,
      avatarUrl: data.avatar,
    };
  }

  static async updateNextAction(
    rfid: string,
    nextAction: string
  ): Promise<boolean> {
    const supabase = createClient();

    const { error }: { error: Error | null } = await supabase
      .from("users")
      .update({ next_action: nextAction })
      .eq("rfid", rfid);

    if (error) {
      console.error("Error updating user's next action:", error);
      return false;
    }

    return true;
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const supabase = createClient();

    const {
      data,
      error,
    }: {
      data: UserRow | null;
      error: Error | null;
    } = await supabase
      .from("users")
      .select(
        "id, first_name, last_name, email, user_type, section, phone_number, guardian_phone_number, rfid, avatar, created_at"
      )
      .eq("email", email)
      .single();

    if (error || !data) {
      console.warn("No user found with the provided email:", email);
      return null;
    }

    return {
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      userType: data.user_type,
      section: data.section,
      phoneNumber: data.phone_number,
      guardianPhoneNumber: data.guardian_phone_number,
      rfid: data.rfid,
      avatar: data.avatar,
      created_at: data.created_at,
    };
  }
}
