"use client";

import { useState, useMemo, useRef } from "react";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Edit,
  Trash2,
  Plus,
  Eye,
  MoreVertical,
  ToggleLeft,
  ToggleRight,
  Languages,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  X,
  CheckCircle,
  AlertCircle,
  Upload,
  Search,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ✅ Define a type for roles
type Role = {
  english: string;
  tamil: string;
  sinhala: string;
};

// ✅ Update ROLES to use the Role type
const ROLES: Role[] = [
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

// ✅ Constants for reusable configuration
const LANGUAGES = [
  { code: 'english', label: 'English' },
  { code: 'tamil', label: 'Tamil' },
  { code: 'sinhala', label: 'Sinhala' }
] as const;

// ✅ Validation types
type ValidationError = {
  field: string;
  message: string;
  language?: string;
};

type ValidationResult = {
  isValid: boolean;
  errors: ValidationError[];
};

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

// ✅ Alert Component
interface AlertProps {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}

const Alert = ({ type, message, onClose }: AlertProps) => {
  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
  const Icon = type === "success" ? CheckCircle : AlertCircle;

  return (
    <div className="mt-4 animate-in slide-in-from-top duration-300">
      <div
        className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2`}
      >
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
        <span className="font-medium flex-1 text-sm sm:text-base">{message}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 sm:h-6 sm:w-6 text-white hover:bg-white/20 flex-shrink-0"
          onClick={onClose}
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};

// ✅ Validation Alert Component for multiple errors
const ValidationAlert = ({ 
  errors, 
  onClose 
}: { 
  errors: ValidationError[]; 
  onClose: () => void;
}) => {
  if (errors.length === 0) return null;

  return (
    <div className="mt-4 animate-in slide-in-from-top duration-300">
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-red-800 font-medium text-sm sm:text-base mb-2">
              Please fix the following errors:
            </p>
            <ul className="text-red-700 text-xs sm:text-sm space-y-1">
              {errors.map((error, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-red-500 mt-1 flex-shrink-0">•</span>
                  <span className="break-words">
                    {error.language && <strong>{error.language}: </strong>}
                    {error.message}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 hover:bg-red-100 flex-shrink-0 mt-0.5"
            onClick={onClose}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// ✅ Image Upload Component
interface ImageUploadProps {
  profile: string;
  onImageChange: (file: File) => void;
  onImageRemove: () => void;
}

const ImageUpload = ({ 
  profile, 
  onImageChange, 
  onImageRemove 
}: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onImageChange(files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm sm:text-base">Profile Image</Label>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />
      
      {profile ? (
        <div className="flex items-center gap-3">
          <img 
            src={profile} 
            alt="Profile preview" 
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border flex-shrink-0" 
          />
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={onImageRemove}
            className="text-xs sm:text-sm"
          >
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            Remove
          </Button>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-3 sm:p-4 text-center cursor-pointer hover:border-gray-400 transition-colors"
          onClick={triggerFileInput}
        >
          <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto mb-2" />
          <span className="text-xs sm:text-sm text-gray-600 block">
            Click to upload profile image
          </span>
          <span className="text-xs text-gray-500 block mt-1">
            PNG, JPG up to 5MB
          </span>
        </div>
      )}
    </div>
  );
};

// ✅ Language Form Section Component
interface LanguageFormSectionProps {
  language: 'english' | 'tamil' | 'sinhala';
  formData: any;
  onFormDataChange: (data: any) => void;
  validationErrors: ValidationError[];
}

const LanguageFormSection = ({
  language,
  formData,
  onFormDataChange,
  validationErrors,
}: LanguageFormSectionProps) => {
  const languageNames = {
    english: "English",
    tamil: "Tamil", 
    sinhala: "Sinhala"
  };

  const handleFieldChange = (field: string, value: string) => {
    const updatedData = {
      ...formData,
      [field]: {
        ...formData[field],
        [language]: value
      }
    };
    onFormDataChange(updatedData);
  };

  // Get errors specific to this language and field
  const getFieldError = (field: string): ValidationError | undefined => {
    return validationErrors.find(error => 
      error.field === field && error.language === languageNames[language]
    );
  };

  const nameError = getFieldError('name');
  const hasNameError = !!nameError;

  return (
    <div className="space-y-4">
      <div className={`p-3 rounded-lg ${hasNameError ? "bg-red-50 border border-red-200" : "bg-blue-50"}`}>
        <div className="flex items-center gap-2">
          {hasNameError ? (
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          ) : (
            <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
          )}
          <span className={`font-medium text-sm ${hasNameError ? "text-red-800" : "text-blue-800"}`}>
            {languageNames[language]} {hasNameError && "- Required field"}
          </span>
        </div>
      </div>

      {/* Name Field */}
      <div>
        <Label htmlFor={`name-${language}`} className={`text-sm sm:text-base ${hasNameError ? "text-red-600" : ""}`}>
          Name in {languageNames[language]} *
        </Label>
        <Input
          id={`name-${language}`}
          value={formData.name[language]}
          onChange={(e) => handleFieldChange('name', e.target.value)}
          placeholder={`Enter name in ${languageNames[language]}`}
          className={`mt-1 text-sm sm:text-base ${hasNameError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
        />
        {hasNameError && (
          <p className="text-red-600 text-xs sm:text-sm mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            {nameError.message}
          </p>
        )}
      </div>

      {/* Message Field */}
      <div>
        <Label htmlFor={`message-${language}`} className="text-sm sm:text-base">
          Message in {languageNames[language]}
        </Label>
        <Textarea
          id={`message-${language}`}
          value={formData.message[language]}
          onChange={(e) => handleFieldChange('message', e.target.value)}
          placeholder={`Enter message in ${languageNames[language]}`}
          rows={3}
          className="mt-1 text-sm sm:text-base"
        />
      </div>

      {/* Address Field */}
      {/* <div>
        <Label htmlFor={`address-${language}`} className="text-sm sm:text-base">
          Address in {languageNames[language]}
        </Label>
        <Input
          id={`address-${language}`}
          value={formData.address[language]}
          onChange={(e) => handleFieldChange('address', e.target.value)}
          placeholder={`Enter address in ${languageNames[language]}`}
          className="mt-1 text-sm sm:text-base"
        />
      </div> */}
    </div>
  );
};

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
  }
];

