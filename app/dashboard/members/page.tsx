"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Edit,
  Trash,
  Plus,
  Eye,
  MoreVertical,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ✅ Member interface (profile image is base64 string)
interface Member {
  id: number;
  name: string;
  role: string;
  phone: string;
  email: string;
  enabled: boolean;
  profile: string;
}

// ✅ Initial Members
const initialMembers: Member[] = [
  {
    id: 1,
    name: "John Doe",
    role: "Member",
    phone: "+1 123-4567",
    email: "john@example.com",
    enabled: true,
    profile: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "Chairperson",
    phone: "+1 987-6543",
    email: "jane@example.com",
    enabled: false,
    profile: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: 3,
    name: "Michael Brown",
    role: "Member",
    phone: "+1 555-5555",
    email: "michael@example.com",
    enabled: true,
    profile: "https://i.pravatar.cc/150?img=3",
  },
];

export default function CouncilMemberPage() {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // Form states
  const [formName, setFormName] = useState("");
  const [formRole, setFormRole] = useState("Member");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formProfile, setFormProfile] = useState<string>("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const filteredMembers = useMemo(() => {
    return members.filter(
      (member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [members, searchTerm]);

  const paginatedMembers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredMembers.slice(start, start + itemsPerPage);
  }, [filteredMembers, currentPage]);

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

  // ✅ Handle Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormProfile(reader.result as string); // save base64 image string
    };
    reader.readAsDataURL(file);
  };

  // ✅ Toggle Enable/Disable
  const handleToggleStatus = (id: number) => {
    setMembers(
      members.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m))
    );
  };

  // Handlers
  const handleAddMember = () => {
    if (!formName || !formRole) return;
    const newMember: Member = {
      id: Date.now(),
      name: formName,
      role: formRole,
      phone: formPhone,
      email: formEmail,
      enabled: true,
      profile: formProfile || "https://i.pravatar.cc/150?img=10", // fallback
    };
    setMembers([...members, newMember]);
    resetForm();
    setIsAddOpen(false);
  };

  const handleEditMember = () => {
    if (selectedMember) {
      setMembers(
        members.map((m) =>
          m.id === selectedMember.id
            ? {
                ...m,
                name: formName,
                role: formRole,
                phone: formPhone,
                email: formEmail,
                profile: formProfile || m.profile,
              }
            : m
        )
      );
      setIsEditOpen(false);
    }
  };

  const handleDeleteMember = (id: number) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  const openEditModal = (member: Member) => {
    setSelectedMember(member);
    setFormName(member.name);
    setFormRole(member.role);
    setFormPhone(member.phone);
    setFormEmail(member.email);
    setFormProfile(member.profile);
    setIsEditOpen(true);
  };

  const openViewModal = (member: Member) => {
    setSelectedMember(member);
    setIsViewOpen(true);
  };

  const resetForm = () => {
    setFormName("");
    setFormRole("Member");
    setFormPhone("");
    setFormEmail("");
    setFormProfile("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Council Members</h1>
          <p className="text-gray-600">
            Manage council members, roles and contacts
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <Input
                placeholder="Name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
              <Select value={formRole} onValueChange={(val) => setFormRole(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Member">Member</SelectItem>
                  <SelectItem value="Chairperson">Chairperson</SelectItem>
                  <SelectItem value="Secretary">Secretary</SelectItem>
                  <SelectItem value="Assistant Secretary (Admin II)">
                    Assistant Secretary (Admin II)
                  </SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Phone"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
              />
              <Input
                placeholder="Email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
              />

              {/* Image Upload */}
              <div>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
                {formProfile && (
                  <img
                    src={formProfile}
                    alt="Preview"
                    className="w-16 h-16 rounded-full object-cover mt-2"
                  />
                )}
              </div>
            </div>
            <DialogFooter className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddMember}>Add</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Input
        placeholder="Search by name or role..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Member List */}
      <Card>
        <CardHeader>
          <CardTitle>Member List</CardTitle>
          <CardDescription>
            All council members with their roles and contacts
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Profile</th>
                <th className="border px-4 py-2 text-left">Name</th>
                <th className="border px-4 py-2 text-left">Role</th>
                <th className="border px-4 py-2 text-left">Phone</th>
                <th className="border px-4 py-2 text-left">Email</th>
                <th className="border px-4 py-2 text-left">Status</th>
                <th className="border px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMembers.map((member) => (
                <tr key={member.id}>
                  <td className="border px-4 py-2">
                    <img
                      src={member.profile}
                      alt={member.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="border px-4 py-2">{member.name}</td>
                  <td className="border px-4 py-2">{member.role}</td>
                  <td className="border px-4 py-2">{member.phone}</td>
                  <td className="border px-4 py-2">{member.email}</td>
                  <td className="border px-4 py-2">
                    {member.enabled ? (
                      <span className="text-green-600 font-medium">Enabled</span>
                    ) : (
                      <span className="text-gray-500">Disabled</span>
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => openViewModal(member)}>
                          <Eye className="w-4 h-4 mr-2" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditModal(member)}>
                          <Edit className="w-4 h-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(member.id)}
                        >
                          {member.enabled ? (
                            <>
                              <ToggleLeft className="w-4 h-4 mr-2" /> Disable
                            </>
                          ) : (
                            <>
                              <ToggleRight className="w-4 h-4 mr-2" /> Enable
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteMember(member.id)}
                          className="text-red-600"
                        >
                          <Trash className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-end space-x-2 mt-3">
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </Button>
            <span className="px-3 py-1">
              {currentPage} / {totalPages}
            </span>
            <Button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* View Modal */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>View Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <img
              src={selectedMember?.profile}
              alt={selectedMember?.name}
              className="w-20 h-20 rounded-full object-cover mx-auto"
            />
            <p>
              <strong>Name:</strong> {selectedMember?.name}
            </p>
            <p>
              <strong>Role:</strong> {selectedMember?.role}
            </p>
            <p>
              <strong>Phone:</strong> {selectedMember?.phone}
            </p>
            <p>
              <strong>Email:</strong> {selectedMember?.email}
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Input
              placeholder="Name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
            />
            <Select value={formRole} onValueChange={(val) => setFormRole(val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Member">Member</SelectItem>
                <SelectItem value="Chairperson">Chairperson</SelectItem>
                <SelectItem value="Secretary">Secretary</SelectItem>
                <SelectItem value="Assistant Secretary (Admin II)">
                  Assistant Secretary (Admin II)
                </SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Phone"
              value={formPhone}
              onChange={(e) => setFormPhone(e.target.value)}
            />
            <Input
              placeholder="Email"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
            />

            {/* Image Upload */}
            <div>
              <input type="file" accept="image/*" onChange={handleImageUpload} />
              {formProfile && (
                <img
                  src={formProfile}
                  alt="Preview"
                  className="w-16 h-16 rounded-full object-cover mt-2"
                />
              )}
            </div>
          </div>
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditMember}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
