import { createClient } from "../supabase/client";
import type { EntryRecord } from "../types/database";

export interface CreateEntryRecord {
  name: string;
}

export class EntryRecordService {
  static async getAll(): Promise<EntryRecord[]> {
    const supabase = createClient();

    const { data: logs, error } = await supabase
      .from("entry_records")
      .select("id, name, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching entry logs:", error);
      return [];
    }

    return logs || [];
  }

  static async create(data: CreateEntryRecord): Promise<EntryRecord | null> {
    const supabase = createClient();

    const { data: newLog, error } = await supabase
      .from("entry_records")
      .insert(data)
      .select("id, name, created_at")
      .single();

    if (error) {
      console.error("Error creating entry log:", error);
      return null;
    }

    return newLog;
  }

  static async delete(id: string): Promise<boolean> {
    const supabase = createClient();

    const { error } = await supabase
      .from("entry_records")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting entry log:", error);
      return false;
    }

    return true;
  }
}
