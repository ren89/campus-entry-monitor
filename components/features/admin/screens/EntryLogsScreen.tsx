import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Table } from "@/components/shared/Table";
import { StatsCards } from "@/components/shared/StatsCards";
import { Select } from "@/components/shared/Select";
import { useEntryStats } from "@/lib/hooks";
import { EntryRecordService } from "@/lib/services/entryRecordsService";
import { RoomService } from "@/lib/services/roomService";
import type { EntryRecord, Room } from "@/lib/types";

export function EntryLogsScreen() {
  const [entryLogs, setEntryLogs] = useState<EntryRecord[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<EntryRecord[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");

  const entryStatsCards = useEntryStats(entryLogs);

  const parseLocalDateTime = (dateTimeString: string): Date => {
    const date = new Date(dateTimeString);
    return date;
  };

  useEffect(() => {
    let filtered = [...entryLogs];

    if (dateFrom) {
      const fromDate = parseLocalDateTime(dateFrom);
      filtered = filtered.filter((log) => {
        if (!log.created_at) return false;
        const logDate = new Date(log.created_at);
        return logDate.getTime() >= fromDate.getTime();
      });
    }

    if (dateTo) {
      const toDate = parseLocalDateTime(dateTo);
      filtered = filtered.filter((log) => {
        if (!log.created_at) return false;
        const logDate = new Date(log.created_at);
        return logDate.getTime() <= toDate.getTime();
      });
    }

    if (selectedLocation && selectedLocation !== "all") {
      filtered = filtered.filter((log) => log.location === selectedLocation);
    }

    setFilteredLogs(filtered);
  }, [entryLogs, dateFrom, dateTo, selectedLocation]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [logs, roomsData] = await Promise.all([
          EntryRecordService.getAll(),
          RoomService.getAll(),
        ]);
        setEntryLogs(logs);
        setRooms(roomsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Entry Logs
        </h1>
        <p className="text-muted-foreground mt-2">
          View and monitor all campus entry and exit activities
        </p>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          Filters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              From Date
            </label>
            <Input
              type="datetime-local"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              To Date
            </label>
            <Input
              type="datetime-local"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Location
            </label>
            <Select
              placeholder="All locations"
              value={selectedLocation}
              onValueChange={setSelectedLocation}
              options={[
                { value: "all", label: "All locations" },
                ...rooms.map((room) => ({
                  value: room.location,
                  label: room.location,
                })),
              ]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              User Search
            </label>
            <Input
              placeholder="Search by name or RFID..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setDateFrom("");
                setDateTo("");
                setSelectedLocation("all");
                setGlobalFilter("");
              }}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-card-foreground">
              Recent Entries
            </h3>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-muted-foreground">Loading entry logs...</p>
            </div>
          ) : (
            <Table
              data={filteredLogs}
              globalFilter={globalFilter}
              onGlobalFilterChange={setGlobalFilter}
            />
          )}
        </div>
      </div>

      <StatsCards cards={entryStatsCards} columns={4} />
    </div>
  );
}
