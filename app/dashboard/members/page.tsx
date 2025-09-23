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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Trash2,
  Plus,
  Eye,
  MoreVertical,
  ToggleLeft,
  ToggleRight,
  Languages,
  Crown,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  ScrollText,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ✅ Multilingual Member interface
interface Member {
  id: number;
  name: {
    english: string;
    tamil: string;
    sinhala: string;
  };
  role: {
    english: string;
    tamil: string;
    sinhala: string;
  };
  phone: string;
  email: string;
  enabled: boolean;
  profile: string;
  tenure: {
    startDate: {
      english: string;
      tamil: string;
      sinhala: string;
    };
    currentTerm: {
      english: string;
      tamil: string;
      sinhala: string;
    };
  };
  message: {
    english: string;
    tamil: string;
    sinhala: string;
  };
  address: {
    english: string;
    tamil: string;
    sinhala: string;
  };
}

interface InfoCardItem {
  id: string;
  title: {
    english: string;
    tamil: string;
    sinhala: string;
  };
  subtext?: {
    english: string;
    tamil: string;
    sinhala: string;
  };
}

// ✅ Language Support
const languages = [
  { value: 'english', label: 'English' },
  { value: 'tamil', label: 'Tamil' },
  { value: 'sinhala', label: 'Sinhala' }
];

const roles = [
  { 
    english: "Member", 
    tamil: "உறுப்பினர்", 
    sinhala: "සාමාජික" 
  },
  { 
    english: "Chairperson", 
    tamil: "தலைவர்", 
    sinhala: "ප්‍රධානියා" 
  },
  { 
    english: "Secretary", 
    tamil: "செயலாளர்", 
    sinhala: "ලේකම්" 
  },
  { 
    english: "Assistant Secretary", 
    tamil: "உதவி செயலாளர்", 
    sinhala: "උප ලේකම්" 
  }
];

// ✅ Initial Members with multilingual data
const initialMembers: Member[] = [
  {
    id: 1,
    name: {
      english: "John Doe",
      tamil: "ஜான் டோ",
      sinhala: "ජෝන් ඩෝ"
    },
    role: {
      english: "Chairperson",
      tamil: "தலைவர்",
      sinhala: "ප්‍රධානියා"
    },
    phone: "+1 123-4567",
    email: "john@example.com",
    enabled: true,
    profile: "https://i.pravatar.cc/150?img=1",
    tenure: {
      startDate: {
        english: "January 2023",
        tamil: "ஜனவரி 2023",
        sinhala: "2023 ජනවාරි"
      },
      currentTerm: {
        english: "2023-2027",
        tamil: "2023-2027",
        sinhala: "2023-2027"
      }
    },
    message: {
      english: "Dedicated to serving our community with integrity and commitment.",
      tamil: "ஒருமைப்பாடு மற்றும் அர்ப்பணிப்புடன் எங்கள் சமூகத்திற்கு சேவை செய்ய அர்ப்பணிக்கப்பட்டுள்ளேன்.",
      sinhala: "සංකල්පය සහ කැපවීම සමඟ අපගේ ප්‍රජාවට සේවය කිරීමට කැපවී සිටිමි."
    },
    address: {
      english: "123 Main Street, City",
      tamil: "123 மெயின் தெரு, நகரம்",
      sinhala: "123 ප්‍රධාන වීදිය, නගරය"
    }
  },
  {
    id: 2,
    name: {
      english: "Jane Smith",
      tamil: "ஜேன் ஸ்மித்",
      sinhala: "ජේන් ස්මිත්"
    },
    role: {
      english: "Secretary",
      tamil: "செயலாளர்",
      sinhala: "ලේකම්"
    },
    phone: "+1 987-6543",
    email: "jane@example.com",
    enabled: true,
    profile: "https://i.pravatar.cc/150?img=2",
    tenure: {
      startDate: {
        english: "March 2023",
        tamil: "மார்ச் 2023",
        sinhala: "2023 මාර්තු"
      },
      currentTerm: {
        english: "2023-2027",
        tamil: "2023-2027",
        sinhala: "2023-2027"
      }
    },
    message: {
      english: "Committed to transparent governance and community development.",
      tamil: "வெளிப்படை ஆளுமை மற்றும் சமூக மேம்பாட்டிற்கு அர்ப்பணிக்கப்பட்டுள்ளேன்.",
      sinhala: "පාරදෘෂ්ටික පාලනය සහ සමාජ සංවර්ධනය සඳහා කැපවී සිටිමි."
    },
    address: {
      english: "456 Oak Avenue, Town",
      tamil: "456 ஓக் அவென்யூ, நகரம்",
      sinhala: "456 ඔක් ඇවිනියු, නගරය"
    }
  }
];

