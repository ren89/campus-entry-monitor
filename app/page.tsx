"use client";
import { useState } from "react";
import { EntryRecordService } from "@/lib/services";
import { useAssignedRoom, useRFIDScanner } from "@/lib/hooks";
import { EntrySystemCard, EntryToast } from "@/components/features/entry";
import { formatRfidId } from "@/lib/utils";
import type { ToastData } from "@/lib/types";

export default function Home() {
  const [toastData, setToastData] = useState<ToastData | null>(null);
  const { assignedRoom } = useAssignedRoom();

  const handleRFIDScan = async (rfidData: string) => {
    try {
      const formattedId = formatRfidId(rfidData);

      const res = await EntryRecordService.create(
        formattedId,
        assignedRoom ?? "Main Entrance"
      );

      if (!res) {
        setToastData({
          rfidId: formattedId,
          isError: true,
          errorMessage: "User not found or entry could not be recorded.",
        });
        return;
      }

      setToastData({
        rfidId: formattedId,
        fullName: res?.name,
        room: res?.location,
      });
    } catch (error) {
      setToastData({
        rfidId: formatRfidId(rfidData),
        isError: true,
        errorMessage: `Failed to record entry. Please try again. ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
    }
  };

  const handleToastClose = () => {
    setToastData(null);
  };

  useRFIDScanner({ onScan: handleRFIDScan });

  return (
    <>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <EntrySystemCard />
        </div>
      </div>

      <EntryToast
        isVisible={!!toastData}
        rfidId={toastData?.rfidId || ""}
        fullName={toastData?.fullName}
        room={toastData?.room}
        avatarUrl={toastData?.avatarUrl || undefined}
        isError={toastData?.isError}
        errorMessage={toastData?.errorMessage}
        onClose={handleToastClose}
      />
    </>
  );
}
