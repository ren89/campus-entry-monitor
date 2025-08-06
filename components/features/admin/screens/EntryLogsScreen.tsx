import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table } from "@/components/shared/Table";
import { StatsCards } from "@/components/shared/StatsCards";
import { useEntryStats } from "@/lib/hooks";
import { EntryRecordService } from "@/lib/services/entryRecordsService";
import type { EntryRecord } from "@/lib/types";

export function EntryLogsScreen() {
  const [entryLogs, setEntryLogs] = useState<EntryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");

  const entryStatsCards = useEntryStats(entryLogs);

  console.log("EntryLogsScreen rendered", entryLogs);
  useEffect(() => {
    const fetchEntryLogs = async () => {
      try {
        setLoading(true);
        const logs = await EntryRecordService.getAll();
        setEntryLogs(logs);
      } catch (error) {
        console.error("Error fetching entry logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntryLogs();
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Date Range
            </label>
            <Input type="date" />
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
              data={entryLogs}
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
