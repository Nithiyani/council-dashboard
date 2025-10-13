"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Search, Eye, Edit, Trash2, MapPin, Phone, Mail, Calendar, Download, Image as ImageIcon, FileText, X, AlertCircle, CheckCircle, Star } from "lucide-react";

// Types
interface Service {
  id: string;
  title: {
    en: string;
    ta: string;
    si: string;
  };
  description: {
    en: string;
    ta: string;
    si: string;
  };
  category: string;
  location: string;
  phone: string;
  email: string;
  dateCreated: string;
  status: "active" | "inactive";
  images: string[];
  documents: string[];
  isFeatured: boolean;
}

interface ServiceFormData {
  title: {
    en: string;
    ta: string;
    si: string;
  };
  description: {
    en: string;
    ta: string;
    si: string;
  };
  category: string;
  location: string;
  phone: string;
  email: string;
  dateCreated: string;
  status: "active" | "inactive";
  images: string[];
  documents: string[];
  isFeatured: boolean;
}

type Language = "en" | "ta" | "si";

// Constants
const SERVICE_CATEGORIES = [
  "Healthcare",
  "Education",
  "Utilities",
  "Social Welfare",
  "Employment",
  "Housing",
  "Legal Aid",
  "Transportation",
  "Environmental",
  "Cultural"
];

const LANGUAGES: Language[] = ["en", "ta", "si"];
const LANGUAGE_NAMES = { en: "English", ta: "Tamil", si: "Sinhala" };

