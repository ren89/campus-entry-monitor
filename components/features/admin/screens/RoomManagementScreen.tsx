import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table } from "@/components/shared";

interface Room {
  id: number;
  name: string;
  location: string;
  capacity: number;
  status: "active" | "inactive";
  description?: string;
}

export function RoomManagementScreen() {
  const [searchFilter, setSearchFilter] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRoom, setNewRoom] = useState({
    name: "",
    location: "",
    capacity: "",
    description: "",
  });

  const [rooms, setRooms] = useState<Room[]>([
    {
      id: 1,
      name: "Conference Room A",
      location: "Building 1, Floor 2",
      capacity: 20,
      status: "active",
      description: "Main conference room with projector",
    },
    {
      id: 2,
      name: "Meeting Room B",
      location: "Building 1, Floor 3",
      capacity: 8,
      status: "active",
      description: "Small meeting room",
    },
    {
      id: 3,
      name: "Training Room",
      location: "Building 2, Floor 1",
      capacity: 30,
      status: "inactive",
      description: "Large training room with whiteboard",
    },
    {
      id: 4,
      name: "Study Hall",
      location: "Library, Floor 2",
      capacity: 50,
      status: "active",
      description: "Quiet study area",
    },
  ]);

  const handleAddRoom = () => {
    if (newRoom.name && newRoom.location && newRoom.capacity) {
      const room: Room = {
        id: rooms.length + 1,
        name: newRoom.name,
        location: newRoom.location,
        capacity: parseInt(newRoom.capacity),
        status: "active",
        description: newRoom.description,
      };
      setRooms([...rooms, room]);
      setNewRoom({ name: "", location: "", capacity: "", description: "" });
      setShowAddForm(false);
    }
  };

  const handleRemoveRoom = (roomId: number) => {
    setRooms(rooms.filter((room) => room.id !== roomId));
  };

  const toggleRoomStatus = (roomId: number) => {
    setRooms(
      rooms.map((room) =>
        room.id === roomId
          ? {
              ...room,
              status: room.status === "active" ? "inactive" : "active",
            }
          : room
      )
    );
  };

  const roomsWithActions = rooms.map((room) => ({
    ...room,
    actions: (
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleRoomStatus(room.id)}
          className={
            room.status === "active"
              ? "text-yellow-600 hover:text-yellow-700"
              : "text-green-600 hover:text-green-700"
          }
        >
          {room.status === "active" ? "Deactivate" : "Activate"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleRemoveRoom(room.id)}
          className="text-red-600 hover:text-red-700"
        >
          Remove
        </Button>
      </div>
    ),
  }));

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

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search rooms by name or location..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full"
          />
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Cancel" : "Add New Room"}
        </Button>
      </div>

      {showAddForm && (
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm mb-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Add New Room
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Room Name *
              </label>
              <Input
                placeholder="e.g., Conference Room A"
                value={newRoom.name}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Location *
              </label>
              <Input
                placeholder="e.g., Building 1, Floor 2"
                value={newRoom.location}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, location: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Capacity *
              </label>
              <Input
                type="number"
                placeholder="e.g., 20"
                value={newRoom.capacity}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, capacity: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Description
              </label>
              <Input
                placeholder="Optional description"
                value={newRoom.description}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, description: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleAddRoom}>Add Room</Button>
            <Button variant="outline" onClick={() => setShowAddForm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <Table
        data={roomsWithActions}
        onRowClick={(room) => console.log("Clicked room:", room)}
        globalFilter={searchFilter}
        onGlobalFilterChange={setSearchFilter}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-card-foreground mb-2">
            Total Rooms
          </h3>
          <p className="text-3xl font-bold text-primary">{rooms.length}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-card-foreground mb-2">
            Active Rooms
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {rooms.filter((room) => room.status === "active").length}
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-card-foreground mb-2">
            Inactive Rooms
          </h3>
          <p className="text-3xl font-bold text-red-600">
            {rooms.filter((room) => room.status === "inactive").length}
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-card-foreground mb-2">
            Total Capacity
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {rooms.reduce((total, room) => total + room.capacity, 0)}
          </p>
        </div>
      </div>
    </div>
  );
}
