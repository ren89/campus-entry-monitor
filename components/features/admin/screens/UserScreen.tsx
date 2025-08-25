import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, Modal, StatsCards } from "@/components/shared";
import { User } from "@/lib/types";
import { UserService } from "@/lib/services";
import { useStats } from "@/lib/hooks";
import { UserForm } from "../UserForm";
import { UserFormData } from "@/lib/validations/user";
import { toast } from "sonner";
import { UserDetails } from "../UserDetails";

export function UserScreen() {
  const [searchFilter, setSearchFilter] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetails, setIsDetails] = useState(false);

  const userStats = useStats({ users, type: "users" });

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await UserService.getAll();
      setUsers(users);
    };

    fetchUsers();
  }, []);

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setIsDetails(false);
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsDetails(false);
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleUserSubmit = async (userData: UserFormData) => {
    setIsLoading(true);
    try {
      if (selectedUser) {
        // Update existing user
        await UserService.update(selectedUser.id!, userData);
        toast.success("User updated successfully!");
        console.log("User updated successfully");
      } else {
        // Create new user
        await UserService.create(userData);
        toast.success("User created successfully!");
        console.log("User created successfully");
      }

      // Refresh users list
      const updatedUsers = await UserService.getAll();
      setUsers(updatedUsers);

      handleModalClose();
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error("Error saving user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewUser = (user: User) => {
    setIsDetails(true);
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          User Management
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage users and their details
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
        <Button onClick={handleAddUser}>Add New User</Button>
      </div>

      <Table
        data={users}
        onRowClick={handleEditUser}
        globalFilter={searchFilter}
        onGlobalFilterChange={setSearchFilter}
        onActionClick={handleViewUser}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={
          isDetails
            ? "User Details"
            : selectedUser
            ? "Edit User"
            : "Add New User"
        }
        subtitle={
          isDetails
            ? "View user information"
            : selectedUser
            ? "Update user information"
            : "Create a new user account"
        }
      >
        {isDetails ? (
          <UserDetails user={selectedUser || undefined} />
        ) : (
          <UserForm
            user={selectedUser || undefined}
            onSubmit={handleUserSubmit}
            onCancel={handleModalClose}
            isLoading={isLoading}
          />
        )}
      </Modal>

      <StatsCards cards={userStats} />
    </div>
  );
}
