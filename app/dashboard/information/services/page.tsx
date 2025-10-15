"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, X, Image as ImageIcon, Plus, Upload, MapPin, Search, Eye, Edit, Trash2, Star, CalendarIcon } from "lucide-react";

// Types
interface Service {
  id: string;
  serviceName: {
    en: string;
    ta: string;
    si: string;
  };
  serviceDesc: {
    en: string;
    ta: string;
    si: string;
  };
  serviceNote: {
    en: string;
    ta: string;
    si: string;
  };
  location: {
    district: string;
    division: string;
    gsDivision: string;
  };
  images: {
    main: string;
    before: string;
    after: string;
    gallery: string[];
  };
  status: "active" | "inactive";
  // isFeatured: boolean;
  dateCreated: string;
  serviceDate?: string;
}

interface ServiceFormData {
  serviceName: {
    en: string;
    ta: string;
    si: string;
  };
  serviceDesc: {
    en: string;
    ta: string;
    si: string;
  };
  serviceNote: {
    en: string;
    ta: string;
    si: string;
  };
  location: {
    district: string;
    division: string;
    gsDivision: string;
  };
  images: {
    main: File | null;
    before: File | null;
    after: File | null;
    gallery: File[];
  };
  status: "active" | "inactive";
  // isFeatured: boolean;
  serviceDate?: string;
}

type Language = "en" | "ta" | "si";
type ImageType = "main" | "before" | "after" | "gallery";

// Constants
const LANGUAGES: Language[] = ["en", "ta", "si"];
const LANGUAGE_NAMES = { 
  en: "English", 
  ta: "Tamil", 
  si: "Sinhala" 
};

const DISTRICTS = [
  "Mannar"
];

const MANNAR_DIVISIONS = [
  "Mannar",
  "Nanattan", 
  "Manthai West",
  "Musali",
  "Madhu"
];

const GS_DIVISIONS: Record<string, string[]> = {
  "Mannar": ["GS Division 1", "GS Division 2", "GS Division 3"],
  "Nanattan": ["GS Division 4", "GS Division 5", "GS Division 6"],
  "Manthai West": ["GS Division 7", "GS Division 8", "GS Division 9"],
  "Musali": ["GS Division 10", "GS Division 11", "GS Division 12"],
  "Madhu": ["GS Division 13", "GS Division 14", "GS Division 15"]
};

