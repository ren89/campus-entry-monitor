import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, Modal } from "@/components/shared";
import { Room } from "@/lib/types";
import { RoomService } from "@/lib/services/roomService";
import { RoomForm } from "../RoomForm";
import { RoomAssignment } from "../RoomAssignment";
import { RoomFormData } from "@/lib/validations/room";
import { toast } from "sonner";

export function RoomManagementScreen() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      const rooms = await RoomService.getAll();
      setRooms(rooms);
    };

    fetchRooms();
  }, []);

  const handleAddRoom = () => {
    setSelectedRoom(null);
    setIsModalOpen(true);
  };

  const handleEditRoom = (room: Room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRoom(null);
  };

  const handleRoomSubmit = async (roomData: RoomFormData) => {
    setIsLoading(true);
    try {
      if (selectedRoom) {
        await RoomService.update(selectedRoom.id!, roomData);
        toast.success("Room updated successfully!");
        console.log("Room updated successfully");
      } else {
        await RoomService.create(roomData);
        toast.success("Room created successfully!");
        console.log("Room created successfully");
      }

      const updatedRooms = await RoomService.getAll();
      setRooms(updatedRooms);

      handleModalClose();
    } catch (error) {
      console.error("Error saving room:", error);
      toast.error("Error saving room. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoomDelete = async () => {
    if (!selectedRoom?.id) return;

    setIsDeleting(true);
    try {
      await RoomService.delete(selectedRoom.id);
      toast.success("Room deleted successfully!");
      console.log("Room deleted successfully");

      const updatedRooms = await RoomService.getAll();
      setRooms(updatedRooms);

      handleModalClose();
    } catch (error) {
      console.error("Error deleting room:", error);
      toast.error("Error deleting room. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Room Management
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage campus rooms and their availability
        </p>
      </div>

      <RoomAssignment rooms={rooms} />

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search rooms by name or location..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full"
          />
        </div>
        <Button onClick={handleAddRoom}>Add New Room</Button>
      </div>

      <Table
        data={rooms}
        onRowClick={handleEditRoom}
        globalFilter={searchFilter}
        onGlobalFilterChange={setSearchFilter}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={selectedRoom ? "Edit Room" : "Add New Room"}
        subtitle={
          selectedRoom ? "Update room information" : "Create a new room"
        }
      >
        <RoomForm
          room={selectedRoom || undefined}
          onSubmit={handleRoomSubmit}
          onCancel={handleModalClose}
          onDelete={selectedRoom ? handleRoomDelete : undefined}
          isLoading={isLoading}
          isDeleting={isDeleting}
        />
      </Modal>
    </div>
  );
}
