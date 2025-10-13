"use client";

import { useState } from "react";
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
  Users,
} from "lucide-react";

// Types
type Role = "Super Admin" | "Admin" | "Editor";

interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: "Active" | "Inactive";
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
  status: "Active" | "Inactive";
}

// Sample Data
const usersData: User[] = [
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

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role | "all">("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(usersData);
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

  const roles: Role[] = ["Super Admin", "Admin", "Editor"];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getDefaultPermissions = (role: Role) => {
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
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert("Please fill all required fields");
      return;
    }

    const user: User = {
      id: users.length + 1,
      ...newUser,
      status: "Active",
      lastLogin: "Never",
      createdDate: new Date().toISOString().split("T")[0],
      permissions: getDefaultPermissions(newUser.role),
    };
    setUsers([...users, user]);
    setNewUser({ name: "", email: "", role: "Editor", password: "" });
    setIsAddDialogOpen(false);
  };

  const handleEditUser = (user: User) => {
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
    if (!selectedUser || !editUser.name || !editUser.email) {
      alert("Please fill all required fields");
      return;
    }

    setUsers(
      users.map((user) =>
        user.id === selectedUser.id
          ? {
              ...user,
              name: editUser.name,
              email: editUser.email,
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

  const handleDeleteUser = (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  const handleAssignRole = (user: User) => {
    setSelectedUser(user);
    setIsRoleDialogOpen(true);
  };

  const handleResetPassword = (user: User) => {
    setSelectedUser(user);
    setIsResetPasswordOpen(true);
  };

  const handleUpdateRole = (newRole: Role) => {
    if (!selectedUser) return;
    setUsers(
      users.map((user) =>
        user.id === selectedUser.id
          ? { ...user, role: newRole, permissions: getDefaultPermissions(newRole) }
          : user
      )
    );
    setIsRoleDialogOpen(false);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage admin and staff user accounts</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="sm:w-auto w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Users Table */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>User Directory</CardTitle>
          <CardDescription>Manage user accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter by role */}
            <Select
              value={selectedRole}
              onValueChange={(value) => setSelectedRole(value as Role | "all")}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map((role) => (
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
                    <TableHead className="min-w-[150px]">User</TableHead>
                    <TableHead className="min-w-[100px]">Role</TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="min-w-[120px]">Last Login</TableHead>
                    <TableHead className="min-w-[150px]">Permissions</TableHead>
                    <TableHead className="min-w-[200px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm sm:text-base">{user.name}</p>
                          <p className="text-xs sm:text-sm text-gray-500 break-all">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.role === "Super Admin"
                              ? "destructive"
                              : user.role === "Admin"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.status === "Active" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1 text-xs sm:text-sm">
                          <Calendar className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">
                            {user.lastLogin === "Never"
                              ? "Never"
                              : new Date(user.lastLogin).toLocaleDateString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.permissions.slice(0, 2).map((permission, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
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
                      <TableCell>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAssignRole(user)}
                            className="h-8 w-8 p-0"
                          >
                            <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleResetPassword(user)}
                            className="h-8 w-8 p-0"
                          >
                            <Key className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-w-[95vw]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account with appropriate permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="add-name" className="sm:text-right">
                Name
              </Label>
              <Input
                id="add-name"
                className="sm:col-span-3"
                placeholder="Full name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="add-email" className="sm:text-right">
                Email
              </Label>
              <Input
                id="add-email"
                type="email"
                className="sm:col-span-3"
                placeholder="Email address"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="add-role" className="sm:text-right">
                Role
              </Label>
              <Select
                value={newUser.role}
                onValueChange={(value) =>
                  setNewUser({ ...newUser, role: value as Role })
                }
              >
                <SelectTrigger className="sm:col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="add-password" className="sm:text-right">
                Password
              </Label>
              <Input
                id="add-password"
                type="password"
                className="sm:col-span-3"
                placeholder="Temporary password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser}>Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-w-[95vw]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information for "{selectedUser?.name}"
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="sm:text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                className="sm:col-span-3"
                placeholder="Full name"
                value={editUser.name}
                onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="sm:text-right">
                Email
              </Label>
              <Input
                id="edit-email"
                type="email"
                className="sm:col-span-3"
                placeholder="Email address"
                value={editUser.email}
                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-role" className="sm:text-right">
                Role
              </Label>
              <Select
                value={editUser.role}
                onValueChange={(value) =>
                  setEditUser({ ...editUser, role: value as Role })
                }
              >
                <SelectTrigger className="sm:col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="sm:text-right">
                Status
              </Label>
              <Select
                value={editUser.status}
                onValueChange={(value) =>
                  setEditUser({ ...editUser, status: value as "Active" | "Inactive" })
                }
              >
                <SelectTrigger className="sm:col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUser}>Update User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Role Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="sm:max-w-[400px] max-w-[95vw]">
          <DialogHeader>
            <DialogTitle>Assign Role</DialogTitle>
            <DialogDescription>
              Change the role for "{selectedUser?.name}"
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="role-select" className="sm:text-right">
                Role
              </Label>
              <Select
                value={selectedUser?.role || roles[0]}
                onValueChange={(value) => handleUpdateRole(value as Role)}
              >
                <SelectTrigger className="sm:col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={isResetPasswordOpen} onOpenChange={setIsResetPasswordOpen}>
        <DialogContent className="sm:max-w-[400px] max-w-[95vw]">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Reset password for "{selectedUser?.name}"
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <p className="text-sm text-gray-600">
              New password will be sent to the user's email.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsResetPasswordOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                alert(`Password reset for ${selectedUser?.email}`);
                setIsResetPasswordOpen(false);
              }}
            >
              Reset Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}