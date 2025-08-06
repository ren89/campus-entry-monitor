import { useMemo } from "react";
import type { EntryRecord } from "@/lib/types";
import { StatCard } from "@/components/shared/StatsCards";

export function useEntryStats(entryLogs: EntryRecord[]): StatCard[] {
  return useMemo(() => {
    const today = new Date().toISOString().split("T")[0];

    const todayRecords = entryLogs.filter((record) => {
      const recordDate = new Date(record.created_at || "")
        .toISOString()
        .split("T")[0];
      return recordDate === today && record.location === "Main Entrance";
    });

    const entries = todayRecords.filter((record) => record.action === "Entry");
    const exits = todayRecords.filter((record) => record.action === "Exit");

    const currentlyInside = entries.length - exits.length;
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
        value: Math.max(0, currentlyInside),
        color: "text-blue-600",
      },
      {
        title: "Peak Time",
        value: peakTime,
        color: "text-purple-600",
      },
    ];
  }, [entryLogs]);
}

function calculatePeakTime(entries: EntryRecord[]): string {
  if (entries.length === 0) return "N/A";

  const hourCounts: { [hour: string]: number } = {};

  entries.forEach((entry) => {
    if (entry.created_at) {
      const hour = new Date(entry.created_at).getHours();
      const hourStr = `${hour}:00`;
      hourCounts[hourStr] = (hourCounts[hourStr] || 0) + 1;
    }
  });

  let maxCount = 0;
  let peakHour = "N/A";

  Object.entries(hourCounts).forEach(([hour, count]) => {
    if (count > maxCount) {
      maxCount = count;
      peakHour = hour;
    }
  });

  if (peakHour !== "N/A") {
    const hour = parseInt(peakHour.split(":")[0]);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${ampm}`;
  }

  return peakHour;
}
