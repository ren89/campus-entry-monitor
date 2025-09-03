import { createClient } from "../supabase/client";
import type { EntryRecord, EntryRecordRow } from "../types";
import { UserService } from "./userService";

export class EntryRecordService {
  static async getAll(): Promise<EntryRecord[]> {
    const supabase = createClient();

    const {
      data: logs,
      error,
    }: {
      data: EntryRecordRow[] | null;
      error: Error | null;
    } = await supabase
      .from("entry_records")
      .select("id, name, created_at, location, action, rfid, user_id")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching entry logs:", error);
      return [];
    }

    return (
      logs?.map((log) => {
        return {
          id: log.id,
          created_at: log.created_at,
          name: log.name,
          rfid: log.rfid,
          action: log.action,
          location: log.location,
          user_id: log.user_id,
        };
      }) || []
    );
  }

  static async create(
    rfid: string,
    assignedRoom: string
  ): Promise<Partial<EntryRecord> | null> {
    const supabase = createClient();
    const user = await UserService.getByRFID(rfid);

    if (!user) {
      console.error("User not found");
      return null;
    }

    const {
      data: newLog,
      error,
    }: {
      data: Pick<
        EntryRecordRow,
        "id" | "name" | "created_at" | "action"
      > | null;
      error: Error | null;
    } = await supabase
      .from("entry_records")
      .insert({
        name: user?.name,
        created_at: new Date().toISOString(),
        rfid: rfid,
        action: user?.action,
        location: assignedRoom,
        user_id: user?.user_id,
      })
      .select("id, name, created_at, action, location")
      .single();

    UserService.updateNextAction(
      rfid,
      newLog?.action === "Entry" ? "Exit" : "Entry"
    );

    if (error || !newLog) {
      console.error("Error creating entry log:", error);
      return null;
    }

    return {
      name: newLog.name,
      created_at: newLog.created_at,
      location: assignedRoom,
      action: newLog.action,
      guardian_phone_number: user.guardian_phone_number,
      avatarUrl: user.avatarUrl,
    };
  }

  static async delete(id: string): Promise<boolean> {
    const supabase = createClient();

    const { error }: { error: Error | null } = await supabase
      .from("entry_records")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting entry log:", error);
      return false;
    }

    return true;
  }

  static async getById(id: string): Promise<Partial<EntryRecord>[]> {
    const supabase = createClient();

    const {
      data: logs,
      error,
    }: {
      data: Partial<EntryRecordRow>[] | null;
      error: Error | null;
    } = await supabase
      .from("entry_records")
      .select("created_at, location, action, user_id")
      .eq("user_id", id)
      .order("created_at", { ascending: false });

    if (error || !logs) {
      console.error("Error fetching entry logs:", error);
      return [];
    }

    return (
      logs?.map((log) => {
        return {
          id: log.id,
          created_at: log.created_at,
          name: log.name,
          rfid: log.rfid,
          action: log.action,
          location: log.location,
          user_id: log.user_id,
        };
      }) || []
    );
  }
}
