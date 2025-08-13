import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "../Calendar";

export function DashboardScreen() {
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
            Total Entries Today
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
            Recent Activity
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-card-foreground">
                Student A entered
              </span>
              <span className="text-xs text-muted-foreground">2 min ago</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-card-foreground">
                Student B exited
              </span>
              <span className="text-xs text-muted-foreground">5 min ago</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-card-foreground">
                Student C entered
              </span>
              <span className="text-xs text-muted-foreground">8 min ago</span>
            </div>
          </div>
        </div>

        <Calendar />
      </div>
    </div>
  );
}