// Alert Component
const Alert = ({ type, message, onClose }: { type: "success" | "error"; message: string; onClose: () => void }) => {
  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
  const Icon = type === "success" ? CheckCircle : AlertCircle;

  return (
    <div className="mt-4 animate-in slide-in-from-top duration-300 z-50">
      <div className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2`}>
        <Icon className="w-5 h-5" />
        <span className="font-medium flex-1">{message}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-white hover:bg-white/20"
          onClick={onClose}
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};

// Validation Alert Component for Dialog (Modified to be placed at bottom)
const ValidationAlert = ({ errors }: { errors: { [key: string]: boolean } }) => {
  const errorFields = [];
  
  if (Object.keys(errors).length === 0) return null;

  // Check language fields
  LANGUAGES.forEach(lang => {
    if (errors[`title-${lang}`]) errorFields.push(`Title in ${LANGUAGE_NAMES[lang]}`);
    if (errors[`description-${lang}`]) errorFields.push(`Description in ${LANGUAGE_NAMES[lang]}`);
  });

  // Check other fields
  if (errors.category) errorFields.push("Category");
  if (errors.location) errorFields.push("Location");
  if (errors.phone) errorFields.push("Phone");
  if (errors.email) errorFields.push("Email");
  if (errors.dateCreated) errorFields.push("Date Created");
  if (errors.images) errorFields.push("Images");

  if (errorFields.length === 0) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-in fade-in duration-300">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-semibold text-red-800 mb-2">Required Fields Missing</h4>
          <p className="text-red-700 text-sm mb-2">
            Please fill in all required fields marked with * before creating the service.
          </p>
          <div className="text-red-600 text-sm">
            <p className="font-medium mb-1">Missing fields:</p>
            <ul className="list-disc list-inside space-y-1">
              {errorFields.map((field, index) => (
                <li key={index}>{field}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Service Card Component
const ServiceCard = ({ service, onView, onEdit, onDelete, onToggleFeature, language }: {
  service: Service;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFeature: () => void;
  language: Language;
}) => {
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric"
  });

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg font-semibold">
                {service.title[language]}
              </CardTitle>
              {service.isFeatured && (
                <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Featured</Badge>
              )}
              <Badge className={service.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                {service.status.toUpperCase()}
              </Badge>
            </div>
            
            <CardDescription className="text-sm text-gray-600 mb-3 line-clamp-2">
              {service.description[language]}
            </CardDescription>

            <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{service.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span>{service.phone}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(service.dateCreated)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="secondary">{service.category}</Badge>
              {service.images.length > 0 && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" />
                  {service.images.length}
                </Badge>
              )}
              {service.documents.length > 0 && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  {service.documents.length}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            {LANGUAGES.map(lang => (
              <Badge key={lang} variant="outline" className="text-xs">
                {lang.toUpperCase()}
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={onView}>
              <Eye className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={onEdit}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={onToggleFeature}>
              <Star className={`w-4 h-4 ${service.isFeatured ? "fill-yellow-400 text-yellow-400" : ""}`} />
            </Button>
            <Button variant="destructive" size="icon" onClick={onDelete}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// File Upload Components
const DocumentUpload = ({ documents, onDocumentsChange }: {
  documents: string[];
  onDocumentsChange: (documents: string[]) => void;
}) => {
  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type === "application/pdf" || file.type.includes("document")) {
        const reader = new FileReader();
        reader.onload = (e) => e.target?.result && onDocumentsChange([...documents, e.target.result as string]);
        reader.readAsDataURL(file);
      }
    });
  };

  const removeDocument = (index: number) => {
    onDocumentsChange(documents.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <Label>Upload Documents (PDF, DOC, DOCX)</Label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <Input type="file" multiple accept=".pdf,.doc,.docx" onChange={handleDocumentUpload} className="hidden" id="documents" />
        <Label htmlFor="documents" className="cursor-pointer flex flex-col items-center gap-2">
          <FileText className="w-8 h-8 text-gray-400" />
          <span className="text-sm text-gray-600">Choose Document</span>
          <span className="text-xs text-gray-500">PDF, DOC, or DOCX files</span>
        </Label>
      </div>

      {documents.length > 0 && (
        <div className="space-y-2">
          {documents.map((doc, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Document {index + 1}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeDocument(index)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ImageUpload = ({ images, onImagesChange, hasError }: {
  images: string[];
  onImagesChange: (images: string[]) => void;
  hasError?: boolean;
}) => {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: string[] = [];
    Array.from(files).slice(0, 6 - images.length).forEach(file => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newImages.push(e.target.result as string);
            if (newImages.length === Math.min(files.length, 6 - images.length)) {
              onImagesChange([...images, ...newImages]);
            }
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <Label className={hasError ? "text-red-600" : ""}>
        Upload Service Images (JPG, PNG) *
      </Label>
      <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
        hasError ? "border-red-300 bg-red-50" : "border-gray-300"
      }`}>
        <Input 
          type="file" 
          multiple 
          accept="image/*" 
          onChange={handleImageUpload} 
          className="hidden" 
          id="images" 
          disabled={images.length >= 6}
        />
        <Label 
          htmlFor="images" 
          className={`cursor-pointer flex flex-col items-center gap-2 ${images.length >= 6 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <ImageIcon className="w-8 h-8 text-gray-400" />
          <span className="text-sm text-gray-600">Choose Images</span>
          <span className="text-xs text-gray-500">Minimum 1, Maximum 6 images</span>
        </Label>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img src={image} alt={`Upload ${index + 1}`} className="w-full h-24 object-cover rounded-lg border" />
              <Button
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
      {images.length > 0 && (
        <p className="text-xs text-gray-500">
          {images.length}/6 images uploaded
        </p>
      )}
      {hasError && (
        <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          At least one image is required
        </p>
      )}
    </div>
  );
};

// Language Form Section with Validation
const LanguageFormSection = ({ 
  language, 
  isActive, 
  formData, 
  onFormDataChange, 
  validationErrors 
}: {
  language: Language;
  isActive: boolean;
  formData: ServiceFormData;
  onFormDataChange: (data: ServiceFormData) => void;
  validationErrors: { [key: string]: boolean };
}) => {
  if (!isActive) return null;

  const hasError = validationErrors[`title-${language}`] || validationErrors[`description-${language}`];

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className={`flex items-center gap-2 mb-4 p-3 rounded-lg ${
        hasError ? "bg-red-50 border border-red-200" : "bg-blue-50"
      }`}>
        {hasError ? (
          <AlertCircle className="w-4 h-4 text-red-600" />
        ) : (
          <CheckCircle className="w-4 h-4 text-blue-600" />
        )}
        <span className={`font-medium ${hasError ? "text-red-800" : "text-blue-800"}`}>
          Editing in {LANGUAGE_NAMES[language]} {hasError && "- Required fields missing"}
        </span>
      </div>

      <div>
        <Label 
          htmlFor={`title-${language}`}
          className={validationErrors[`title-${language}`] ? "text-red-600" : ""}
        >
          Service Title in {LANGUAGE_NAMES[language]} *
        </Label>
        <Input
          id={`title-${language}`}
          value={formData.title[language]}
          onChange={(e) => onFormDataChange({
            ...formData,
            title: { ...formData.title, [language]: e.target.value }
          })}
          placeholder={`Enter service title in ${LANGUAGE_NAMES[language]}`}
          className={`mt-1 ${
            validationErrors[`title-${language}`] 
              ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
              : ""
          }`}
        />
        {validationErrors[`title-${language}`] && (
          <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Title in {LANGUAGE_NAMES[language]} is required
          </p>
        )}
      </div>

      <div>
        <Label 
          htmlFor={`description-${language}`}
          className={validationErrors[`description-${language}`] ? "text-red-600" : ""}
        >
          Service Description in {LANGUAGE_NAMES[language]} *
        </Label>
        <Textarea
          id={`description-${language}`}
          value={formData.description[language]}
          onChange={(e) => onFormDataChange({
            ...formData,
            description: { ...formData.description, [language]: e.target.value }
          })}
          placeholder={`Enter detailed service description in ${LANGUAGE_NAMES[language]}...`}
          rows={4}
          className={`mt-1 ${
            validationErrors[`description-${language}`] 
              ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
              : ""
          }`}
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.description[language].length} characters
        </p>
        {validationErrors[`description-${language}`] && (
          <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Description in {LANGUAGE_NAMES[language]} is required
          </p>
        )}
      </div>
    </div>
  );
};

// Validation Helper
const validateServiceForm = (formData: ServiceFormData): { isValid: boolean; errors: { [key: string]: boolean } } => {
  const errors: { [key: string]: boolean } = {};
  let isValid = true;

  // Validate all three languages
  LANGUAGES.forEach(lang => {
    if (!formData.title[lang]?.trim()) {
      errors[`title-${lang}`] = true;
      isValid = false;
    }
    if (!formData.description[lang]?.trim()) {
      errors[`description-${lang}`] = true;
      isValid = false;
    }
  });

  // Validate category
  if (!formData.category.trim()) {
    errors.category = true;
    isValid = false;
  }

  // Validate location
  if (!formData.location.trim()) {
    errors.location = true;
    isValid = false;
  }

  // Validate phone
  if (!formData.phone.trim()) {
    errors.phone = true;
    isValid = false;
  }

  // Validate email
  if (!formData.email.trim()) {
    errors.email = true;
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = true;
    isValid = false;
  }

  // Validate date
  if (!formData.dateCreated.trim()) {
    errors.dateCreated = true;
    isValid = false;
  }

  // Validate images (minimum 1)
  if (formData.images.length === 0) {
    errors.images = true;
    isValid = false;
  }

  return { isValid, errors };
};

// Main Component
export default function ServicesManagementPage() {
  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      title: {
        en: "Community Health Center",
        ta: "சமூக சுகாதார மையம்",
        si: "සමුදාය සෞඛ්ය මධ්යස්ථානය"
      },
      description: {
        en: "Free medical checkups and basic healthcare services for community members. We provide comprehensive healthcare services including consultations, basic treatments, and health education programs.",
        ta: "சமூக உறுப்பினர்களுக்கு இலவச மருத்துவ பரிசோதனைகள் மற்றும் அடிப்படை சுகாதார சேவைகள். ஆலோசனைகள், அடிப்படை சிகிச்சைகள் மற்றும் சுகாதார கல்வி திட்டங்கள் உட்பட விரிவான சுகாதார சேவைகளை நாங்கள் வழங்குகிறோம்.",
        si: "ප්‍රජා සාමාජිකයින් සඳහා නොමිලේ වෛද්‍ය පරීක්ෂණ සහ මූලික සෞඛ්ය සේවා. අපි සැලසුම්කරණ, මූලික ප්‍රතිකර්ම සහ සෞඛ්ය අධ්‍යාපන වැඩසටහන් ඇතුළත් සවිස්තරාත්මක සෞඛ්ය සේවා ලබා දෙන්නෙමු."
      },
      category: "Healthcare",
      location: "123 Main Street, City Center",
      phone: "+94 11 234 5678",
      email: "health@community.org",
      dateCreated: "2024-01-15",
      status: "active",
      images: ["https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop"],
      documents: [],
      isFeatured: true
    },
    {
      id: "2",
      title: {
        en: "Adult Education Program",
        ta: "முதியோர் கல்வி திட்டம்",
        si: "වැඩිහිටි අධ්‍යාපන වැඩසටහන"
      },
      description: {
        en: "Free adult education classes including literacy, computer skills, and vocational training for community members above 18 years.",
        ta: "18 வயதுக்கு மேற்பட்ட சமூக உறுப்பினர்களுக்கு எழுத்தறிவு, கணினி திறன்கள் மற்றும் தொழில் பயிற்சி உட்பட இலவச முதியோர் கல்வி வகுப்புகள்.",
        si: "18 ට වැඩි ප්‍රජා සාමාජිකයින් සඳහා සාක්ෂරතාවය, පරිගණක කුසලතා සහ වෘත්තීය පුහුණුව ඇතුළත් නොමිලේ වැඩිහිටි අධ්‍යාපන පන්ති."
      },
      category: "Education",
      location: "456 Learning Avenue, Education Zone",
      phone: "+94 11 345 6789",
      email: "education@community.org",
      dateCreated: "2024-01-10",
      status: "active",
      images: ["https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300&h=200&fit=crop"],
      documents: [],
      isFeatured: false
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en");
  const [dialog, setDialog] = useState<"view" | "create" | "edit" | "delete" | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: boolean }>({});
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const initialFormData: ServiceFormData = {
    title: { en: "", ta: "", si: "" },
    description: { en: "", ta: "", si: "" },
    category: "",
    location: "",
    phone: "",
    email: "",
    dateCreated: new Date().toISOString().split('T')[0],
    status: "active",
    images: [],
    documents: [],
    isFeatured: false
  };

  const [formData, setFormData] = useState<ServiceFormData>(initialFormData);

  // Clear validation errors
  const clearValidationErrors = () => {
    setValidationErrors({});
  };

  // Filter services
  const filteredServices = services.filter(service => {
    const matchesSearch = Object.values(service.title).some(title =>
      title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesCategory = filterCategory === "all" || service.category === filterCategory;
    const matchesStatus = filterStatus === "all" || service.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Handlers
  const handleCreateService = () => {
    const { isValid, errors } = validateServiceForm(formData);
    
    if (!isValid) {
      setValidationErrors(errors);
      return;
    }

    const newService: Service = {
      id: (services.length + 1).toString(),
      ...formData
    };
    
    setServices([newService, ...services]);
    setDialog(null);
    setFormData(initialFormData);
    clearValidationErrors();
    
    setAlert({
      type: "success",
      message: "Service created successfully!"
    });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleEditService = () => {
    if (!selectedService) return;

    const { isValid, errors } = validateServiceForm(formData);
    
    if (!isValid) {
      setValidationErrors(errors);
      return;
    }

    setServices(prev => prev.map(service => 
      service.id === selectedService.id ? { ...selectedService, ...formData } : service
    ));
    
    setDialog(null);
    clearValidationErrors();
    
    setAlert({
      type: "success",
      message: "Service updated successfully!"
    });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleDeleteService = () => {
    if (!selectedService) return;
    setServices(prev => prev.filter(service => service.id !== selectedService.id));
    setDialog(null);
    
    setAlert({
      type: "success",
      message: "Service deleted successfully!"
    });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleToggleFeature = (id: string) => {
    setServices(prev => prev.map(service =>
      service.id === id ? { ...service, isFeatured: !service.isFeatured } : service
    ));
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric"
  });

  // Reset form and close dialog
  const handleCancel = () => {
    setDialog(null);
    setFormData(initialFormData);
    clearValidationErrors();
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Global Alert */}
      {alert && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Community Services Management</h1>
          <p className="text-gray-600 mt-1">Manage and organize community services efficiently</p>
        </div>
        <Dialog open={dialog === "create"} onOpenChange={(open) => {
          if (!open) {
            handleCancel();
          } else {
            setDialog("create");
            setFormData(initialFormData);
            clearValidationErrors();
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" /> Add New Service
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
              <DialogDescription>Fill in the details for the new service</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Language Tabs */}
              <div className="flex gap-2">
                {LANGUAGES.map(lang => (
                  <Button
                    key={lang}
                    type="button"
                    variant={currentLanguage === lang ? "default" : "outline"}
                    onClick={() => setCurrentLanguage(lang)}
                    className="flex-1"
                  >
                    {LANGUAGE_NAMES[lang]}
                  </Button>
                ))}
              </div>

              {/* Language-specific Fields */}
              {LANGUAGES.map(lang => (
                <LanguageFormSection
                  key={lang}
                  language={lang}
                  isActive={currentLanguage === lang}
                  formData={formData}
                  onFormDataChange={setFormData}
                  validationErrors={validationErrors}
                />
              ))}

              {/* Service Category */}
              <div>
                <Label 
                  htmlFor="category"
                  className={validationErrors.category ? "text-red-600" : ""}
                >
                  Service Category *
                </Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger 
                    id="category"
                    className={validationErrors.category ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                  >
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.category && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Category is required
                  </p>
                )}
              </div>

              {/* Contact Information */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold">Contact Information</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label 
                      htmlFor="location"
                      className={validationErrors.location ? "text-red-600" : ""}
                    >
                      Location *
                    </Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Enter location"
                      className={validationErrors.location ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                    />
                    {validationErrors.location && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Location is required
                      </p>
                    )}
                  </div>
                  <div>
                    <Label 
                      htmlFor="phone"
                      className={validationErrors.phone ? "text-red-600" : ""}
                    >
                      Phone *
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Enter phone"
                      className={validationErrors.phone ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                    />
                    {validationErrors.phone && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Phone is required
                      </p>
                    )}
                  </div>
                  <div>
                    <Label 
                      htmlFor="email"
                      className={validationErrors.email ? "text-red-600" : ""}
                    >
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter email"
                      className={validationErrors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                    />
                    {validationErrors.email && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Valid email is required
                      </p>
                    )}
                  </div>
                  <div>
                    <Label 
                      htmlFor="dateCreated"
                      className={validationErrors.dateCreated ? "text-red-600" : ""}
                    >
                      Date Created *
                    </Label>
                    <Input
                      id="dateCreated"
                      type="date"
                      value={formData.dateCreated}
                      onChange={(e) => setFormData({ ...formData, dateCreated: e.target.value })}
                      className={validationErrors.dateCreated ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                    />
                    {validationErrors.dateCreated && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Date is required
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Document Upload */}
              <div className="border-t pt-4">
                <DocumentUpload
                  documents={formData.documents}
                  onDocumentsChange={(documents) => setFormData({ ...formData, documents })}
                />
              </div>

              {/* Image Upload */}
              <div className="border-t pt-4">
                <ImageUpload
                  images={formData.images}
                  onImagesChange={(images) => setFormData({ ...formData, images })}
                  hasError={validationErrors.images}
                />
              </div>

              {/* Status Section */}
              <div className="border-t pt-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Switch
                    id="featured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                  />
                  <Label htmlFor="featured">Feature this service</Label>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: "active" | "inactive") => setFormData({ ...formData, status: value })}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Validation Alert moved to bottom near buttons */}
            {Object.keys(validationErrors).length > 0 && (
              <div className="mt-4">
                <ValidationAlert errors={validationErrors} />
              </div>
            )}

            <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-4">
              <Button variant="outline" onClick={handleCancel} className="sm:flex-1">Cancel</Button>
              <Button onClick={handleCreateService} className="sm:flex-1">Create Service</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search services by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {SERVICE_CATEGORIES.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Language:</span>
              <Select value={currentLanguage} onValueChange={(val: Language) => setCurrentLanguage(val)}>
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map(lang => (
                    <SelectItem key={lang} value={lang}>{LANGUAGE_NAMES[lang]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setFilterCategory("all");
                setFilterStatus("all");
              }}
              className="w-full md:w-auto"
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Showing {filteredServices.length} of {services.length} services
        </p>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {services.filter(s => s.isFeatured).length} Featured
          </Badge>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            {services.filter(s => s.status === "active").length} Active
          </Badge>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid gap-6">
        {filteredServices.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No services found matching your criteria.</p>
              <Button variant="outline" className="mt-4" onClick={() => {
                setSearchTerm("");
                setFilterCategory("all");
                setFilterStatus("all");
              }}>
                Clear filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredServices.map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              language={currentLanguage}
              onView={() => {
                setSelectedService(service);
                setDialog("view");
              }}
              onEdit={() => {
                setSelectedService(service);
                setFormData(service);
                setDialog("edit");
                clearValidationErrors();
              }}
              onDelete={() => {
                setSelectedService(service);
                setDialog("delete");
              }}
              onToggleFeature={() => handleToggleFeature(service.id)}
            />
          ))
        )}
      </div>

      {/* View Dialog */}
      {dialog === "view" && selectedService && (
        <Dialog open onOpenChange={() => setDialog(null)}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedService.title[currentLanguage]}
                {selectedService.isFeatured && (
                  <Badge className="bg-yellow-100 text-yellow-700">Featured</Badge>
                )}
              </DialogTitle>
              <DialogDescription>
                {selectedService.category} • Created on {formatDate(selectedService.dateCreated)}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Language Selector */}
              <div className="flex gap-2">
                {LANGUAGES.map(lang => (
                  <Button
                    key={lang}
                    size="sm"
                    variant={currentLanguage === lang ? "default" : "outline"}
                    onClick={() => setCurrentLanguage(lang)}
                  >
                    {LANGUAGE_NAMES[lang]}
                  </Button>
                ))}
              </div>

              {/* Images */}
              {selectedService.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedService.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Service image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                  ))}
                </div>
              )}

              {/* Description */}
              <div>
                <h4 className="font-semibold mb-2">Service Description</h4>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedService.description[currentLanguage]}
                </p>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Contact Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{selectedService.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{selectedService.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span>{selectedService.email}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Service Details</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <Badge variant="secondary">{selectedService.category}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge className={selectedService.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                        {selectedService.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date Created:</span>
                      <span>{formatDate(selectedService.dateCreated)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Featured:</span>
                      <span>{selectedService.isFeatured ? "Yes" : "No"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents */}
              {selectedService.documents.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Documents</h4>
                  <div className="space-y-2">
                    {selectedService.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">Document {index + 1}</span>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialog(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Dialog */}
      {dialog === "edit" && selectedService && (
        <Dialog open onOpenChange={(open) => {
          if (!open) {
            handleCancel();
          }
        }}>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Service</DialogTitle>
              <DialogDescription>Update the service details</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Language Tabs */}
              <div className="flex gap-2">
                {LANGUAGES.map(lang => (
                  <Button
                    key={lang}
                    type="button"
                    variant={currentLanguage === lang ? "default" : "outline"}
                    onClick={() => setCurrentLanguage(lang)}
                    className="flex-1"
                  >
                    {LANGUAGE_NAMES[lang]}
                  </Button>
                ))}
              </div>

              {/* Language-specific Fields */}
              {LANGUAGES.map(lang => (
                <LanguageFormSection
                  key={lang}
                  language={lang}
                  isActive={currentLanguage === lang}
                  formData={formData}
                  onFormDataChange={setFormData}
                  validationErrors={validationErrors}
                />
              ))}

              {/* Service Category */}
              <div>
                <Label 
                  htmlFor="edit-category"
                  className={validationErrors.category ? "text-red-600" : ""}
                >
                  Service Category *
                </Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger 
                    id="edit-category"
                    className={validationErrors.category ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                  >
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.category && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Category is required
                  </p>
                )}
              </div>

              {/* Contact Information */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold">Contact Information</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label 
                      htmlFor="edit-location"
                      className={validationErrors.location ? "text-red-600" : ""}
                    >
                      Location *
                    </Label>
                    <Input
                      id="edit-location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className={validationErrors.location ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                    />
                    {validationErrors.location && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Location is required
                      </p>
                    )}
                  </div>
                  <div>
                    <Label 
                      htmlFor="edit-phone"
                      className={validationErrors.phone ? "text-red-600" : ""}
                    >
                      Phone *
                    </Label>
                    <Input
                      id="edit-phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={validationErrors.phone ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                    />
                    {validationErrors.phone && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Phone is required
                      </p>
                    )}
                  </div>
                  <div>
                    <Label 
                      htmlFor="edit-email"
                      className={validationErrors.email ? "text-red-600" : ""}
                    >
                      Email *
                    </Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={validationErrors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                    />
                    {validationErrors.email && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Valid email is required
                      </p>
                    )}
                  </div>
                  <div>
                    <Label 
                      htmlFor="edit-date"
                      className={validationErrors.dateCreated ? "text-red-600" : ""}
                    >
                      Date Created *
                    </Label>
                    <Input
                      id="edit-date"
                      type="date"
                      value={formData.dateCreated}
                      onChange={(e) => setFormData({ ...formData, dateCreated: e.target.value })}
                      className={validationErrors.dateCreated ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                    />
                    {validationErrors.dateCreated && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Date is required
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Document Upload */}
              <div className="border-t pt-4">
                <DocumentUpload
                  documents={formData.documents}
                  onDocumentsChange={(documents) => setFormData({ ...formData, documents })}
                />
              </div>

              {/* Image Upload */}
              <div className="border-t pt-4">
                <ImageUpload
                  images={formData.images}
                  onImagesChange={(images) => setFormData({ ...formData, images })}
                  hasError={validationErrors.images}
                />
              </div>

              {/* Status Section */}
              <div className="border-t pt-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Switch
                    id="edit-featured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                  />
                  <Label htmlFor="edit-featured">Feature this service</Label>
                </div>

                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: "active" | "inactive") => setFormData({ ...formData, status: value })}>
                    <SelectTrigger id="edit-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Validation Alert moved to bottom near buttons */}
            {Object.keys(validationErrors).length > 0 && (
              <div className="mt-4">
                <ValidationAlert errors={validationErrors} />
              </div>
            )}

            <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-4">
              <Button variant="outline" onClick={handleCancel} className="sm:flex-1">Cancel</Button>
              <Button onClick={handleEditService} className="sm:flex-1">Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Dialog */}
      {dialog === "delete" && selectedService && (
        <Dialog open onOpenChange={() => setDialog(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedService.title.en}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialog(null)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDeleteService}>Delete Service</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}