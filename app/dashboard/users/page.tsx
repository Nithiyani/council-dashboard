"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UserCog,
  Plus,
  Edit,
  Trash2,
  Search,
  Shield,
  Key,
  Calendar,
} from "lucide-react";

/* -------------------------
   Types
------------------------- */
type Role = "Super Admin" | "Admin" | "Editor";
type Status = "Active" | "Inactive";

interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: Status;
  lastLogin: string;
  createdDate: string;
  permissions: string[];
}

interface NewUser {
  name: string;
  email: string;
  role: Role;
  password: string;
}

interface EditUser {
  name: string;
  email: string;
  role: Role;
  status: Status;
}

/* -------------------------
   Sample data
------------------------- */
const initialUsersData: User[] = [
  {
    id: 1,
    name: "John Admin",
    email: "admin@council.gov",
    role: "Super Admin",
    status: "Active",
    lastLogin: "2024-12-20",
    createdDate: "2022-01-15",
    permissions: ["All Access"],
  },
  {
    id: 2,
    name: "Sarah Manager",
    email: "sarah.manager@council.gov",
    role: "Admin",
    status: "Active",
    lastLogin: "2024-12-19",
    createdDate: "2022-03-10",
    permissions: ["Events", "Notices", "Members"],
  },
  {
    id: 3,
    name: "Mike Editor",
    email: "mike.editor@council.gov",
    role: "Editor",
    status: "Active",
    lastLogin: "2024-12-18",
    createdDate: "2023-06-20",
    permissions: ["Events", "Gallery", "Documents"],
  },
  {
    id: 4,
    name: "Lisa Viewer",
    email: "lisa.viewer@council.gov",
    role: "Editor",
    status: "Inactive",
    lastLogin: "2024-12-10",
    createdDate: "2023-08-12",
    permissions: ["View Only"],
  },
  {
    id: 5,
    name: "David Staff",
    email: "david.staff@council.gov",
    role: "Admin",
    status: "Active",
    lastLogin: "2024-12-20",
    createdDate: "2024-01-05",
    permissions: ["Notices", "Documents"],
  },
];

/* -------------------------
   Constants
------------------------- */
const ROLES: Role[] = ["Super Admin", "Admin", "Editor"];