// ✅ InfoCard Component for Academics & Honours
function InfoCard({ 
  title, 
  description, 
  icon: Icon, 
  items, 
  setItems, 
  language 
}: {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  items: InfoCardItem[];
  setItems: React.Dispatch<React.SetStateAction<InfoCardItem[]>>;
  language: string;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InfoCardItem | null>(null);
  const [newTitle, setNewTitle] = useState({ english: "", tamil: "", sinhala: "" });
  const [newSubtext, setNewSubtext] = useState({ english: "", tamil: "", sinhala: "" });

  const getDisplayText = (text: { english: string; tamil: string; sinhala: string }) => {
    return text[language as keyof typeof text] || text.english;
  };

  const handleAddItem = () => {
    if (newTitle.english.trim() !== "") {
      setItems([...items, { 
        id: Math.random().toString(36).substr(2, 9),
        title: { ...newTitle }, 
        subtext: newSubtext.english || newSubtext.tamil || newSubtext.sinhala ? { ...newSubtext } : undefined 
      }]);
      setNewTitle({ english: "", tamil: "", sinhala: "" });
      setNewSubtext({ english: "", tamil: "", sinhala: "" });
      setIsDialogOpen(false);
    }
  };

  const handleEditItem = (item: InfoCardItem) => {
    setEditingItem(item);
    setNewTitle({ ...item.title });
    setNewSubtext(item.subtext ? { ...item.subtext } : { english: "", tamil: "", sinhala: "" });
    setIsEditDialogOpen(true);
  };

  const handleUpdateItem = () => {
    if (editingItem) {
      setItems(items.map(item => 
        item.id === editingItem.id 
          ? { 
              ...item, 
              title: { ...newTitle }, 
              subtext: newSubtext.english || newSubtext.tamil || newSubtext.sinhala ? { ...newSubtext } : undefined 
            } 
          : item
      ));
      setEditingItem(null);
      setNewTitle({ english: "", tamil: "", sinhala: "" });
      setNewSubtext({ english: "", tamil: "", sinhala: "" });
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5 text-blue-600" />}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <span className="text-sm font-medium">{getDisplayText(item.title)}</span>
                  {item.subtext && (
                    <p className="text-xs text-gray-500 mt-1">{getDisplayText(item.subtext)}</p>
                  )}
                </div>
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="outline" size="sm" onClick={() => handleEditItem(item)}>
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteItem(item.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add {title}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add {title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Title (English)</Label>
                  <Input value={newTitle.english} onChange={(e) => setNewTitle({...newTitle, english: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Title (Tamil)</Label>
                  <Input value={newTitle.tamil} onChange={(e) => setNewTitle({...newTitle, tamil: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Title (Sinhala)</Label>
                  <Input value={newTitle.sinhala} onChange={(e) => setNewTitle({...newTitle, sinhala: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Details (English)</Label>
                  <Input value={newSubtext.english} onChange={(e) => setNewSubtext({...newSubtext, english: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Details (Tamil)</Label>
                  <Input value={newSubtext.tamil} onChange={(e) => setNewSubtext({...newSubtext, tamil: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Details (Sinhala)</Label>
                  <Input value={newSubtext.sinhala} onChange={(e) => setNewSubtext({...newSubtext, sinhala: e.target.value})} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddItem}>Add</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CouncilMemberPage() {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState('english');

  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);

  // Form states
  const [formName, setFormName] = useState({ english: "", tamil: "", sinhala: "" });
  const [formRole, setFormRole] = useState(roles[0]);
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formProfile, setFormProfile] = useState<string>("");
  const [formTenure, setFormTenure] = useState({
    startDate: { english: "", tamil: "", sinhala: "" },
    currentTerm: { english: "", tamil: "", sinhala: "" }
  });
  const [formAddress, setFormAddress] = useState({ english: "", tamil: "", sinhala: "" });
  const [formMessage, setFormMessage] = useState({ english: "", tamil: "", sinhala: "" });

  // Academics & Honours
  const [academics, setAcademics] = useState<InfoCardItem[]>([]);
  const [honours, setHonours] = useState<InfoCardItem[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Helper function to get text in current language
  const getText = (text: { english: string; tamil: string; sinhala: string }) => {
    return text[currentLanguage as keyof typeof text] || text.english;
  };

  const filteredMembers = useMemo(() => {
    return members.filter(
      (member) =>
        member.name.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.name.tamil.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.name.sinhala.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.english.toLowerCase().includes(searchTerm.toLowerCase())
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
      setFormProfile(reader.result as string);
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
    if (!formName.english.trim()) return;
    
    const newMember: Member = {
      id: Date.now(),
      name: formName,
      role: formRole,
      phone: formPhone,
      email: formEmail,
      enabled: true,
      profile: formProfile || "https://i.pravatar.cc/150?img=10",
      tenure: formTenure,
      message: formMessage,
      address: formAddress
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
                tenure: formTenure,
                message: formMessage,
                address: formAddress
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
    setFormTenure(member.tenure);
    setFormMessage(member.message);
    setFormAddress(member.address);
    setIsEditOpen(true);
  };

  const openViewModal = (member: Member) => {
    setSelectedMember(member);
    setIsViewOpen(true);
  };

  const openMessageModal = (member: Member) => {
    setSelectedMember(member);
    setFormMessage(member.message);
    setIsMessageOpen(true);
  };

  const resetForm = () => {
    setFormName({ english: "", tamil: "", sinhala: "" });
    setFormRole(roles[0]);
    setFormPhone("");
    setFormEmail("");
    setFormProfile("");
    setFormTenure({ startDate: { english: "", tamil: "", sinhala: "" }, currentTerm: { english: "", tamil: "", sinhala: "" } });
    setFormMessage({ english: "", tamil: "", sinhala: "" });
    setFormAddress({ english: "", tamil: "", sinhala: "" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Council Members</h1>
          <p className="text-gray-600">Manage council members, roles and contacts</p>
        </div>
        <div className="flex space-x-2">
          <Select value={currentLanguage} onValueChange={setCurrentLanguage}>
            <SelectTrigger className="w-40">
              <Languages className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Council Member</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Name (English) *</Label>
                      <Input value={formName.english} onChange={(e) => setFormName({...formName, english: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Name (Tamil)</Label>
                      <Input value={formName.tamil} onChange={(e) => setFormName({...formName, tamil: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Name (Sinhala)</Label>
                      <Input value={formName.sinhala} onChange={(e) => setFormName({...formName, sinhala: e.target.value})} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select value={formRole.english} onValueChange={(val) => setFormRole(roles.find(r => r.english === val) || roles[0])}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.english} value={role.english}>
                            {role.english}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input value={formPhone} onChange={(e) => setFormPhone(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input value={formEmail} onChange={(e) => setFormEmail(e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* Profile Image */}
                <div className="space-y-2">
                  <Label>Profile Image</Label>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full" />
                  {formProfile && (
                    <img src={formProfile} alt="Preview" className="w-20 h-20 rounded-full object-cover mt-2" />
                  )}
                </div>

                {/* Tenure Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Tenure Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date (English)</Label>
                      <Input value={formTenure.startDate.english} onChange={(e) => setFormTenure({...formTenure, startDate: {...formTenure.startDate, english: e.target.value}})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Current Term (English)</Label>
                      <Input value={formTenure.currentTerm.english} onChange={(e) => setFormTenure({...formTenure, currentTerm: {...formTenure.currentTerm, english: e.target.value}})} />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Address</h3>
                  <div className="space-y-2">
                    <Label>Address (English)</Label>
                    <Input value={formAddress.english} onChange={(e) => setFormAddress({...formAddress, english: e.target.value})} />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button onClick={handleAddMember}>Add Member</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <Input
        placeholder="Search by name or role..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-md"
      />

      {/* Member List */}
      <Card>
        <CardHeader>
          <CardTitle>Council Members</CardTitle>
          <CardDescription>All council members with their roles and contact information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-3 text-left">Profile</th>
                  <th className="border px-4 py-3 text-left">Name</th>
                  <th className="border px-4 py-3 text-left">Role</th>
                  <th className="border px-4 py-3 text-left">Phone</th>
                  <th className="border px-4 py-3 text-left">Email</th>
                  <th className="border px-4 py-3 text-left">Status</th>
                  <th className="border px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                    <td className="border px-4 py-3">
                      <img src={member.profile} alt={getText(member.name)} className="w-12 h-12 rounded-full object-cover" />
                    </td>
                    <td className="border px-4 py-3 font-medium">{getText(member.name)}</td>
                    <td className="border px-4 py-3">{getText(member.role)}</td>
                    <td className="border px-4 py-3">{member.phone}</td>
                    <td className="border px-4 py-3">{member.email}</td>
                    <td className="border px-4 py-3">
                      {member.enabled ? (
                        <span className="text-green-600 font-medium">Enabled</span>
                      ) : (
                        <span className="text-gray-500">Disabled</span>
                      )}
                    </td>
                    <td className="border px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => openViewModal(member)}>
                            <Eye className="w-4 h-4 mr-2" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditModal(member)}>
                            <Edit className="w-4 h-4 mr-2" /> Edit Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openMessageModal(member)}>
                            <ScrollText className="w-4 h-4 mr-2" /> Edit Message
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(member.id)}>
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
                          <DropdownMenuItem onClick={() => handleDeleteMember(member.id)} className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
              Showing {paginatedMembers.length} of {filteredMembers.length} members
            </div>
            <div className="flex space-x-2">
              <Button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                Previous
              </Button>
              <span className="px-3 py-2 text-sm">
                Page {currentPage} of {totalPages || 1}
              </span>
              <Button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)}>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Modal */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Member Details</DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <img src={selectedMember.profile} alt={getText(selectedMember.name)} className="w-20 h-20 rounded-full object-cover" />
                <div>
                  <h3 className="text-xl font-bold">{getText(selectedMember.name)}</h3>
                  <p className="text-lg text-gray-600">{getText(selectedMember.role)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-green-600" />
                    <span>{selectedMember.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span>{selectedMember.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-red-600" />
                    <span>{getText(selectedMember.address)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span>Term: {getText(selectedMember.tenure.currentTerm)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-orange-600" />
                    <span>Since: {getText(selectedMember.tenure.startDate)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ToggleRight className="w-4 h-4 text-gray-600" />
                    <span>Status: {selectedMember.enabled ? "Enabled" : "Disabled"}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Member's Message</h4>
                <p className="text-gray-700">"{getText(selectedMember.message)}"</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Member Profile</DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <div className="grid gap-6 py-4">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Name (English)</Label>
                    <Input value={formName.english} onChange={(e) => setFormName({...formName, english: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Name (Tamil)</Label>
                    <Input value={formName.tamil} onChange={(e) => setFormName({...formName, tamil: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Name (Sinhala)</Label>
                    <Input value={formName.sinhala} onChange={(e) => setFormName({...formName, sinhala: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input value={formPhone} onChange={(e) => setFormPhone(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={formEmail} onChange={(e) => setFormEmail(e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Profile Image */}
              <div className="space-y-2">
                <Label>Profile Image</Label>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full" />
                {formProfile && (
                  <img src={formProfile} alt="Preview" className="w-20 h-20 rounded-full object-cover mt-2" />
                )}
              </div>

              {/* Tenure Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Tenure Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date (English)</Label>
                    <Input value={formTenure.startDate.english} onChange={(e) => setFormTenure({...formTenure, startDate: {...formTenure.startDate, english: e.target.value}})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Current Term (English)</Label>
                    <Input value={formTenure.currentTerm.english} onChange={(e) => setFormTenure({...formTenure, currentTerm: {...formTenure.currentTerm, english: e.target.value}})} />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Address</h3>
                <div className="space-y-2">
                  <Label>Address (English)</Label>
                  <Input value={formAddress.english} onChange={(e) => setFormAddress({...formAddress, english: e.target.value})} />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleEditMember}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Message Edit Modal */}
      <Dialog open={isMessageOpen} onOpenChange={setIsMessageOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Member's Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Message (English)</Label>
              <Textarea value={formMessage.english} onChange={(e) => setFormMessage({...formMessage, english: e.target.value})} rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Message (Tamil)</Label>
              <Textarea value={formMessage.tamil} onChange={(e) => setFormMessage({...formMessage, tamil: e.target.value})} rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Message (Sinhala)</Label>
              <Textarea value={formMessage.sinhala} onChange={(e) => setFormMessage({...formMessage, sinhala: e.target.value})} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMessageOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              if (selectedMember) {
                setMembers(members.map(m => m.id === selectedMember.id ? {...m, message: formMessage} : m));
                setIsMessageOpen(false);
              }
            }}>Save Message</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Academics & Honours Section */}
      {selectedMember && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InfoCard 
            title="Academics & Qualifications" 
            description="Educational background and qualifications" 
            icon={Award} 
            items={academics} 
            setItems={setAcademics}
            language={currentLanguage}
          />
          <InfoCard 
            title="Honours & Recognitions" 
            description="Awards and recognitions received" 
            icon={Crown} 
            items={honours} 
            setItems={setHonours}
            language={currentLanguage}
          />
        </div>
      )}
    </div>
  );
}