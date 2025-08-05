import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table } from "@/components/shared";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
}

const users: User[] = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    userType: "staff",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    userType: "student",
  },
];

export function UserScreen() {
  const [searchFilter, setSearchFilter] = useState("");

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          User Management
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage users and their access permissions
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search users by name, email, or type..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full"
          />
        </div>
        <Button>Add New User</Button>
      </div>

      <Table
        data={users}
        onRowClick={(user) => console.log("Clicked user:", user)}
        globalFilter={searchFilter}
        onGlobalFilterChange={setSearchFilter}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-card-foreground mb-2">
            Total Users
          </h3>
          <p className="text-3xl font-bold text-primary">156</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-card-foreground mb-2">
            Active Users
          </h3>
          <p className="text-3xl font-bold text-green-600">142</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-card-foreground mb-2">
            New This Month
          </h3>
          <p className="text-3xl font-bold text-blue-600">12</p>
        </div>
      </div>
    </div>
  );
}
