import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/shared";
import { Room } from "@/lib/types";
import { useAssignedRoom } from "@/lib/hooks";
import { toast } from "sonner";

interface RoomAssignmentProps {
  rooms: Room[];
}

export function RoomAssignment({ rooms }: RoomAssignmentProps) {
  const [selectedRoomForAssignment, setSelectedRoomForAssignment] =
    useState<string>("");
  const [showRoomSelector, setShowRoomSelector] = useState<boolean>(false);

  const { assignedRoom, assignRoom } = useAssignedRoom();

  const handleAssignRoom = () => {
    if (selectedRoomForAssignment) {
      assignRoom(selectedRoomForAssignment);
      toast.success(
        `Room "${selectedRoomForAssignment}" assigned to this browser!`
      );
      setSelectedRoomForAssignment("");
      setShowRoomSelector(false);
    }
  };

  const handleChangeRoom = () => {
    setShowRoomSelector(true);
    setSelectedRoomForAssignment("");
  };

  const handleCancelChange = () => {
    setShowRoomSelector(false);
    setSelectedRoomForAssignment("");
  };

  const roomOptions = rooms.map((room) => ({
    value: room.location,
    label: room.location,
  }));

  return (
    <div className="bg-card border rounded-lg p-6 mb-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Room Assignment
      </h2>
      <p className="text-muted-foreground text-sm mb-4">
        Assign a specific room to this browser. This will be saved locally and
        used for entry monitoring.
      </p>

      {assignedRoom ? (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                Currently assigned room:
              </p>
              <p className="font-medium text-foreground">{assignedRoom}</p>
            </div>
            {!showRoomSelector && (
              <Button
                variant="outline"
                onClick={handleChangeRoom}
                className="shrink-0"
              >
                Change Room
              </Button>
            )}
          </div>

          {showRoomSelector && (
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Select
                  value={selectedRoomForAssignment}
                  onValueChange={setSelectedRoomForAssignment}
                  placeholder="Select a new room..."
                  options={roomOptions}
                />
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  onClick={handleAssignRoom}
                  disabled={!selectedRoomForAssignment}
                >
                  Change Room
                </Button>
                <Button variant="outline" onClick={handleCancelChange}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Select
              value={selectedRoomForAssignment}
              onValueChange={setSelectedRoomForAssignment}
              placeholder="Select a room to assign..."
              options={roomOptions}
            />
          </div>
          <Button
            onClick={handleAssignRoom}
            disabled={!selectedRoomForAssignment}
            className="shrink-0"
          >
            Assign Room
          </Button>
        </div>
      )}
    </div>
  );
}
