"use client";

import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { Table } from "@/components/shared";
import { EntryRecordService, UserService } from "@/lib/services";
import { EntryRecord, User as AppUser } from "@/lib/types";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<AppUser | null>(null);
  const [entryLogs, setEntryLogs] = useState<Partial<EntryRecord>[]>([]);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push(ROUTES.HOME);
        return;
      }

      setUser(user);

      // Load user details
      const currentUser = await UserService.getUserByEmail(user.email!);
      if (currentUser) {
        setUserDetails(currentUser);

        // Load entry logs
        const logs = await EntryRecordService.getById(currentUser.id!);
        setEntryLogs(logs);
      }
    };

    loadData();
  }, [supabase.auth, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push(ROUTES.HOME);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-800">STI Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.email}</span>
              <button
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* User Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              User Details
            </h2>
            {userDetails ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <p className="text-lg text-gray-900">
                      {userDetails.firstName} {userDetails.lastName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <p className="text-lg text-gray-900">{userDetails.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      User Type
                    </label>
                    <p className="text-lg text-gray-900">
                      {userDetails.userType}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <p className="text-lg text-gray-900">
                      {userDetails.phoneNumber}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Guardian Phone Number
                    </label>
                    <p className="text-lg text-gray-900">
                      {userDetails.guardianPhoneNumber}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      RFID
                    </label>
                    <p className="text-lg text-gray-900 font-mono">
                      {userDetails.rfid}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">No user details found.</p>
            )}
          </div>

          {/* Entry Logs */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Entry Logs
            </h2>
            {entryLogs.length > 0 ? (
              <Table
                data={entryLogs.map((log) => ({
                  created_at: log.created_at,
                  action: log.action,
                  location: log.location,
                }))}
              />
            ) : (
              <p className="text-gray-600">No entry logs found.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
