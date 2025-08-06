import { useEffect, useState } from "react";

const ASSIGNED_ROOM_KEY = "assigned_room";

export function useAssignedRoom() {
  const [assignedRoom, setAssignedRoom] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedRoom =
        localStorage.getItem(ASSIGNED_ROOM_KEY) ?? "Main Entrance";
      if (savedRoom) {
        setAssignedRoom(savedRoom);
      }
    }
  }, []);

  const assignRoom = (roomLocation: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(ASSIGNED_ROOM_KEY, roomLocation);
      setAssignedRoom(roomLocation);
    }
  };

  return {
    assignedRoom,
    assignRoom,
  };
}
