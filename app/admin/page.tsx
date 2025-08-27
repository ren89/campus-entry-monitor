"use client";

import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import AdminNav from "@/components/features/admin/AdminNav";
import { SCREENS } from "@/lib/constants/adminScreens";
import {
  DashboardScreen,
  UserScreen,
  EntryLogsScreen,
  RoomManagementScreen,
} from "@/components/features/admin/screens";

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [activeScreen, setActiveScreen] = useState<string>(SCREENS.dashboard);
  const supabase = createClient();
  const router = useRouter();

  const navItems = [
    { label: "Dashboard", screen: SCREENS.dashboard },
    { label: "Users", screen: SCREENS.user },
    { label: "Room Management", screen: SCREENS.roomManagement },
    { label: "Logs", screen: SCREENS.entryLogs },
  ];

  useEffect(() => {
    const checkAdminAccess = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push(ROUTES.HOME);
        return;
      }

      // Check if user is admin in the database
      const { data: userData, error } = await supabase
        .from("users")
        .select("user_type")
        .eq("email", user.email)
        .single();

      if (error || !userData || userData.user_type !== "Admin") {
        console.warn(
          "Non-admin user attempted to access admin panel:",
          user.email
        );
        router.push(ROUTES.DASHBOARD);
        return;
      }

      setUser(user);
      setIsAdmin(true);
      setLoading(false);
    };

    checkAdminAccess();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session?.user) {
        router.push(ROUTES.HOME);
        return;
      }

      // Re-check admin status when auth state changes
      checkAdminAccess();
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth, router]);

  const renderScreen = () => {
    switch (activeScreen) {
      case SCREENS.dashboard:
        return <DashboardScreen />;
      case SCREENS.user:
        return <UserScreen />;
      case SCREENS.entryLogs:
        return <EntryLogsScreen />;
      case SCREENS.roomManagement:
        return <RoomManagementScreen />;
      default:
        return <DashboardScreen />;
    }
  };

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

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <>
      <AdminNav
        navItems={navItems}
        activeScreen={activeScreen}
        onScreenChange={setActiveScreen}
      />
      <div className="min-h-screen bg-background">
        <div className="p-4 lg:p-8 pt-16 lg:pt-8">
          <div className="max-w-7xl mx-auto">{renderScreen()}</div>
        </div>
      </div>
    </>
  );
}
