import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function EntryLogsScreen() {
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
            <Input placeholder="Search by name or RFID..." />
          </div>
          <div className="flex items-end">
            <Button className="w-full">Apply Filters</Button>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-card-foreground">
              Recent Entries
            </h3>
            <Button variant="outline" size="sm">
              Export Logs
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 text-sm font-medium text-muted-foreground">
                    Timestamp
                  </th>
                  <th className="text-left py-3 text-sm font-medium text-muted-foreground">
                    User
                  </th>
                  <th className="text-left py-3 text-sm font-medium text-muted-foreground">
                    RFID
                  </th>
                  <th className="text-left py-3 text-sm font-medium text-muted-foreground">
                    Action
                  </th>
                  <th className="text-left py-3 text-sm font-medium text-muted-foreground">
                    Location
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="py-3 text-sm text-card-foreground">
                    2024-03-15 14:30:25
                  </td>
                  <td className="py-3 text-sm text-card-foreground">
                    John Doe
                  </td>
                  <td className="py-3 text-sm text-muted-foreground">
                    RF001234
                  </td>
                  <td className="py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Entry
                    </span>
                  </td>
                  <td className="py-3 text-sm text-muted-foreground">
                    Main Gate
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 text-sm text-card-foreground">
                    2024-03-15 14:25:18
                  </td>
                  <td className="py-3 text-sm text-card-foreground">
                    Jane Smith
                  </td>
                  <td className="py-3 text-sm text-muted-foreground">
                    RF005678
                  </td>
                  <td className="py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Exit
                    </span>
                  </td>
                  <td className="py-3 text-sm text-muted-foreground">
                    Main Gate
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 text-sm text-card-foreground">
                    2024-03-15 14:20:45
                  </td>
                  <td className="py-3 text-sm text-card-foreground">
                    Bob Johnson
                  </td>
                  <td className="py-3 text-sm text-muted-foreground">
                    RF009012
                  </td>
                  <td className="py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Entry
                    </span>
                  </td>
                  <td className="py-3 text-sm text-muted-foreground">
                    Side Gate
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 text-sm text-card-foreground">
                    2024-03-15 14:15:32
                  </td>
                  <td className="py-3 text-sm text-card-foreground">
                    Alice Wilson
                  </td>
                  <td className="py-3 text-sm text-muted-foreground">
                    RF003456
                  </td>
                  <td className="py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Entry
                    </span>
                  </td>
                  <td className="py-3 text-sm text-muted-foreground">
                    Main Gate
                  </td>
                </tr>
                <tr>
                  <td className="py-3 text-sm text-card-foreground">
                    2024-03-15 14:10:15
                  </td>
                  <td className="py-3 text-sm text-card-foreground">
                    Mike Brown
                  </td>
                  <td className="py-3 text-sm text-muted-foreground">
                    RF007890
                  </td>
                  <td className="py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Exit
                    </span>
                  </td>
                  <td className="py-3 text-sm text-muted-foreground">
                    Main Gate
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-card-foreground mb-2">
            Total Entries Today
          </h3>
          <p className="text-3xl font-bold text-green-600">89</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-card-foreground mb-2">
            Total Exits Today
          </h3>
          <p className="text-3xl font-bold text-red-600">53</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-card-foreground mb-2">
            Currently Inside
          </h3>
          <p className="text-3xl font-bold text-blue-600">36</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-card-foreground mb-2">
            Peak Time
          </h3>
          <p className="text-xl font-bold text-purple-600">8:30 AM</p>
        </div>
      </div>
    </div>
  );
}
