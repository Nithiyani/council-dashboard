"use client"

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash, Plus } from "lucide-react";

interface Member {
  id: number;
  name: string;
  ward: string;
  contact: string;
  role: string;
}

const initialMembers: Member[] = [
  { id: 1, name: "John Doe", ward: "Ward 1", contact: "+1 123-4567", role: "Member" },
  { id: 2, name: "Jane Smith", ward: "Ward 2", contact: "+1 987-6543", role: "Chairperson" },
  { id: 3, name: "Michael Brown", ward: "Ward 3", contact: "+1 555-5555", role: "Member" },
];

export default function CouncilMemberPage() {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formWard, setFormWard] = useState("");
  const [formContact, setFormContact] = useState("");
  const [formRole, setFormRole] = useState("Member");

  // Filtered members based on search
  const filteredMembers = useMemo(() => {
    return members.filter(member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.ward.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [members, searchTerm]);

  // Handlers
  const handleAddMember = () => {
    const newMember: Member = {
      id: Date.now(),
      name: formName,
      ward: formWard,
      contact: formContact,
      role: formRole,
    };
    setMembers([...members, newMember]);
    setFormName(""); setFormWard(""); setFormContact(""); setFormRole("Member");
    setIsAddOpen(false);
  };

  const handleEditMember = () => {
    if (selectedMember) {
      setMembers(members.map(m => m.id === selectedMember.id ? { ...m, name: formName, ward: formWard, contact: formContact, role: formRole } : m));
      setIsEditOpen(false);
    }
  };

  const handleDeleteMember = (id: number) => {
    setMembers(members.filter(m => m.id !== id));
  };

  const handleAssignRole = () => {
    if (selectedMember) {
      setMembers(members.map(m => m.id === selectedMember.id ? { ...m, ward: formWard, role: formRole } : m));
      setIsAssignOpen(false);
    }
  };

  const openEditModal = (member: Member) => {
    setSelectedMember(member);
    setFormName(member.name);
    setFormWard(member.ward);
    setFormContact(member.contact);
    setFormRole(member.role);
    setIsEditOpen(true);
  };

  const openAssignModal = (member: Member) => {
    setSelectedMember(member);
    setFormWard(member.ward);
    setFormRole(member.role);
    setIsAssignOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Council Members</h1>
          <p className="text-gray-600">Manage council members, roles, and wards</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2"/>Add Member</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <Input placeholder="Name" value={formName} onChange={(e) => setFormName(e.target.value)} />
              <Input placeholder="Ward" value={formWard} onChange={(e) => setFormWard(e.target.value)} />
              <Input placeholder="Contact" value={formContact} onChange={(e) => setFormContact(e.target.value)} />
              <Select value={formRole} onValueChange={(val) => setFormRole(val)}>
                <SelectTrigger><SelectValue placeholder="Select Role" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Member">Member</SelectItem>
                  <SelectItem value="Chairperson">Chairperson</SelectItem>
                  <SelectItem value="Secretary">Secretary</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button onClick={handleAddMember}>Add</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Input placeholder="Search by name, ward or role..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

      {/* Member List */}
      <Card>
        <CardHeader>
          <CardTitle>Member List</CardTitle>
          <CardDescription>All council members with their roles and wards</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Name</th>
                <th className="border px-4 py-2 text-left">Ward</th>
                <th className="border px-4 py-2 text-left">Contact</th>
                <th className="border px-4 py-2 text-left">Role</th>
                <th className="border px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map(member => (
                <tr key={member.id}>
                  <td className="border px-4 py-2">{member.name}</td>
                  <td className="border px-4 py-2">{member.ward}</td>
                  <td className="border px-4 py-2">{member.contact}</td>
                  <td className="border px-4 py-2">{member.role}</td>
                  <td className="border px-4 py-2 space-x-2">
                    <Button size="sm" variant="outline" onClick={() => openEditModal(member)}><Edit className="w-4 h-4" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteMember(member.id)}><Trash className="w-4 h-4" /></Button>
                    <Button size="sm" variant="outline" onClick={() => openAssignModal(member)}>Assign Role/Ward</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader><DialogTitle>Edit Member</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <Input placeholder="Name" value={formName} onChange={(e) => setFormName(e.target.value)} />
            <Input placeholder="Ward" value={formWard} onChange={(e) => setFormWard(e.target.value)} />
            <Input placeholder="Contact" value={formContact} onChange={(e) => setFormContact(e.target.value)} />
            <Select value={formRole} onValueChange={(val) => setFormRole(val)}>
              <SelectTrigger><SelectValue placeholder="Select Role" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Member">Member</SelectItem>
                <SelectItem value="Chairperson">Chairperson</SelectItem>
                <SelectItem value="Secretary">Secretary</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleEditMember}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Role/Ward Modal */}
      <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader><DialogTitle>Assign Role / Ward</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <Input placeholder="Ward" value={formWard} onChange={(e) => setFormWard(e.target.value)} />
            <Select value={formRole} onValueChange={(val) => setFormRole(val)}>
              <SelectTrigger><SelectValue placeholder="Select Role" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Member">Member</SelectItem>
                <SelectItem value="Chairperson">Chairperson</SelectItem>
                <SelectItem value="Secretary">Secretary</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsAssignOpen(false)}>Cancel</Button>
            <Button onClick={handleAssignRole}>Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
