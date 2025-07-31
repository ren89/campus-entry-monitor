"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { EntryRecordService } from "@/lib/services";
import { useRFIDScanner } from "@/lib/hooks";
import { EntrySystemCard, EntryToast } from "@/components/features/entry";
import { Header, Footer } from "@/components/layout";
import { DEFAULT_USER, ROUTES } from "@/lib/constants";
import { formatRfidId } from "@/lib/utils";
import type { ToastData } from "@/lib/types";

export default function Home() {
  const router = useRouter();
  const [toastData, setToastData] = useState<ToastData | null>(null);

  const handleRFIDScan = async (rfidData: string) => {
    try {
      const formattedId = formatRfidId(rfidData);

      await EntryRecordService.create({
        name: formattedId, // Use RFID ID as the name
      });

      // Show success toast with default user data
      setToastData({
        rfidId: formattedId,
        fullName: DEFAULT_USER.fullName,
        room: DEFAULT_USER.room,
      });
    } catch (error) {
      // Show error using custom toast
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

  const handleAdminClick = () => {
    router.push(ROUTES.LOGIN);
  };

  useRFIDScanner({ onScan: handleRFIDScan });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Header onAdminClick={handleAdminClick} />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <EntrySystemCard />
        </div>

        <Footer />
      </div>

      {/* Toast Component */}
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
    </div>
  );
}