// ✅ Mobile Member Card Component
interface MobileMemberCardProps {
  member: Member;
  currentLanguage: string;
  onView: (member: Member) => void;
  onEdit: (member: Member) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number) => void;
  getText: (text: { english: string; tamil: string; sinhala: string }) => string;
}

const MobileMemberCard = ({ 
  member, 
  currentLanguage, 
  onView, 
  onEdit, 
  onDelete, 
  onToggleStatus,
  getText 
}: MobileMemberCardProps) => (
  <Card className="mb-4 hover:shadow-lg transition-shadow duration-300">
    <CardContent className="p-4">
      <div className="flex items-start space-x-4">
        <img 
          src={member.profile} 
          alt={getText(member.name)} 
          className="w-16 h-16 rounded-full object-cover border flex-shrink-0" 
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 truncate text-base">
                {getText(member.name)}
              </h3>
              <p className="text-gray-600 text-sm truncate">
                {getText(member.role)}
              </p>
            </div>
            <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-2 ${
              member.enabled ? 'bg-green-500' : 'bg-gray-400'
            }`} />
          </div>
          
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <Phone className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{member.phone}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Mail className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{member.email}</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 pt-3 border-t">
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onView(member)}
                className="h-8 w-8 p-0"
              >
                <Eye className="w-3 h-3" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onEdit(member)}
                className="h-8 w-8 p-0"
              >
                <Edit className="w-3 h-3" />
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onToggleStatus(member.id)}
                className="h-8 text-xs"
              >
                {member.enabled ? 'Disable' : 'Enable'}
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => onDelete(member.id)}
                className="h-8 w-8 p-0"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function CouncilMemberPage() {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState('english');
  const [alert, setAlert] = useState<{type: "success" | "error", message: string} | null>(null);

  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: { english: "", tamil: "", sinhala: "" },
    role: ROLES[0],
    phone: "",
    email: "",
    profile: "",
    address: { english: "", tamil: "", sinhala: "" },
    message: { english: "", tamil: "", sinhala: "" }
  });

  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ✅ Enhanced Validation Function
  const validateMemberForm = (data: typeof formData): ValidationResult => {
    const errors: ValidationError[] = [];

    // Validate names in all languages
    LANGUAGES.forEach(({ code, label }) => {
      if (!data.name[code]?.trim()) {
        errors.push({
          field: 'name',
          message: 'Name is required',
          language: label
        });
      } else if (data.name[code].trim().length < 2) {
        errors.push({
          field: 'name',
          message: 'Name must be at least 2 characters',
          language: label
        });
      }
    });

    // Validate contact information
    if (!data.phone.trim()) {
      errors.push({
        field: 'phone',
        message: 'Phone number is required'
      });
    } else if (!/^[\d\s+\-()]+$/.test(data.phone)) {
      errors.push({
        field: 'phone',
        message: 'Please enter a valid phone number'
      });
    }

    if (!data.email.trim()) {
      errors.push({
        field: 'email',
        message: 'Email address is required'
      });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push({
        field: 'email',
        message: 'Please enter a valid email address'
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  // ✅ Real-time field validation helper
  const getFieldError = (field: string, language?: string): ValidationError | undefined => {
    return validationErrors.find(error => 
      error.field === field && 
      (!language || error.language === language)
    );
  };

  const hasFieldError = (field: string, language?: string): boolean => {
    return !!getFieldError(field, language);
  };

  const clearValidationErrors = () => {
    setValidationErrors([]);
  };

  const clearFieldErrors = (field: string) => {
    setValidationErrors(prev => prev.filter(error => error.field !== field));
  };

  // Helper function to get text in current language
  const getText = (text: { english: string; tamil: string; sinhala: string }) => {
    return text[currentLanguage as keyof typeof text] || text.english;
  };

  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  // Data filtering and pagination
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

  // ✅ Image Upload Handler
  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({...prev, profile: reader.result as string}));
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = () => {
    setFormData(prev => ({...prev, profile: ""}));
  };

  const handleRoleChange = (englishRole: string) => {
    const selectedRole = ROLES.find(r => r.english === englishRole) || ROLES[0];
    setFormData(prev => ({
      ...prev,
      role: selectedRole
    }));
  };

  const handleEnglishFieldChange = (field: 'message' | 'address', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        english: value,
        tamil: value,
        sinhala: value
      }
    }));
  };

  // ✅ Real-time field validation handlers
  const handlePhoneChange = (value: string) => {
    setFormData(prev => ({...prev, phone: value}));
    clearFieldErrors('phone');
  };

  const handleEmailChange = (value: string) => {
    setFormData(prev => ({...prev, email: value}));
    clearFieldErrors('email');
  };

  // ✅ Member Operations with enhanced validation
  const handleAddMember = () => {
    const validation = validateMemberForm(formData);
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      showAlert("error", "Please fix the validation errors below!");
      return;
    }
    
    const newMember: Member = {
      id: Date.now(),
      name: formData.name,
      role: formData.role,
      phone: formData.phone,
      email: formData.email,
      enabled: true,
      profile: formData.profile || "https://i.pravatar.cc/150?img=10",
      message: formData.message,
      address: formData.address
    };
    
    setMembers(prev => [...prev, newMember]);
    resetForm();
    setIsAddOpen(false);
    showAlert("success", "Council member added successfully!");
  };

  const handleEditMember = () => {
    const validation = validateMemberForm(formData);
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      showAlert("error", "Please fix the validation errors below!");
      return;
    }

    if (selectedMember) {
      setMembers(prev =>
        prev.map(m =>
          m.id === selectedMember.id
            ? {
                ...m,
                name: formData.name,
                role: formData.role,
                phone: formData.phone,
                email: formData.email,
                profile: formData.profile || m.profile,
                message: formData.message,
                address: formData.address
              }
            : m
        )
      );
      setIsEditOpen(false);
      showAlert("success", "Council member updated successfully!");
    }
  };

  const handleDeleteMember = (id: number) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    showAlert("success", "Council member deleted successfully!");
  };

  const handleToggleStatus = (id: number) => {
    setMembers(prev =>
      prev.map(m =>
        m.id === id ? { ...m, enabled: !m.enabled } : m
      )
    );
    const member = members.find(m => m.id === id);
    showAlert("success", `Member ${member?.enabled ? "disabled" : "enabled"} successfully!`);
  };

  const openEditModal = (member: Member) => {
    setSelectedMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      phone: member.phone,
      email: member.email,
      profile: member.profile,
      message: member.message,
      address: member.address
    });
    setIsEditOpen(true);
    clearValidationErrors();
  };

  const openViewModal = (member: Member) => {
    setSelectedMember(member);
    setIsViewOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: { english: "", tamil: "", sinhala: "" },
      role: ROLES[0],
      phone: "",
      email: "",
      profile: "",
      address: { english: "", tamil: "", sinhala: "" },
      message: { english: "", tamil: "", sinhala: "" }
    });
    clearValidationErrors();
  };

  // ✅ Common Form Sections with real-time validation
  const CommonFormFields = () => {
    const phoneError = getFieldError('phone');
    const emailError = getFieldError('email');

    return (
      <div className="space-y-6 border-t pt-6">
        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Contact Information</h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label className={`text-sm sm:text-base ${phoneError ? "text-red-600" : ""}`}>Phone *</Label>
              <Input 
                value={formData.phone} 
                onChange={(e) => handlePhoneChange(e.target.value)}
                className={`text-sm sm:text-base ${phoneError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                placeholder="0764822492"
              />
              {phoneError && (
                <p className="text-red-600 text-xs sm:text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  {phoneError.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className={`text-sm sm:text-base ${emailError ? "text-red-600" : ""}`}>Email *</Label>
              <Input 
                value={formData.email} 
                onChange={(e) => handleEmailChange(e.target.value)}
                className={`text-sm sm:text-base ${emailError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                placeholder="navaneethansivakumaran@gmail.com"
              />
              {emailError && (
                <p className="text-red-600 text-xs sm:text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  {emailError.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Role & Profile */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Role & Profile</h3>
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label className="text-sm sm:text-base">Role</Label>
              <Select 
                value={formData.role.english} 
                onValueChange={handleRoleChange}
              >
                <SelectTrigger className="text-sm sm:text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((role) => (
                    <SelectItem key={role.english} value={role.english} className="text-sm">
                      {role.english}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs sm:text-sm text-gray-500">
                Role will be automatically translated to all languages
              </p>
            </div>

            <ImageUpload 
              profile={formData.profile}
              onImageChange={handleImageUpload}
              onImageRemove={handleImageRemove}
            />
          </div>
        </div>

        {/* Auto-fill Message and Address */}

      </div>
    );
  };

  // Check if mobile view
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-4">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Council Members</h1>
          <p className="text-gray-600 text-sm sm:text-base">Manage council members, roles and contacts</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Select value={currentLanguage} onValueChange={setCurrentLanguage}>
            <SelectTrigger className="w-full sm:w-40 text-sm">
              <Languages className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.code} value={lang.code} className="text-sm">
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog open={isAddOpen} onOpenChange={(open) => {
            setIsAddOpen(open);
            if (!open) {
              resetForm();
              setAlert(null);
            }
          }}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto text-sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl">Add New Council Member</DialogTitle>
                <p className="text-sm text-gray-600">
                  Fill in the member details - names are required in all languages, other fields auto-fill
                </p>
              </DialogHeader>
              
              <div className="grid gap-4 sm:gap-6 py-4">
                {/* Language Tabs for Names Only */}
                <Tabs defaultValue="english" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="english" className="text-xs sm:text-sm">English</TabsTrigger>
                    <TabsTrigger value="tamil" className="text-xs sm:text-sm">Tamil</TabsTrigger>
                    <TabsTrigger value="sinhala" className="text-xs sm:text-sm">Sinhala</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="english" className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
                    <LanguageFormSection
                      language="english"
                      formData={formData}
                      onFormDataChange={setFormData}
                      validationErrors={validationErrors}
                    />
                  </TabsContent>
                  
                  <TabsContent value="tamil" className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
                    <LanguageFormSection
                      language="tamil"
                      formData={formData}
                      onFormDataChange={setFormData}
                      validationErrors={validationErrors}
                    />
                  </TabsContent>
                  
                  <TabsContent value="sinhala" className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
                    <LanguageFormSection
                      language="sinhala"
                      formData={formData}
                      onFormDataChange={setFormData}
                      validationErrors={validationErrors}
                    />
                  </TabsContent>
                </Tabs>

                {/* Common Fields */}
                <CommonFormFields />

                {/* Validation Alert */}
                {validationErrors.length > 0 && (
                  <ValidationAlert
                    errors={validationErrors}
                    onClose={clearValidationErrors}
                  />
                )}

                {/* Success/Error Alert */}
                {alert && (
                  <Alert
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert(null)}
                  />
                )}
              </div>
              
              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddOpen(false)}
                  className="w-full sm:w-auto text-sm"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddMember}
                  className="w-full sm:w-auto text-sm"
                >
                  Add Member
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Global Alert */}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by name or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 text-sm sm:text-base"
        />
      </div>

      {/* Member List - Mobile Cards */}
      {isMobile ? (
        <div className="space-y-4">
          {paginatedMembers.map((member) => (
            <MobileMemberCard
              key={member.id}
              member={member}
              currentLanguage={currentLanguage}
              onView={openViewModal}
              onEdit={openEditModal}
              onDelete={handleDeleteMember}
              onToggleStatus={handleToggleStatus}
              getText={getText}
            />
          ))}
        </div>
      ) : (
        /* Desktop Table */
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Council Members</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              All council members with their roles and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="overflow-x-auto">
              <table className="w-full table-auto border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm">Profile</th>
                    <th className="border px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm">Name</th>
                    <th className="border px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm">Role</th>
                    <th className="border px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm">Phone</th>
                    <th className="border px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm">Email</th>
                    <th className="border px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm">Status</th>
                    <th className="border px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                      <td className="border px-3 sm:px-4 py-2 sm:py-3">
                        <img src={member.profile} alt={getText(member.name)} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover" />
                      </td>
                      <td className="border px-3 sm:px-4 py-2 sm:py-3 font-medium text-xs sm:text-sm">{getText(member.name)}</td>
                      <td className="border px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">{getText(member.role)}</td>
                      <td className="border px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">{member.phone}</td>
                      <td className="border px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">{member.email}</td>
                      <td className="border px-3 sm:px-4 py-2 sm:py-3">
                        {member.enabled ? (
                          <span className="text-green-600 font-medium text-xs sm:text-sm">Enabled</span>
                        ) : (
                          <span className="text-gray-500 text-xs sm:text-sm">Disabled</span>
                        )}
                      </td>
                      <td className="border px-3 sm:px-4 py-2 sm:py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 text-xs">
                              <MoreVertical className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="text-xs sm:text-sm">
                            <DropdownMenuItem onClick={() => openViewModal(member)}>
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-2" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEditModal(member)}>
                              <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-2" /> Edit Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleStatus(member.id)}>
                              {member.enabled ? (
                                <>
                                  <ToggleLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-2" /> Disable
                                </>
                              ) : (
                                <>
                                  <ToggleRight className="w-3 h-3 sm:w-4 sm:h-4 mr-2" /> Enable
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteMember(member.id)} className="text-red-600">
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {filteredMembers.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
          <div className="text-xs sm:text-sm text-gray-600">
            Showing {paginatedMembers.length} of {filteredMembers.length} members
          </div>
          <div className="flex space-x-2">
            <Button 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(p => p - 1)}
              size="sm"
              className="text-xs"
            >
              Previous
            </Button>
            <span className="px-3 py-2 text-xs sm:text-sm flex items-center">
              Page {currentPage} of {totalPages || 1}
            </span>
            <Button 
              disabled={currentPage === totalPages || totalPages === 0} 
              onClick={() => setCurrentPage(p => p + 1)}
              size="sm"
              className="text-xs"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* View Modal with All Languages */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Member Details - All Languages</DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center space-x-4">
                <img src={selectedMember.profile} alt={getText(selectedMember.name)} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover" />
                <div>
                  <h3 className="text-lg sm:text-xl font-bold">{getText(selectedMember.name)}</h3>
                  <p className="text-gray-600 text-sm sm:text-lg">{getText(selectedMember.role)}</p>
                </div>
              </div>

              {/* Language Tabs for Details */}
              <Tabs defaultValue="english" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="english" className="text-xs sm:text-sm">English</TabsTrigger>
                  <TabsTrigger value="tamil" className="text-xs sm:text-sm">Tamil</TabsTrigger>
                  <TabsTrigger value="sinhala" className="text-xs sm:text-sm">Sinhala</TabsTrigger>
                </TabsList>
                
                {LANGUAGES.map(({ code, label }) => (
                  <TabsContent key={code} value={code} className="mt-4 sm:mt-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm sm:text-base">{selectedMember.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <span className="text-sm sm:text-base">{selectedMember.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-red-600 flex-shrink-0" />
                          <span className="text-sm sm:text-base">{selectedMember.address[code]}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-orange-600 flex-shrink-0" />
                          <span className="text-sm sm:text-base">Status: {selectedMember.enabled ? "Enabled" : "Disabled"}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 text-sm sm:text-base">Member's Message ({label})</h4>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-lg text-sm sm:text-base">"{selectedMember.message[code]}"</p>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewOpen(false)} className="w-full sm:w-auto text-sm">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={(open) => {
        setIsEditOpen(open);
        if (!open) {
          setAlert(null);
          clearValidationErrors();
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Edit Member Profile</DialogTitle>
            <p className="text-sm text-gray-600">
              Update the member details - names are required in all languages, other fields auto-fill
            </p>
          </DialogHeader>
          {selectedMember && (
            <div className="grid gap-4 sm:gap-6 py-4">
              {/* Language Tabs for Names Only */}
              <Tabs defaultValue="english" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="english" className="text-xs sm:text-sm">English</TabsTrigger>
                  <TabsTrigger value="tamil" className="text-xs sm:text-sm">Tamil</TabsTrigger>
                  <TabsTrigger value="sinhala" className="text-xs sm:text-sm">Sinhala</TabsTrigger>
                </TabsList>
                
                <TabsContent value="english" className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
                  <LanguageFormSection
                    language="english"
                    formData={formData}
                    onFormDataChange={setFormData}
                    validationErrors={validationErrors}
                  />
                </TabsContent>
                
                <TabsContent value="tamil" className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
                  <LanguageFormSection
                    language="tamil"
                    formData={formData}
                    onFormDataChange={setFormData}
                    validationErrors={validationErrors}
                  />
                </TabsContent>
                
                <TabsContent value="sinhala" className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
                  <LanguageFormSection
                    language="sinhala"
                    formData={formData}
                    onFormDataChange={setFormData}
                    validationErrors={validationErrors}
                  />
                </TabsContent>
              </Tabs>

              {/* Common Fields */}
              <CommonFormFields />

              {/* Validation Alert */}
              {validationErrors.length > 0 && (
                <ValidationAlert
                  errors={validationErrors}
                  onClose={clearValidationErrors}
                />
              )}

              {/* Success/Error Alert */}
              {alert && (
                <Alert
                  type={alert.type}
                  message={alert.message}
                  onClose={() => setAlert(null)}
                />
              )}
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsEditOpen(false)}
              className="w-full sm:w-auto text-sm"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleEditMember}
              className="w-full sm:w-auto text-sm"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}