import { createClient } from "../supabase/client";
import { Room, RoomRow } from "../types";
import { RoomFormData } from "../validations";

export class RoomService {
  static async getAll(): Promise<Room[]> {
    const supabase = createClient();

    const {
      data: rooms,
      error,
    }: {
      data: RoomRow[] | null;
      error: Error | null;
    } = await supabase.from("rooms").select("id, location, description");

    if (error) {
      console.error("Error fetching rooms:", error);
      return [];
    }

    return (
      rooms?.map((room) => ({
        id: room.id,
        location: room.location,
        description: room.description || "",
      })) || []
    );
  }

  static async create(formData: RoomFormData): Promise<Room> {
    const supabase = createClient();

    const {
      data,
      error,
    }: {
      data: RoomRow | null;
      error: Error | null;
    } = await supabase
      .from("rooms")
      .insert(formData)
      .select("id, location, description")
      .single();

    if (error) {
      console.error("Error creating room:", error);
      throw new Error("Failed to create room");
    }

    return {
      id: data?.id || "",
      location: data?.location || "",
      description: data?.description || "",
    };
  }

  static async update(roomId: string, formData: RoomFormData): Promise<Room> {
    const supabase = createClient();

    const {
      data,
      error,
    }: {
      data: RoomRow | null;
      error: Error | null;
    } = await supabase
      .from("rooms")
      .update(formData)
      .eq("id", roomId)
      .select("id, location, description")
      .single();

    if (error) {
      console.error("Error updating room:", error);
      throw new Error("Failed to update room");
    }

    return {
      id: data?.id || "",
      location: data?.location || "",
      description: data?.description || "",
    };
  }

  static async delete(roomId: string): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase.from("rooms").delete().eq("id", roomId);

    if (error) {
      console.error("Error deleting room:", error);
      throw new Error("Failed to delete room");
    }
  }
}