// Alert Component
const Alert = ({ type, message, onClose }: { type: "success" | "error"; message: string; onClose: () => void }) => {
  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
  const Icon = type === "success" ? CheckCircle : AlertCircle;

  return (
    <div className="mt-4 animate-in slide-in-from-top duration-300">
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

// Image Upload Component with Preview
const ImageUploadField = ({ 
  label, 
  type, 
  image, 
  onImageChange, 
  isMultiple = false,
  isRequired = false,
  hasError = false
}: {
  label: string;
  type: ImageType;
  image: File | File[] | null;
  onImageChange: (type: ImageType, files: File | File[] | null) => void;
  isMultiple?: boolean;
  isRequired?: boolean;
  hasError?: boolean;
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    if (isMultiple) {
      const newFiles = Array.from(files);
      const currentFiles = Array.isArray(image) ? image : [];
      onImageChange(type, [...currentFiles, ...newFiles]);
    } else {
      onImageChange(type, files[0]);
    }
  };

  const removeImage = (index?: number) => {
    if (isMultiple && Array.isArray(image)) {
      if (index !== undefined) {
        const newFiles = image.filter((_, i) => i !== index);
        onImageChange(type, newFiles.length > 0 ? newFiles : null);
      } else {
        onImageChange(type, null);
      }
    } else {
      onImageChange(type, null);
    }
  };

  const getPreviewUrl = (file: File) => URL.createObjectURL(file);

  return (
    <div className="space-y-3">
      <Label className={`flex items-center gap-2 ${hasError ? "text-red-600" : ""}`}>
        {label}
        {isRequired && <span className="text-red-500">*</span>}
      </Label>
      
      <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
        hasError ? "border-red-300 bg-red-50" : "border-gray-300"
      }`}>
        <Input 
          type="file" 
          multiple={isMultiple}
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id={`image-${type}`}
        />
        <Label 
          htmlFor={`image-${type}`}
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          <Upload className="w-8 h-8 text-gray-400" />
          <span className="text-sm text-gray-600">
            {isMultiple ? "Choose Images" : "Choose Image"}
          </span>
          <span className="text-xs text-gray-500">
            {isMultiple ? "Multiple images allowed" : "JPG, PNG, WebP"}
          </span>
        </Label>
      </div>

      {hasError && (
        <p className="text-red-600 text-sm flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {label} is required
        </p>
      )}

      {/* Image Previews */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {!isMultiple && image && (
          <div className="relative group">
            <img 
              src={getPreviewUrl(image as File)} 
              alt="Preview" 
              className="w-full h-24 object-cover rounded-lg border"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeImage()}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        )}
        
        {isMultiple && Array.isArray(image) && image.map((file, index) => (
          <div key={index} className="relative group">
            <img 
              src={getPreviewUrl(file)} 
              alt={`Gallery ${index + 1}`} 
              className="w-full h-24 object-cover rounded-lg border"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeImage(index)}
            >
              <X className="w-3 h-3" />
            </Button>
            <Badge variant="secondary" className="absolute bottom-1 left-1 text-xs">
              {index + 1}
            </Badge>
          </div>
        ))}
      </div>

      {/* Image Count for Gallery */}
      {isMultiple && Array.isArray(image) && (
        <p className="text-xs text-gray-500">
          {image.length} image{image.length !== 1 ? 's' : ''} selected
        </p>
      )}
    </div>
  );
};

// Location Selection Component
const LocationSelection = ({ 
  location, 
  onLocationChange,
  validationErrors
}: {
  location: ServiceFormData['location'];
  onLocationChange: (location: ServiceFormData['location']) => void;
  validationErrors: { [key: string]: boolean };
}) => {
  const availableGSDivisions = location.division ? GS_DIVISIONS[location.division] || [] : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
        <MapPin className="w-5 h-5" />
        <span>Step 1: Select Location</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* District Selection - Fixed as Mannar */}
        <div>
          <Label htmlFor="district" className="flex items-center gap-2">
            District
            <span className="text-red-500">*</span>
          </Label>
          <Select 
            value={location.district} 
            onValueChange={(value) => onLocationChange({ 
              district: value, 
              division: "", 
              gsDivision: "" 
            })}
          >
            <SelectTrigger id="district" className={validationErrors.district ? "border-red-500" : ""}>
              <SelectValue placeholder="Select District" />
            </SelectTrigger>
            <SelectContent>
              {DISTRICTS.map(district => (
                <SelectItem key={district} value={district}>
                  {district}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {validationErrors.district && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              District is required
            </p>
          )}
        </div>

        {/* Division Selection */}
        <div>
          <Label htmlFor="division" className="flex items-center gap-2">
            Division
            <span className="text-red-500">*</span>
          </Label>
          <Select 
            value={location.division} 
            onValueChange={(value) => onLocationChange({ 
              ...location, 
              division: value, 
              gsDivision: "" 
            })}
            disabled={!location.district}
          >
            <SelectTrigger id="division" className={validationErrors.division ? "border-red-500" : ""}>
              <SelectValue placeholder="Select Division" />
            </SelectTrigger>
            <SelectContent>
              {MANNAR_DIVISIONS.map(division => (
                <SelectItem key={division} value={division}>
                  {division}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {validationErrors.division && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Division is required
            </p>
          )}
        </div>

        {/* GS Division Selection */}
        <div>
          <Label htmlFor="gsDivision" className="flex items-center gap-2">
            GS Division
            <span className="text-red-500">*</span>
          </Label>
          <Select 
            value={location.gsDivision} 
            onValueChange={(value) => onLocationChange({ 
              ...location, 
              gsDivision: value 
            })}
            disabled={!location.division}
          >
            <SelectTrigger id="gsDivision" className={validationErrors.gsDivision ? "border-red-500" : ""}>
              <SelectValue placeholder="Select GS Division" />
            </SelectTrigger>
            <SelectContent>
              {availableGSDivisions.map(gsDivision => (
                <SelectItem key={gsDivision} value={gsDivision}>
                  {gsDivision}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {validationErrors.gsDivision && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              GS Division is required
            </p>
          )}
        </div>
      </div>

      {/* Selected Location Summary */}
      {location.district && location.division && location.gsDivision && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-sm text-blue-800">
            <CheckCircle className="w-4 h-4" />
            <span>Selected Location:</span>
            <Badge variant="outline" className="bg-white">
              {location.district} / {location.division} / {location.gsDivision}
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
};

// Language Input Section
const LanguageInputSection = ({ 
  language,
  formData,
  onFormDataChange,
  validationErrors
}: {
  language: Language;
  formData: ServiceFormData;
  onFormDataChange: (data: ServiceFormData) => void;
  validationErrors: { [key: string]: boolean };
}) => {
  return (
    <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
      <div className="flex items-center gap-2 mb-4">
        <Badge variant="secondary" className="text-sm">
          {LANGUAGE_NAMES[language]}
        </Badge>
        {(validationErrors[`serviceName-${language}`] || validationErrors[`serviceDesc-${language}`]) && (
          <AlertCircle className="w-4 h-4 text-red-500" />
        )}
      </div>

      {/* Service Name */}
      <div>
        <Label 
          htmlFor={`serviceName-${language}`}
          className="flex items-center gap-2"
        >
          Service Name
          <span className="text-red-500">*</span>
        </Label>
        <Input
          id={`serviceName-${language}`}
          value={formData.serviceName[language]}
          onChange={(e) => onFormDataChange({
            ...formData,
            serviceName: { ...formData.serviceName, [language]: e.target.value }
          })}
          placeholder={`Enter service name in ${LANGUAGE_NAMES[language]}`}
          className={`mt-1 ${
            validationErrors[`serviceName-${language}`] 
              ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
              : ""
          }`}
        />
        {validationErrors[`serviceName-${language}`] && (
          <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Service name in {LANGUAGE_NAMES[language]} is required
          </p>
        )}
      </div>

      {/* Service Description */}
      <div>
        <Label 
          htmlFor={`serviceDesc-${language}`}
          className="flex items-center gap-2"
        >
          Service Description
          <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id={`serviceDesc-${language}`}
          value={formData.serviceDesc[language]}
          onChange={(e) => onFormDataChange({
            ...formData,
            serviceDesc: { ...formData.serviceDesc, [language]: e.target.value }
          })}
          placeholder={`Enter service description in ${LANGUAGE_NAMES[language]}...`}
          rows={4}
          className={`mt-1 ${
            validationErrors[`serviceDesc-${language}`] 
              ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
              : ""
          }`}
        />
        {validationErrors[`serviceDesc-${language}`] && (
          <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Service description in {LANGUAGE_NAMES[language]} is required
          </p>
        )}
      </div>

      {/* Additional Notes */}
      <div>
        <Label htmlFor={`serviceNote-${language}`}>
          Additional Notes (Optional)
        </Label>
        <Textarea
          id={`serviceNote-${language}`}
          value={formData.serviceNote[language]}
          onChange={(e) => onFormDataChange({
            ...formData,
            serviceNote: { ...formData.serviceNote, [language]: e.target.value }
          })}
          placeholder={`Enter additional notes in ${LANGUAGE_NAMES[language]}...`}
          rows={3}
          className="mt-1"
        />
        <p className="text-xs text-gray-500 mt-1">
          Optional information about the service
        </p>
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
  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric"
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            {/* <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg font-semibold">
                {service.serviceName[language]}
              </CardTitle>
              {service.isFeatured && (
                <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Featured</Badge>
              )}
              <Badge className={service.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                {service.status.toUpperCase()}
              </Badge>
            </div> */}
            
            <CardDescription className="text-sm text-gray-600 mb-3 line-clamp-2">
              {service.serviceDesc[language]}
            </CardDescription>

            <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{service.location.district} / {service.location.division}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>{formatDate(service.dateCreated)}</span>
              </div>
              {service.serviceDate && (
                <div className="flex items-center gap-1">
                  <CalendarIcon className="w-3 h-3" />
                  <span>{formatDate(service.serviceDate)}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="secondary">GS: {service.location.gsDivision}</Badge>
              {service.images.main && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" />
                  Main
                </Badge>
              )}
              {service.images.gallery.length > 0 && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" />
                  {service.images.gallery.length} gallery
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
            {/* <Button variant="outline" size="icon" onClick={onToggleFeature}>
              <Star className={`w-4 h-4 ${service.isFeatured ? "fill-yellow-400 text-yellow-400" : ""}`} />
            </Button> */}
            <Button variant="destructive" size="icon" onClick={onDelete}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Validation Alert Component
const ValidationAlert = ({ errors, currentStep }: { errors: { [key: string]: boolean }; currentStep: number }) => {
  const errorFields = [];
  
  if (Object.keys(errors).length === 0) return null;

  // Step 1 errors
  if (currentStep === 1) {
    if (errors.district) errorFields.push("District");
    if (errors.division) errorFields.push("Division");
    if (errors.gsDivision) errorFields.push("GS Division");
  }

  // Step 2 & 3 errors
  if (currentStep === 2 || currentStep === 3) {
    LANGUAGES.forEach(lang => {
      if (errors[`serviceName-${lang}`]) errorFields.push(`Service Name in ${LANGUAGE_NAMES[lang]}`);
      if (errors[`serviceDesc-${lang}`]) errorFields.push(`Service Description in ${LANGUAGE_NAMES[lang]}`);
    });
  }

  // Step 4 errors
  if (currentStep === 4) {
    if (errors.mainImage) errorFields.push("Main Service Image");
    // if (errors.beforeImage) errorFields.push("Before Image");
    // if (errors.afterImage) errorFields.push("After Image");
  }

  if (errorFields.length === 0) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-in fade-in duration-300">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-semibold text-red-800 mb-2">Required Fields Missing</h4>
          <p className="text-red-700 text-sm mb-2">
            Please fill in all required fields marked with * before proceeding.
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

// Date Input Component (Simple alternative to Calendar)
const DateInputField = ({ 
  label, 
  date, 
  onDateChange,
  isRequired = false,
  hasError = false
}: {
  label: string;
  date: string;
  onDateChange: (date: string) => void;
  isRequired?: boolean;
  hasError?: boolean;
}) => {
  return (
    <div className="space-y-3">
      <Label className={`flex items-center gap-2 ${hasError ? "text-red-600" : ""}`}>
        {label}
        {isRequired && <span className="text-red-500">*</span>}
      </Label>
      
      <div className="flex items-center gap-3">
        <Input
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          className={`flex-1 ${hasError ? "border-red-500" : ""}`}
        />
        <CalendarIcon className="w-5 h-5 text-gray-400" />
      </div>

      {hasError && (
        <p className="text-red-600 text-sm flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {label} is required
        </p>
      )}
    </div>
  );
};

// Main Services Management Page
export default function ServicesManagementPage() {
  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      serviceName: {
        en: "Community Health Center",
        ta: "சமூக சுகாதார மையம்",
        si: "සමුදාය සෞඛ්ය මධ්යස්ථානය"
      },
      serviceDesc: {
        en: "Free medical checkups and basic healthcare services for community members.",
        ta: "சமூக உறுப்பினர்களுக்கு இலவச மருத்துவ பரிசோதனைகள் மற்றும் அடிப்படை சுகாதார சேவைகள்.",
        si: "ප්‍රජා සාමාජිකයින් සඳහා නොමිලේ වෛද්‍ය පරීක්ෂණ සහ මූලික සෞඛ්ය සේවා."
      },
      serviceNote: {
        en: "Open Monday to Friday, 8 AM to 5 PM",
        ta: "திங்கள் முதல் வெள்ளி வரை, காலை 8 மணி முதல் மாலை 5 மணி வரை திறந்திருக்கும்",
        si: "සඳුදා සිට සිකුරාදා දක්වා, උදේ 8 සිට 5 දක්වා විවෘතයි"
      },
      location: {
        district: "Mannar",
        division: "Mannar",
        gsDivision: "GS Division 1"
      },
      images: {
        main: "/images/health-center.jpg",
        before: "/images/before-health.jpg",
        after: "/images/after-health.jpg",
        gallery: ["/images/health-1.jpg", "/images/health-2.jpg"]
      },
      status: "active",
      // isFeatured: true,
      dateCreated: "2024-01-15",
      serviceDate: "2024-02-01"
    },
    {
      id: "2",
      serviceName: {
        en: "Adult Education Program",
        ta: "முதியோர் கல்வி திட்டம்",
        si: "වැඩිහිටි අධ්‍යාපන වැඩසටහන"
      },
      serviceDesc: {
        en: "Free adult education classes including literacy and vocational training.",
        ta: "எழுத்தறிவு மற்றும் தொழில் பயிற்சி உட்பட இலவச முதியோர் கல்வி வகுப்புகள்.",
        si: "සාක්ෂරතාවය සහ වෘත්තීය පුහුණුව ඇතුළත් නොමිලේ වැඩිහිටි අධ්‍යාපන පන්ති."
      },
      serviceNote: {
        en: "Weekend classes available",
        ta: "வார இறுதி வகுப்புகள் கிடைக்கின்றன",
        si: "සති අන්ත පන්ති ලබා ගත හැක"
      },
      location: {
        district: "Mannar",
        division: "Nanattan",
        gsDivision: "GS Division 4"
      },
      images: {
        main: "/images/education-program.jpg",
        before: "/images/before-education.jpg",
        after: "/images/after-education.jpg",
        gallery: []
      },
      status: "active",
      // isFeatured: false,
      dateCreated: "2024-01-10",
      serviceDate: "2024-02-15"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDivision, setFilterDivision] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en");
  const [dialog, setDialog] = useState<"view" | "create" | "edit" | "delete" | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: boolean }>({});
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const initialFormData: ServiceFormData = {
    serviceName: { en: "", ta: "", si: "" },
    serviceDesc: { en: "", ta: "", si: "" },
    serviceNote: { en: "", ta: "", si: "" },
    location: {
      district: "Mannar",
      division: "",
      gsDivision: ""
    },
    images: {
      main: null,
      before: null,
      after: null,
      gallery: []
    },
    status: "active",
    // isFeatured: false,
    serviceDate: ""
  };

  const [formData, setFormData] = useState<ServiceFormData>(initialFormData);

  // Clear validation errors
  const clearValidationErrors = () => {
    setValidationErrors({});
  };

  // Filter services
  const filteredServices = services.filter(service => {
    const matchesSearch = Object.values(service.serviceName).some(name =>
      name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesDivision = filterDivision === "all" || service.location.division === filterDivision;
    const matchesStatus = filterStatus === "all" || service.status === filterStatus;
    
    return matchesSearch && matchesDivision && matchesStatus;
  });

  // Handle image uploads
  const handleImageChange = (type: ImageType, files: File | File[] | null) => {
    setFormData(prev => ({
      ...prev,
      images: {
        ...prev.images,
        [type]: files
      }
    }));
  };

  // Validation function - FIXED VERSION
  const validateForm = (step: number): boolean => {
    const errors: { [key: string]: boolean } = {};

    // Step 1: Location validation
    if (step === 1) {
      if (!formData.location.district) errors.district = true;
      if (!formData.location.division) errors.division = true;
      if (!formData.location.gsDivision) errors.gsDivision = true;
    }

    // Step 2: Service details validation
    if (step === 2) {
      // Step 2 doesn't have required fields currently, only optional service date
      // No validation needed for step 2
    }

    // Step 3: Service content validation
    if (step === 3) {
      LANGUAGES.forEach(lang => {
        if (!formData.serviceName[lang]?.trim()) {
          errors[`serviceName-${lang}`] = true;
        }
        if (!formData.serviceDesc[lang]?.trim()) {
          errors[`serviceDesc-${lang}`] = true;
        }
      });
    }

    // Step 4: Image validation
    if (step === 4) {
      if (!formData.images.main) errors.mainImage = true;
      // if (!formData.images.before) errors.beforeImage = true;
      // if (!formData.images.after) errors.afterImage = true;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleCreateService = () => {
    // Validate all steps before final submission
    let allValid = true;
    const allErrors: { [key: string]: boolean } = {};

    // Validate step 1
    if (!formData.location.district) { allErrors.district = true; allValid = false; }
    if (!formData.location.division) { allErrors.division = true; allValid = false; }
    if (!formData.location.gsDivision) { allErrors.gsDivision = true; allValid = false; }

    // Validate step 3
    LANGUAGES.forEach(lang => {
      if (!formData.serviceName[lang]?.trim()) { 
        allErrors[`serviceName-${lang}`] = true; allValid = false; 
      }
      if (!formData.serviceDesc[lang]?.trim()) { 
        allErrors[`serviceDesc-${lang}`] = true; allValid = false; 
      }
    });

    // Validate step 4
    if (!formData.images.main) { allErrors.mainImage = true; allValid = false; }
    // if (!formData.images.before) { allErrors.beforeImage = true; allValid = false; }
    // if (!formData.images.after) { allErrors.afterImage = true; allValid = false; }

    setValidationErrors(allErrors);

    if (!allValid) {
      setAlert({
        type: "error",
        message: "Please fill in all required fields before submitting."
      });
      return;
    }

    const newService: Service = {
      id: (services.length + 1).toString(),
      serviceName: formData.serviceName,
      serviceDesc: formData.serviceDesc,
      serviceNote: formData.serviceNote,
      location: formData.location,
      images: {
        main: formData.images.main ? URL.createObjectURL(formData.images.main) : "",
        before: formData.images.before ? URL.createObjectURL(formData.images.before) : "",
        after: formData.images.after ? URL.createObjectURL(formData.images.after) : "",
        gallery: formData.images.gallery.map(file => URL.createObjectURL(file))
      },
      status: formData.status,
      // isFeatured: formData.isFeatured,
      dateCreated: new Date().toISOString().split('T')[0],
      serviceDate: formData.serviceDate || undefined
    };
    
    setServices([newService, ...services]);
    setDialog(null);
    setFormData(initialFormData);
    setCurrentStep(1);
    clearValidationErrors();
    
    setAlert({
      type: "success",
      message: "Service created successfully!"
    });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleEditService = () => {
    if (!selectedService) return;

    // Validate all steps before final submission for edit
    let allValid = true;
    const allErrors: { [key: string]: boolean } = {};

    // Validate step 1
    if (!formData.location.district) { allErrors.district = true; allValid = false; }
    if (!formData.location.division) { allErrors.division = true; allValid = false; }
    if (!formData.location.gsDivision) { allErrors.gsDivision = true; allValid = false; }

    // Validate step 3
    LANGUAGES.forEach(lang => {
      if (!formData.serviceName[lang]?.trim()) { 
        allErrors[`serviceName-${lang}`] = true; allValid = false; 
      }
      if (!formData.serviceDesc[lang]?.trim()) { 
        allErrors[`serviceDesc-${lang}`] = true; allValid = false; 
      }
    });

    setValidationErrors(allErrors);

    if (!allValid) {
      setAlert({
        type: "error",
        message: "Please fill in all required fields before updating."
      });
      return;
    }

    setServices(prev => prev.map(service => 
      service.id === selectedService.id ? { 
        ...service,
        serviceName: formData.serviceName,
        serviceDesc: formData.serviceDesc,
        serviceNote: formData.serviceNote,
        location: formData.location,
        status: formData.status,
        // isFeatured: formData.isFeatured,
        serviceDate: formData.serviceDate || undefined
      } : service
    ));
    
    setDialog(null);
    setCurrentStep(1);
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

  // const handleToggleFeature = (id: string) => {
  //   setServices(prev => prev.map(service =>
  //     service.id === id ? { ...service, isFeatured: !service.isFeatured } : service
  //   ));
  // };

  // Navigation between steps - FIXED VERSION
  const nextStep = () => {
    if (validateForm(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
      clearValidationErrors();
    } else {
      setAlert({
        type: "error",
        message: "Please fill in all required fields before proceeding."
      });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    clearValidationErrors();
  };

  // Reset form and close dialog
  const handleCancel = () => {
    setDialog(null);
    setFormData(initialFormData);
    setCurrentStep(1);
    clearValidationErrors();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric"
    });
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
              <DialogDescription>Follow the steps to add a new community service</DialogDescription>
            </DialogHeader>

            {/* Progress Steps */}
            <div className="flex justify-between items-center mb-6">
              {[1, 2, 3, 4, 5].map(step => (
                <div key={step} className="flex flex-col items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === currentStep 
                      ? "bg-blue-600 text-white" 
                      : step < currentStep 
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}>
                    {step < currentStep ? "✓" : step}
                  </div>
                  <span className="text-xs mt-1 text-gray-600 text-center">
                    {step === 1 && "Location"}
                    {step === 2 && "Details"}
                    {step === 3 && "Content"}
                    {step === 4 && "Images"}
                    {step === 5 && "Submit"}
                  </span>
                </div>
              ))}
            </div>

            {/* Step 1: Location Selection */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <LocationSelection
                  location={formData.location}
                  onLocationChange={(location) => setFormData(prev => ({ ...prev, location }))}
                  validationErrors={validationErrors}
                />
              </div>
            )}

            {/* Step 2: Service Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                  <span>Step 2: Service Details</span>
                </div>
                
                {/* Service Date */}
                <DateInputField
                  label="Service Date"
                  date={formData.serviceDate || ""}
                  onDateChange={(date) => setFormData(prev => ({ ...prev, serviceDate: date }))}
                />

                {/* Status and Featured */}
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                  <div>
                    <Label htmlFor="status" className="flex items-center gap-2">
                      Status
                      <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value: "active" | "inactive") => 
                        setFormData(prev => ({ ...prev, status: value }))
                      }
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="isFeatured" className="flex items-center gap-2 cursor-pointer">
                      <Star className="w-4 h-4 text-yellow-500" />
                      Feature this service
                    </Label>
                  </div> */}
                </div>
              </div>
            )}

            {/* Step 3: Service Content in 3 languages */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                  <span>Step 3: Service Content</span>
                </div>
                
                <Tabs defaultValue="en" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    {LANGUAGES.map(lang => (
                      <TabsTrigger key={lang} value={lang}>
                        {LANGUAGE_NAMES[lang]}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {LANGUAGES.map(lang => (
                    <TabsContent key={lang} value={lang}>
                      <LanguageInputSection
                        language={lang}
                        formData={formData}
                        onFormDataChange={setFormData}
                        validationErrors={validationErrors}
                      />
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            )}

            {/* Step 4: Image Uploads */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                  <ImageIcon className="w-5 h-5" />
                  <span>Step 4: Upload Images</span>
                </div>

                <div className="space-y-6">
                  {/* Main Service Image */}
                  <ImageUploadField
                    label="Main Service Image"
                    type="main"
                    image={formData.images.main}
                    onImageChange={handleImageChange}
                    isRequired={true}
                    hasError={validationErrors.mainImage}
                  />

                  {/* Before and After Images */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ImageUploadField
                      label="Before Image"
                      type="before"
                      image={formData.images.before}
                      onImageChange={handleImageChange}
                      // isRequired={true}
                      // hasError={validationErrors.beforeImage}
                    />
                    <ImageUploadField
                      label="After Image"
                      type="after"
                      image={formData.images.after}
                      onImageChange={handleImageChange}
                      // isRequired={true}
                      // hasError={validationErrors.afterImage}
                    />
                  </div>

                  {/* Gallery Images */}
                  <ImageUploadField
                    label="Gallery Images (Multiple)"
                    type="gallery"
                    image={formData.images.gallery}
                    onImageChange={handleImageChange}
                    isMultiple={true}
                  />
                </div>
              </div>
            )}

            {/* Step 5: Review and Submit */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                  <span>Step 5: Review and Submit</span>
                </div>

                {/* Service Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Service Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Location */}
                    <div>
                      <Label className="font-semibold">Location</Label>
                      <p className="text-sm text-gray-600">
                        {formData.location.district} / {formData.location.division} / {formData.location.gsDivision}
                      </p>
                    </div>

                    {/* Service Date */}
                    {formData.serviceDate && (
                      <div>
                        <Label className="font-semibold">Service Date</Label>
                        <p className="text-sm text-gray-600">
                          {formatDate(formData.serviceDate)}
                        </p>
                      </div>
                    )}

                    {/* Service Names */}
                    <div>
                      <Label className="font-semibold">Service Names</Label>
                      {LANGUAGES.map(lang => (
                        <div key={lang} className="flex items-center gap-2 text-sm text-gray-600">
                          <Badge variant="outline" className="text-xs">
                            {LANGUAGE_NAMES[lang]}
                          </Badge>
                          <span>{formData.serviceName[lang]}</span>
                        </div>
                      ))}
                    </div>

                    

                    {/* Images Summary */}
                    <div>
                      <Label className="font-semibold">Images</Label>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Main Image: {formData.images.main ? "✓ Uploaded" : "None"}</p>
                        <p>Before Image: {formData.images.before ? "✓ Uploaded" : "None"}</p>
                        <p>After Image: {formData.images.after ? "✓ Uploaded" : "None"}</p>
                        <p>Gallery Images: {formData.images.gallery.length} uploaded</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-800 mb-1">Ready to Submit</h4>
                      <p className="text-blue-700 text-sm">
                        Review all the information above. Click "Submit Service" to create the new service.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Validation Alert */}
            {Object.keys(validationErrors).length > 0 && (
              <ValidationAlert errors={validationErrors} currentStep={currentStep} />
            )}

            {/* Navigation Buttons */}
            <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
              <div className="flex-1 flex gap-3">
                {currentStep > 1 && (
                  <Button variant="outline" onClick={prevStep} className="flex-1">
                    Previous
                  </Button>
                )}
                {currentStep < 5 && (
                  <Button onClick={nextStep} className="flex-1">
                    Next
                  </Button>
                )}
                {currentStep === 5 && (
                  <Button onClick={handleCreateService} className="flex-1 bg-green-600 hover:bg-green-700">
                    Submit Service
                  </Button>
                )}
              </div>
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="sm:w-auto"
              >
                Cancel
              </Button>
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
                placeholder="Search services by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterDivision} onValueChange={setFilterDivision}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Divisions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Divisions</SelectItem>
                {MANNAR_DIVISIONS.map(division => (
                  <SelectItem key={division} value={division}>{division}</SelectItem>
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
                setFilterDivision("all");
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
                setFilterDivision("all");
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
                setFormData({
                  serviceName: service.serviceName,
                  serviceDesc: service.serviceDesc,
                  serviceNote: service.serviceNote,
                  location: service.location,
                  images: {
                    main: null,
                    before: null,
                    after: null,
                    gallery: []
                  },
                  status: service.status,
                  // isFeatured: service.isFeatured,
                  serviceDate: service.serviceDate || ""
                });
                setDialog("edit");
                setCurrentStep(1);
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
                {selectedService.serviceName[currentLanguage]}
                {/* {selectedService.isFeatured && (
                  <Badge className="bg-yellow-100 text-yellow-700">Featured</Badge>
                )} */}
              </DialogTitle>
              <DialogDescription>
                {selectedService.location.district} • Created on {formatDate(selectedService.dateCreated)}
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
              {(selectedService.images.main || selectedService.images.before || selectedService.images.after || selectedService.images.gallery.length > 0) && (
                <div>
                  <h4 className="font-semibold mb-3">Service Images</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedService.images.main && (
                      <div className="relative">
                        <img
                          src={selectedService.images.main}
                          alt="Main service"
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <Badge className="absolute top-2 left-2 bg-blue-600">Main</Badge>
                      </div>
                    )}
                    {selectedService.images.before && (
                      <div className="relative">
                        <img
                          src={selectedService.images.before}
                          alt="Before service"
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <Badge className="absolute top-2 left-2 bg-orange-600">Before</Badge>
                      </div>
                    )}
                    {selectedService.images.after && (
                      <div className="relative">
                        <img
                          src={selectedService.images.after}
                          alt="After service"
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <Badge className="absolute top-2 left-2 bg-green-600">After</Badge>
                      </div>
                    )}
                    {selectedService.images.gallery.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <Badge className="absolute top-2 left-2 bg-gray-600">Gallery {index + 1}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h4 className="font-semibold mb-2">Service Description</h4>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedService.serviceDesc[currentLanguage]}
                </p>
              </div>

              {/* Additional Notes */}
              {selectedService.serviceNote[currentLanguage] && (
                <div>
                  <h4 className="font-semibold mb-2">Additional Notes</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedService.serviceNote[currentLanguage]}
                  </p>
                </div>
              )}

              {/* Location Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Location Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">District:</span>
                      <span>{selectedService.location.district}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Division:</span>
                      <span>{selectedService.location.division}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">GS Division:</span>
                      <span>{selectedService.location.gsDivision}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Service Details</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge className={selectedService.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                        {selectedService.status.toUpperCase()}
                      </Badge>
                    </div>
                    
                    {selectedService.serviceDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service Date:</span>
                        <span>{formatDate(selectedService.serviceDate)}</span>
                      </div>
                    )}
                   
                  </div>
                </div>
              </div>
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

            {/* Progress Steps */}
            <div className="flex justify-between items-center mb-6">
              {[1, 2, 3, 4, 5].map(step => (
                <div key={step} className="flex flex-col items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === currentStep 
                      ? "bg-blue-600 text-white" 
                      : step < currentStep 
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}>
                    {step < currentStep ? "✓" : step}
                  </div>
                  <span className="text-xs mt-1 text-gray-600 text-center">
                    {step === 1 && "Location"}
                    {step === 2 && "Details"}
                    {step === 3 && "Content"}
                    {step === 4 && "Images"}
                    {step === 5 && "Submit"}
                  </span>
                </div>
              ))}
            </div>

            {/* Step 1: Location Selection */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <LocationSelection
                  location={formData.location}
                  onLocationChange={(location) => setFormData(prev => ({ ...prev, location }))}
                  validationErrors={validationErrors}
                />
              </div>
            )}

            {/* Step 2: Service Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                  <span>Step 2: Service Details</span>
                </div>
                
                {/* Service Date */}
                <DateInputField
                  label="Service Date"
                  date={formData.serviceDate || ""}
                  onDateChange={(date) => setFormData(prev => ({ ...prev, serviceDate: date }))}
                />

                {/* Status and Featured */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="status" className="flex items-center gap-2">
                      Status
                      <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value: "active" | "inactive") => 
                        setFormData(prev => ({ ...prev, status: value }))
                      }
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="isFeatured" className="flex items-center gap-2 cursor-pointer">
                      <Star className="w-4 h-4 text-yellow-500" />
                      Feature this service
                    </Label>
                  </div> */}
                </div>
              </div>
            )}

            {/* Step 3: Service Content in 3 languages */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                  <span>Step 3: Service Content</span>
                </div>
                
                <Tabs defaultValue="en" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    {LANGUAGES.map(lang => (
                      <TabsTrigger key={lang} value={lang}>
                        {LANGUAGE_NAMES[lang]}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {LANGUAGES.map(lang => (
                    <TabsContent key={lang} value={lang}>
                      <LanguageInputSection
                        language={lang}
                        formData={formData}
                        onFormDataChange={setFormData}
                        validationErrors={validationErrors}
                      />
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            )}

            {/* Step 4: Image Uploads */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                  <ImageIcon className="w-5 h-5" />
                  <span>Step 4: Upload Images</span>
                </div>

                <div className="space-y-6">
                  {/* Main Service Image */}
                  <ImageUploadField
                    label="Main Service Image"
                    type="main"
                    image={formData.images.main}
                    onImageChange={handleImageChange}
                    isRequired={true}
                    hasError={validationErrors.mainImage}
                  />

                  {/* Before and After Images */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ImageUploadField
                      label="Before Image"
                      type="before"
                      image={formData.images.before}
                      onImageChange={handleImageChange}
                      // isRequired={true}
                      // hasError={validationErrors.beforeImage}
                    />
                    <ImageUploadField
                      label="After Image"
                      type="after"
                      image={formData.images.after}
                      onImageChange={handleImageChange}
                      isRequired={true}
                      hasError={validationErrors.afterImage}
                    />
                  </div>

                  {/* Gallery Images */}
                  <ImageUploadField
                    label="Gallery Images (Multiple)"
                    type="gallery"
                    image={formData.images.gallery}
                    onImageChange={handleImageChange}
                    isMultiple={true}
                  />
                </div>
              </div>
            )}

            {/* Step 5: Review and Submit */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                  <span>Step 5: Review and Submit</span>
                </div>

                {/* Service Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Service Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Location */}
                    <div>
                      <Label className="font-semibold">Location</Label>
                      <p className="text-sm text-gray-600">
                        {formData.location.district} / {formData.location.division} / {formData.location.gsDivision}
                      </p>
                    </div>

                    {/* Service Date */}
                    {formData.serviceDate && (
                      <div>
                        <Label className="font-semibold">Service Date</Label>
                        <p className="text-sm text-gray-600">
                          {formatDate(formData.serviceDate)}
                        </p>
                      </div>
                    )}

                    {/* Service Names */}
                    <div>
                      <Label className="font-semibold">Service Names</Label>
                      {LANGUAGES.map(lang => (
                        <div key={lang} className="flex items-center gap-2 text-sm text-gray-600">
                          <Badge variant="outline" className="text-xs">
                            {LANGUAGE_NAMES[lang]}
                          </Badge>
                          <span>{formData.serviceName[lang]}</span>
                        </div>
                      ))}
                    </div>

                    {/* Status and Featured */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="font-semibold">Status</Label>
                        <Badge className={formData.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                          {formData.status.toUpperCase()}
                        </Badge>
                      </div>
                     
                    </div>

                    {/* Images Summary */}
                    <div>
                      <Label className="font-semibold">Images</Label>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Main Image: {formData.images.main ? "✓ Uploaded" : "None"}</p>
                        <p>Before Image: {formData.images.before ? "✓ Uploaded" : "None"}</p>
                        <p>After Image: {formData.images.after ? "✓ Uploaded" : "None"}</p>
                        <p>Gallery Images: {formData.images.gallery.length} uploaded</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-800 mb-1">Ready to Update</h4>
                      <p className="text-blue-700 text-sm">
                        Review all the information above. Click "Save Changes" to update the service.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Validation Alert */}
            {Object.keys(validationErrors).length > 0 && (
              <ValidationAlert errors={validationErrors} currentStep={currentStep} />
            )}

            {/* Navigation Buttons */}
            <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
              <div className="flex-1 flex gap-3">
                {currentStep > 1 && (
                  <Button variant="outline" onClick={prevStep} className="flex-1">
                    Previous
                  </Button>
                )}
                {currentStep < 5 && (
                  <Button onClick={nextStep} className="flex-1">
                    Next
                  </Button>
                )}
                {currentStep === 5 && (
                  <Button onClick={handleEditService} className="flex-1 bg-green-600 hover:bg-green-700">
                    Save Changes
                  </Button>
                )}
              </div>
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="sm:w-auto"
              >
                Cancel
              </Button>
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
                Are you sure you want to delete "{selectedService.serviceName.en}"? This action cannot be undone.
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