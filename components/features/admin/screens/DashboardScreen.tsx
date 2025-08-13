import React, { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RecentEntryRow } from "@/lib/types";
import { EntryRecordService } from "@/lib/services";
import RecentEntries from "../RecentEntries";
import { timeAgo } from "@/lib/utils";

export function DashboardScreen() {
  const [logs, setLogs] = useState<RecentEntryRow[]>([]);

  useEffect(() => {
    const fetchRecentEntries = async () => {
      const recentEntries = await EntryRecordService.getRecentEntries();
      setLogs(recentEntries);
    };

    fetchRecentEntries();
  }, []);

  console.log("Recent Logs:", logs);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Overview of your campus entry monitoring system
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-card-foreground mb-2">
            Total Entries
          </h3>
          <p className="text-3xl font-bold text-primary">142</p>
          <p className="text-sm text-muted-foreground mt-1">
            +12% from yesterday
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-card-foreground mb-2">
            Active Users
          </h3>
          <p className="text-3xl font-bold text-primary">28</p>
          <p className="text-sm text-muted-foreground mt-1">
            Currently on campus
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-card-foreground mb-2">
            System Status
          </h3>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <p className="text-lg font-medium text-card-foreground">Online</p>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            All systems operational
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            {/* TODO: Add recent activity chart */}
            Recent Activity
          </h3>
          <div className="space-y-3">
            {logs.map((log) => (
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-card-foreground">
                  {log.name} {log.action === "Entry" ? "entered" : "exited"}{" "}
                  {log.location}
                </span>
                <span className="text-xs text-muted-foreground">
                  {timeAgo(log.created_at)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              📊 View Reports
            </Button>
            <Button className="w-full justify-start" variant="outline">
              👥 Manage Users
            </Button>
            <Button className="w-full justify-start" variant="outline">
              ⚙️ System Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
