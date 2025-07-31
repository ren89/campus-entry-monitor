"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EntryRecord } from "@/lib/types/database";
import { EntryRecordService } from "@/lib/services";

export default function Home() {
  const router = useRouter();
  const [EntryRecords, setEntryRecords] = useState<EntryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntryRecords = async () => {
      try {
        const logs = await EntryRecordService.getAll();
        setEntryRecords(logs);
      } catch (error) {
        console.error("Error fetching entry logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntryRecords();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleAddEntry = () => {
    EntryRecordService.create({
      name: "New Entry",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white shadow-sm border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">STI</span>
              </div>
              <h1 className="text-xl font-bold text-blue-900">
                Campus Entry Monitor
              </h1>
            </div>
            <Button
              onClick={() => router.push("/login")}
              className="py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Admin Login
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Entry Logs</h2>
            <p className="text-blue-100 text-sm">Recent campus entry records</p>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-blue-800">Loading entry logs...</span>
            </div>
          )}

          {!loading && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entry Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {EntryRecords.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        No entry logs found
                      </td>
                    </tr>
                  ) : (
                    EntryRecords.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {log.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {log.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(log.created_at)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Total entries: {EntryRecords.length}
            </p>
          </div>
        </div>
        <Button onClick={handleAddEntry}>Add</Button>
        <div className="text-center mt-8">
          <p className="text-xs text-blue-600">
            © 2025 STI College. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
