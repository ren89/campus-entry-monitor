import { createClient } from "../supabase/client";
import type { User } from "../types/database";
import { UserFormData } from "../validations/user";

export class UserService {
  static async getAll(): Promise<User[]> {
    const supabase = createClient();

    const { data: users, error } = await supabase
      .from("users")
      .select(
        "id, first_name, last_name, email, user_type, phone_number, guardian_phone_number, rfid, created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching users:", error);
      return [];
    }
    console.log("Fetched users:", users);

    return (
      users?.map((user) => ({
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        userType: user.user_type,
        phoneNumber: user.phone_number,
        guardianPhoneNumber: user.guardian_phone_number,
        rfid: user.rfid,
        created_at: user.created_at,
      })) || []
    );
  }

  static async create(userData: UserFormData): Promise<User> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("users")
      .insert({
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        user_type: userData.userType,
        phone_number: userData.phoneNumber,
        guardian_phone_number: userData.guardianPhoneNumber,
        rfid: userData.rfid,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating user:", error);
      throw error;
    }

    return {
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      userType: data.user_type,
      phoneNumber: data.phone_number,
      guardianPhoneNumber: data.guardian_phone_number,
      rfid: data.rfid,
      created_at: data.created_at,
    };
  }

  static async update(id: string, userData: UserFormData): Promise<User> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("users")
      .update({
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        user_type: userData.userType,
        phone_number: userData.phoneNumber,
        guardian_phone_number: userData.guardianPhoneNumber,
        rfid: userData.rfid,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating user:", error);
      throw error;
    }

    return {
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      userType: data.user_type,
      phoneNumber: data.phone_number,
      guardianPhoneNumber: data.guardian_phone_number,
      rfid: data.rfid,
      created_at: data.created_at,
    };
  }

  static async delete(id: number): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase.from("users").delete().eq("id", id);

    if (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }
}
