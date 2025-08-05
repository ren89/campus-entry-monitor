"use client";

import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push(ROUTES.HOME);
        return;
      }

      setUser(user);
      setLoading(false);
    };

    getUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session?.user) {
        router.push(ROUTES.HOME);
        return;
      }
      setUser(session.user);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-blue-800 font-medium">
            Loading STI Portal...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="bg-white rounded-lg shadow-xl p-8 border-t-4 border-blue-600">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-blue-900 mb-2">
              Admin Dashboard
            </h2>
            <p className="text-blue-600">STI College Security Management</p>
          </div>

          {/* TODO: use Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
              <span className="w-5 h-5 bg-blue-600 rounded-full mr-2"></span>
              Administrator Information
            </h3>
            <div className="space-y-2 text-sm">
              <p className="text-blue-800">
                <strong className="font-medium">Email:</strong> {user.email}
              </p>
              {user.user_metadata?.name && (
                <p className="text-blue-800">
                  <strong className="font-medium">Name:</strong>{" "}
                  {user.user_metadata.name}
                </p>
              )}
              <p className="text-blue-800">
                <strong className="font-medium">User ID:</strong> {user.id}
              </p>
              <p className="text-blue-800">
                <strong className="font-medium">Last login:</strong>{" "}
                {new Date(user.last_sign_in_at || "").toLocaleString()}
              </p>
            </div>
          </div>

          {/* TODO: make dynamic Cards*/}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-900 mb-2">Entry Logs</h4>
              <p className="text-sm text-blue-600 mb-3">
                View campus entry records
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                View Logs
              </Button>
            </div>

            <div className="bg-white border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-900 mb-2">
                User Management
              </h4>
              <p className="text-sm text-blue-600 mb-3">Manage system users</p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Manage Users
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
