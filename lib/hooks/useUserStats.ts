import { useMemo } from "react";
import { User } from "@/lib/types";
import { StatCard } from "@/components/shared/StatsCards";

export function useUserStats(users: User[]): StatCard[] {
  return useMemo(() => {
    const currentDate = new Date();

    return [
      {
        title: "Total Users",
        value: users.length,
        color: "text-primary",
      },
      {
        title: "Students",
        value: users.filter((user) => user.userType === "Student").length,
        color: "text-green-600",
      },
      {
        title: "New This Month",
        value: users.filter((user) => {
          if (!user.created_at) return false;
          const userDate = new Date(user.created_at);
          return (
            userDate.getMonth() === currentDate.getMonth() &&
            userDate.getFullYear() === currentDate.getFullYear()
          );
        }).length,
        color: "text-blue-600",
      },
    ];
  }, [users]);
}