/* -------------------------
   Component
------------------------- */
export default function UsersPage() {
  // simulate logged-in user role (for demo/testing)
  const [currentUserRole, setCurrentUserRole] = useState<Role>("Super Admin");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role | "all">("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsersData);
  const [newUser, setNewUser] = useState<NewUser>({
    name: "",
    email: "",
    role: "Editor",
    password: "",
  });
  const [editUser, setEditUser] = useState<EditUser>({
    name: "",
    email: "",
    role: "Editor",
    status: "Active",
  });

  /* Filter users with useMemo for performance */
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = selectedRole === "all" || user.role === selectedRole;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, selectedRole]);

  /* Default permissions by role */
  const getDefaultPermissions = useCallback((role: Role): string[] => {
    switch (role) {
      case "Super Admin":
        return ["All Access"];
      case "Admin":
        return ["Events", "Notices", "Members"];
      case "Editor":
        return ["Events", "Gallery", "Documents"];
      default:
        return ["View Only"];
    }
  }, []);

  /* Utility: next id */
  const getNextId = useCallback(() => {
    if (users.length === 0) return 1;
    return Math.max(...users.map((u) => u.id)) + 1;
  }, [users]);

  /* RBAC helpers */
  const canCreateUser = useCallback((role: Role) => 
    role === "Super Admin" || role === "Admin", []);

  const canEditUser = useCallback((role: Role, target?: User) => {
    if (role === "Super Admin") return true;
    if (role === "Admin") return target?.role !== "Super Admin";
    return false;
  }, []);

  const canDeleteUser = useCallback((role: Role, target?: User) => {
    if (role === "Super Admin") return true;
    if (role === "Admin") return target?.role === "Editor";
    return false;
  }, []);

  const canAssignRole = useCallback((role: Role) => 
    role === "Super Admin", []);

  const canResetPassword = useCallback((role: Role, target?: User) => {
    if (role === "Super Admin") return true;
    if (role === "Admin") return target?.role !== "Super Admin";
    return false;
  }, []);

  /* Add user */
  const handleAddUser = () => {
    if (!newUser.name.trim() || !newUser.email.trim() || !newUser.password.trim()) {
      alert("Please fill all required fields");
      return;
    }
    if (!canCreateUser(currentUserRole)) {
      alert("You don't have permission to add users.");
      return;
    }

    const user: User = {
      id: getNextId(),
      name: newUser.name.trim(),
      email: newUser.email.trim(),
      role: newUser.role,
      status: "Active",
      lastLogin: "Never",
      createdDate: new Date().toISOString().split("T")[0],
      permissions: getDefaultPermissions(newUser.role),
    };

    setUsers((prev) => [...prev, user]);
    setNewUser({ name: "", email: "", role: "Editor", password: "" });
    setIsAddDialogOpen(false);
  };

  /* Edit flow */
  const handleEditUser = (user: User) => {
    if (!canEditUser(currentUserRole, user)) {
      alert("You don't have permission to edit this user.");
      return;
    }
    setSelectedUser(user);
    setEditUser({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = () => {
    if (!selectedUser || !editUser.name.trim() || !editUser.email.trim()) {
      alert("Please fill all required fields");
      return;
    }
    if (!canEditUser(currentUserRole, selectedUser)) {
      alert("You don't have permission to update this user.");
      return;
    }

    setUsers((prev) =>
      prev.map((user) =>
        user.id === selectedUser.id
          ? {
              ...user,
              name: editUser.name.trim(),
              email: editUser.email.trim(),
              role: editUser.role,
              status: editUser.status,
              permissions: getDefaultPermissions(editUser.role),
            }
          : user
      )
    );
    setIsEditDialogOpen(false);
    setSelectedUser(null);
  };

  /* Delete */
  const handleDeleteUser = (id: number) => {
    const target = users.find((u) => u.id === id);
    if (!target) return;
    if (!canDeleteUser(currentUserRole, target)) {
      alert("You don't have permission to delete this user.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  /* Assign role */
  const handleAssignRole = (user: User) => {
    if (!canAssignRole(currentUserRole)) {
      alert("You don't have permission to assign roles.");
      return;
    }
    setSelectedUser(user);
    setIsRoleDialogOpen(true);
  };

  const handleUpdateRole = useCallback((newRole: Role) => {
    if (!selectedUser) return;
    if (!canAssignRole(currentUserRole)) {
      alert("You don't have permission to assign roles.");
      return;
    }
    setUsers((prev) =>
      prev.map((user) =>
        user.id === selectedUser.id
          ? { ...user, role: newRole, permissions: getDefaultPermissions(newRole) }
          : user
      )
    );
    setIsRoleDialogOpen(false);
    setSelectedUser(null);
  }, [selectedUser, currentUserRole, canAssignRole, getDefaultPermissions]);

  /* Reset password */
  const handleResetPassword = (user: User) => {
    if (!canResetPassword(currentUserRole, user)) {
      alert("You don't have permission to reset this user's password.");
      return;
    }
    setSelectedUser(user);
    setIsResetPasswordOpen(true);
  };

  const handlePerformReset = () => {
    if (!selectedUser) return;
    alert(`Password reset for ${selectedUser.email}`);
    setIsResetPasswordOpen(false);
    setSelectedUser(null);
  };

  /* role dialog value change handler */
  const handleRoleSelect = (value: string) => {
    handleUpdateRole(value as Role);
  };

  /* Format date for display */
  const formatDate = (dateString: string) => {
    if (dateString === "Never") return "Never";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-4 gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 truncate">User Management</h1>
          <p className="text-gray-600 truncate">Manage admin and staff user accounts</p>
        </div>

        {/* Current user role selector (demo) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Label htmlFor="current-role" className="whitespace-nowrap text-sm sm:text-base">
              Current User
            </Label>
            <Select
              value={currentUserRole}
              onValueChange={(v) => setCurrentUserRole(v as Role)}
            >
              <SelectTrigger id="current-role" className="w-full sm:w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="w-full sm:w-auto mt-2 sm:mt-0"
            disabled={!canCreateUser(currentUserRole)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Users Table Card */}
      <Card className="hover:shadow-lg transition-shadow overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg sm:text-xl">User Directory</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Manage user accounts and permissions
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 p-0 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-0 sm:pb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm sm:text-base"
              />
            </div>

            <Select
              value={selectedRole}
              onValueChange={(value) => setSelectedRole(value as Role | "all")}
            >
              <SelectTrigger className="w-full sm:w-[180px] text-sm sm:text-base">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[140px] py-3">User</TableHead>
                    <TableHead className="min-w-[90px] py-3">Role</TableHead>
                    <TableHead className="min-w-[80px] py-3">Status</TableHead>
                    <TableHead className="min-w-[100px] py-3">Last Login</TableHead>
                    <TableHead className="min-w-[120px] py-3">Permissions</TableHead>
                    <TableHead className="min-w-[160px] py-3 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-gray-50 group">
                        <TableCell className="py-3">
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          </div>
                        </TableCell>

                        <TableCell className="py-3">
                          <Badge
                            variant={
                              user.role === "Super Admin"
                                ? "destructive"
                                : user.role === "Admin"
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs whitespace-nowrap"
                          >
                            {user.role}
                          </Badge>
                        </TableCell>

                        <TableCell className="py-3">
                          <Badge
                            variant={user.status === "Active" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {user.status}
                          </Badge>
                        </TableCell>

                        <TableCell className="py-3">
                          <div className="flex items-center space-x-1 text-xs">
                            <Calendar className="w-3 h-3 flex-shrink-0 text-gray-400" />
                            <span className="truncate">
                              {formatDate(user.lastLogin)}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="py-3">
                          <div className="flex flex-wrap gap-1 max-w-[120px]">
                            {user.permissions.slice(0, 2).map((permission, index) => (
                              <Badge key={index} variant="outline" className="text-xs truncate">
                                {permission}
                              </Badge>
                            ))}
                            {user.permissions.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{user.permissions.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="py-3">
                          <div className="flex justify-end gap-1 sm:gap-2">
                            {/* Edit */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditUser(user)}
                              className="h-8 w-8 p-0"
                              disabled={!canEditUser(currentUserRole, user)}
                              title={canEditUser(currentUserRole, user) ? "Edit" : "No permission"}
                            >
                              <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>

                            {/* Assign Role */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAssignRole(user)}
                              className="h-8 w-8 p-0"
                              disabled={!canAssignRole(currentUserRole)}
                              title={canAssignRole(currentUserRole) ? "Assign role" : "No permission"}
                            >
                              <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>

                            {/* Reset password */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleResetPassword(user)}
                              className="h-8 w-8 p-0"
                              disabled={!canResetPassword(currentUserRole, user)}
                              title={canResetPassword(currentUserRole, user) ? "Reset password" : "No permission"}
                            >
                              <Key className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>

                            {/* Delete */}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={!canDeleteUser(currentUserRole, user)}
                              title={canDeleteUser(currentUserRole, user) ? "Delete" : "No permission"}
                            >
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* -------------------------
          Add User Dialog
         ------------------------- */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Add New User</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Create a new user account with appropriate permissions.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-3">
              <Label htmlFor="add-name" className="text-sm sm:text-base">Name *</Label>
              <Input
                id="add-name"
                placeholder="Full name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="text-sm sm:text-base"
              />
            </div>

            <div className="grid grid-cols-1 gap-3">
              <Label htmlFor="add-email" className="text-sm sm:text-base">Email *</Label>
              <Input
                id="add-email"
                type="email"
                placeholder="Email address"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="text-sm sm:text-base"
              />
            </div>

            <div className="grid grid-cols-1 gap-3">
              <Label htmlFor="add-role" className="text-sm sm:text-base">Role</Label>
              <Select
                value={newUser.role}
                onValueChange={(value) => setNewUser({ ...newUser, role: value as Role })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <Label htmlFor="add-password" className="text-sm sm:text-base">Password *</Label>
              <Input
                id="add-password"
                type="password"
                placeholder="Temporary password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="text-sm sm:text-base"
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsAddDialogOpen(false)}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddUser} 
              disabled={!canCreateUser(currentUserRole)}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* -------------------------
          Edit User Dialog
         ------------------------- */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Edit User</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Update user information for "{selectedUser?.name}"
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-3">
              <Label htmlFor="edit-name" className="text-sm sm:text-base">Name *</Label>
              <Input
                id="edit-name"
                placeholder="Full name"
                value={editUser.name}
                onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                className="text-sm sm:text-base"
              />
            </div>

            <div className="grid grid-cols-1 gap-3">
              <Label htmlFor="edit-email" className="text-sm sm:text-base">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="Email address"
                value={editUser.email}
                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                className="text-sm sm:text-base"
              />
            </div>

            <div className="grid grid-cols-1 gap-3">
              <Label htmlFor="edit-role" className="text-sm sm:text-base">Role</Label>
              <Select
                value={editUser.role}
                onValueChange={(value) => setEditUser({ ...editUser, role: value as Role })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <Label htmlFor="edit-status" className="text-sm sm:text-base">Status</Label>
              <Select
                value={editUser.status}
                onValueChange={(value) => setEditUser({ ...editUser, status: value as Status })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateUser}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              Update User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* -------------------------
          Assign Role Dialog
         ------------------------- */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="sm:max-w-[400px] max-w-[95vw]">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Assign Role</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Change the role for "{selectedUser?.name}"
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-3">
              <Label htmlFor="role-select" className="text-sm sm:text-base">Role</Label>
              <Select value={selectedUser?.role} onValueChange={handleRoleSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsRoleDialogOpen(false)}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => handleUpdateRole(selectedUser?.role || "Editor")}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              Update Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* -------------------------
          Reset Password Dialog
         ------------------------- */}
      <Dialog open={isResetPasswordOpen} onOpenChange={setIsResetPasswordOpen}>
        <DialogContent className="sm:max-w-[400px] max-w-[95vw]">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Reset Password</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Reset password for "{selectedUser?.name}"
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <p className="text-sm text-gray-600">
              New password will be sent to the user's email.
            </p>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsResetPasswordOpen(false)}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handlePerformReset}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              Reset Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}