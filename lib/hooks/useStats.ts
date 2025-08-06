import { useMemo } from "react";
import { User, EntryRecord } from "@/lib/types";
import { StatCard } from "@/components/shared/StatsCards";

export interface UseStatsParams {
  users?: User[];
  entryRecords?: EntryRecord[];
  type: "users" | "entries";
}

export function useStats({
  users,
  entryRecords,
  type,
}: UseStatsParams): StatCard[] {
  return useMemo(() => {
    if (type === "users" && users) {
      return getUserStats(users);
    }

    if (type === "entries" && entryRecords) {
      return getEntryStats(entryRecords);
    }

    return [];
  }, [users, entryRecords, type]);
}

function getUserStats(users: User[]): StatCard[] {
  const currentDate = new Date();

  return [
    {
      title: "Total Users",
      value: users.length,
      color: "text-primary",
    },
    {
      title: "Students",
      value: users.filter((user) => user.userType === "Student").length,
      color: "text-green-600",
    },
    {
      title: "New This Month",
      value: users.filter((user) => {
        if (!user.created_at) return false;
        const userDate = new Date(user.created_at);
        return (
          userDate.getMonth() === currentDate.getMonth() &&
          userDate.getFullYear() === currentDate.getFullYear()
        );
      }).length,
      color: "text-blue-600",
    },
  ];
}

function getEntryStats(entryRecords: EntryRecord[]): StatCard[] {
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Filter records for today and "Default Location"
  const todayRecords = entryRecords.filter((record) => {
    const recordDate = new Date(record.created_at || "")
      .toISOString()
      .split("T")[0];
    return recordDate === today && record.location === "Default Location";
  });

  // Calculate stats
  const entries = todayRecords.filter((record) => record.action === "Entry");
  const exits = todayRecords.filter((record) => record.action === "Exit");

  // Calculate currently inside (entries - exits for Default Location)
  const currentlyInside = Math.max(0, entries.length - exits.length);

  // Calculate peak time (hour with most entries)
  const peakTime = calculatePeakTime(entries);

  return [
    {
      title: "Total Entries Today",
      value: entries.length,
      color: "text-green-600",
    },
    {
      title: "Total Exits Today",
      value: exits.length,
      color: "text-red-600",
    },
    {
      title: "Currently Inside",
      value: currentlyInside,
      color: "text-blue-600",
    },
    {
      title: "Peak Time",
      value: peakTime,
      color: "text-purple-600",
    },
  ];
}

function calculatePeakTime(entries: EntryRecord[]): string {
  if (entries.length === 0) return "N/A";

  // Count entries by hour
  const hourCounts: { [hour: string]: number } = {};

  entries.forEach((entry) => {
    if (entry.created_at) {
      const hour = new Date(entry.created_at).getHours();
      const hourStr = `${hour}:00`;
      hourCounts[hourStr] = (hourCounts[hourStr] || 0) + 1;
    }
  });

  // Find hour with most entries
  let maxCount = 0;
  let peakHour = "N/A";

  Object.entries(hourCounts).forEach(([hour, count]) => {
    if (count > maxCount) {
      maxCount = count;
      peakHour = hour;
    }
  });

  // Format peak hour (e.g., "8:00" becomes "8:00 AM")
  if (peakHour !== "N/A") {
    const hour = parseInt(peakHour.split(":")[0]);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${ampm}`;
  }

  return peakHour;
}
