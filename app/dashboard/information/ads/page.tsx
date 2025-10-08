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
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Pin,
  Calendar,
  User,
  Phone,
  Download,
  Image as ImageIcon,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// ---------------- Types ----------------
interface Advertisement {
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
  date: string;
  category: string;
  status: "active" | "expired" | "draft";
  views: number;
  attachments: number;
  startDate: string;
  endDate: string;
  contactPerson: string;
  contactPhone: string;
  isPinned: boolean;
  isViewed?: boolean;
  images: string[];
}

interface AdvertisementFormData {
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
  status: "active" | "expired" | "draft";
  startDate: string;
  endDate: string;
  contactPerson: string;
  contactPhone: string;
  isPinned: boolean;
  images: string[];
}

type Language = "en" | "ta" | "si";

// ---------------- Advertisement Card ----------------
interface AdvertisementCardProps {
  advertisement: Advertisement;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
  getStatusColor: (status: string) => string;
  formatDate: (dateString: string) => string;
  currentLanguage: Language;
}

const AdvertisementCard = ({
  advertisement,
  onView,
  onEdit,
  onDelete,
  onTogglePin,
  getStatusColor,
  formatDate,
  currentLanguage,
}: AdvertisementCardProps) => (
  <Card className="hover:shadow-lg transition-shadow duration-300 relative overflow-hidden bg-white">
    <div className="absolute top-2 right-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={onTogglePin}
        aria-label="Pin/Unpin"
      >
        <Pin
          className={`h-5 w-5 ${
            advertisement.isPinned
              ? "text-blue-500 fill-blue-500"
              : "text-gray-400"
          }`}
        />
      </Button>
    </div>
    <CardContent className="flex flex-col md:flex-row p-6 items-start md:items-center">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <CardTitle
            className="text-lg font-semibold truncate hover:text-blue-600 cursor-pointer"
            onClick={onView}
          >
            {advertisement.title[currentLanguage]}
          </CardTitle>
          {!advertisement.isViewed && (
            <Badge
              variant="outline"
              className="bg-blue-100 text-blue-700 border-blue-200"
            >
              New
            </Badge>
          )}
        </div>
        <CardDescription className="text-sm text-gray-600 mb-3 line-clamp-2">
          {advertisement.description[currentLanguage]}
        </CardDescription>

        {/* Image preview */}
        {advertisement.images && advertisement.images.length > 0 && (
          <div className="flex gap-2 mb-3">
            {advertisement.images.slice(0, 3).map((image, index) => (
              <div
                key={index}
                className="relative w-16 h-16 rounded-md overflow-hidden border"
              >
                <img
                  src={image}
                  alt={`Advertisement ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {index === 2 && advertisement.images.length > 3 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      +{advertisement.images.length - 3}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Published: {formatDate(advertisement.date)}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>{advertisement.contactPerson || "No Contact"}</span>
          </div>
          {advertisement.images && advertisement.images.length > 0 && (
            <div className="flex items-center gap-1">
              <ImageIcon className="w-3 h-3" />
              <span>{advertisement.images.length} image(s)</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 mt-4">
          <Badge className={getStatusColor(advertisement.status)}>
            {advertisement.status.toUpperCase()}
          </Badge>
          <Badge variant="secondary">{advertisement.category}</Badge>
          <div className="flex gap-1">
            <Badge variant="outline" className="text-xs">
              EN
            </Badge>
            <Badge variant="outline" className="text-xs">
              TA
            </Badge>
            <Badge variant="outline" className="text-xs">
              SI
            </Badge>
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 flex items-center gap-3 mt-4 md:mt-0 md:ml-6">
        <Button variant="outline" size="icon" onClick={onView}>
          <Eye className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onEdit}>
          <Edit className="w-4 h-4" />
        </Button>
        <Button variant="destructive" size="icon" onClick={onDelete}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </CardContent>
  </Card>
);

// ---------------- Image Upload Component ----------------
interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

const ImageUpload = ({ images, onImagesChange }: ImageUploadProps) => {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: string[] = [];

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newImages.push(e.target.result as string);
            if (newImages.length === files.length) {
              onImagesChange([...images, ...newImages]);
            }
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="images">Upload Images</Label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <Input
          id="images"
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <Label
          htmlFor="images"
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          <ImageIcon className="w-8 h-8 text-gray-400" />
          <span className="text-sm text-gray-600">
            Click to upload images or drag and drop
          </span>
          <span className="text-xs text-gray-500">
            PNG, JPG, GIF up to 10MB each
          </span>
        </Label>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Upload ${index + 1}`}
                className="w-full h-24 object-cover rounded-md border"
              />
              <Button
                type="button"
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
    </div>
  );
};

// ---------------- Language Form Section ----------------
interface LanguageFormSectionProps {
  language: Language;
  isActive: boolean;
  formData: AdvertisementFormData;
  onFormDataChange: (data: AdvertisementFormData) => void;
  validationErrors: { [key: string]: boolean };
}

const LanguageFormSection = ({
  language,
  isActive,
  formData,
  onFormDataChange,
  validationErrors,
}: LanguageFormSectionProps) => {
  if (!isActive) return null;

  const languageNames = {
    en: "English",
    ta: "Tamil",
    si: "Sinhala",
  };

  const hasError =
    validationErrors[`title-${language}`] ||
    validationErrors[`description-${language}`];

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div
        className={`flex items-center gap-2 mb-4 p-3 rounded-lg ${
          hasError ? "bg-red-50 border border-red-200" : "bg-blue-50"
        }`}
      >
        {hasError ? (
          <AlertCircle className="w-4 h-4 text-red-600" />
        ) : (
          <CheckCircle className="w-4 h-4 text-blue-600" />
        )}
        <span
          className={`font-medium ${
            hasError ? "text-red-800" : "text-blue-800"
          }`}
        >
          Editing in {languageNames[language]}{" "}
          {hasError && "- Required fields missing"}
        </span>
      </div>

      <div>
        <Label
          htmlFor={`title-${language}`}
          className={
            validationErrors[`title-${language}`] ? "text-red-600" : ""
          }
        >
          Title in {languageNames[language]} *
        </Label>
        <Input
          id={`title-${language}`}
          value={formData.title[language]}
          onChange={(e) =>
            onFormDataChange({
              ...formData,
              title: { ...formData.title, [language]: e.target.value },
            })
          }
          placeholder={`Enter title in ${languageNames[language]}`}
          className={`mt-1 ${
            validationErrors[`title-${language}`]
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : ""
          }`}
        />
        {validationErrors[`title-${language}`] && (
          <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Title in {languageNames[language]} is required
          </p>
        )}
      </div>

      <div>
        <Label
          htmlFor={`description-${language}`}
          className={
            validationErrors[`description-${language}`] ? "text-red-600" : ""
          }
        >
          Description in {languageNames[language]} *
        </Label>
        <Textarea
          id={`description-${language}`}
          value={formData.description[language]}
          onChange={(e) =>
            onFormDataChange({
              ...formData,
              description: {
                ...formData.description,
                [language]: e.target.value,
              },
            })
          }
          placeholder={`Enter description in ${languageNames[language]}`}
          rows={4}
          className={`mt-1 ${
            validationErrors[`description-${language}`]
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : ""
          }`}
        />
        {validationErrors[`description-${language}`] && (
          <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Description in {languageNames[language]} is required
          </p>
        )}
      </div>
    </div>
  );
};

// ---------------- Alert Component ----------------
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

// ---------------- Main Page ----------------
export default function PublicAdvertisementsPage() {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([
    {
      id: "1",
      title: {
        en: "Water Supply Maintenance - Area 3 & 4",
        ta: "நீர் வழங்கல் பராமரிப்பு - பகுதி 3 & 4",
        si: "ජල සැපයුම් නඩත්තුව - ප්‍රදේශය 3 සහ 4",
      },
      description: {
        en: "Scheduled water supply maintenance will affect Area 3 and Area 4 from Jan 17, 6:00 AM to 4:00 PM.",
        ta: "திட்டமிடப்பட்ட நீர் வழங்கல் பராமரிப்பு பகுதி 3 மற்றும் பகுதி 4 ஐ பாதிக்கும் ஜனவரி 17, காலை 6:00 மணி முதல் மாலை 4:00 மணி வரை.",
        si: "සැලසුම් කළ ජල සැපයුම් නඩත්තුව ජනවාරි 17 වැනිදා උදේ 6:00 සිට 4:00 දක්වා ප්‍රදේශය 3 සහ ප්‍රදේශය 4 බලපානු ඇත.",
      },
      date: "2024-01-16",
      category: "Utility",
      status: "active",
      views: 1245,
      attachments: 3,
      startDate: "2024-01-17",
      endDate: "2024-01-17",
      contactPerson: "Mr. John Smith",
      contactPhone: "+94 77 123 4567",
      isPinned: true,
      isViewed: true,
      images: [
        "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=150&h=150&fit=crop",
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=150&h=150&fit=crop",
      ],
    },
    {
      id: "2",
      title: {
        en: "Road Closure - Main Street Repair",
        ta: "சாலை மூடப்பட்டது - மெய்ன் தெரு பழுது",
        si: "රෝදය වසා දැමීම - ප්‍රධාන වීදි අලුත්වැඩියාව",
      },
      description: {
        en: "Main Street closed for repairs from Jan 18-20. Use alternate routes via Church Rd & Market St.",
        ta: "மெய்ன் தெரு ஜனவரி 18-20 வரை பழுதுபார்க்கும் பொருட்டு மூடப்பட்டுள்ளது. திருப்பத்துவழிகள் மூலம் பயன்படுத்தவும்.",
        si: "ප්‍රධාන වීදිය ජනවාරි 18-20 දක්වා අලුත්වැඩියා සඳහා වසා ඇත. චර්ච් රෝඩ් සහ මාර්කට් ස්ට්රීට් හරහා විකල්ප මාර්ග භාවිතා කරන්න.",
      },
      date: "2024-01-15",
      category: "Infrastructure",
      status: "active",
      views: 892,
      attachments: 2,
      startDate: "2024-01-18",
      endDate: "2024-01-20",
      contactPerson: "Ms. Sarah Johnson",
      contactPhone: "+94 76 234 5678",
      isPinned: true,
      isViewed: false,
      images: [
        "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=150&h=150&fit=crop",
      ],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en");

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [createAlert, setCreateAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [editAlert, setEditAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedAdvertisement, setSelectedAdvertisement] =
    useState<Advertisement | null>(null);

  const initialFormData: AdvertisementFormData = {
    title: { en: "", ta: "", si: "" },
    description: { en: "", ta: "", si: "" },
    category: "",
    status: "active",
    startDate: "",
    endDate: "",
    contactPerson: "",
    contactPhone: "",
    isPinned: false,
    images: [],
  };

  const [newAdvertisement, setNewAdvertisement] =
    useState<AdvertisementFormData>(initialFormData);
  const [editAdvertisement, setEditAdvertisement] =
    useState<AdvertisementFormData>(initialFormData);

  // ---------------- Validation Helpers ----------------
  const validateAdvertisementForm = (
    formData: AdvertisementFormData
  ): boolean => {
    const errors: { [key: string]: boolean } = {};
    let isValid = true;

    // Check all three languages
    (["en", "ta", "si"] as Language[]).forEach((lang) => {
      if (!formData.title[lang]?.trim()) {
        errors[`title-${lang}`] = true;
        isValid = false;
      }
      if (!formData.description[lang]?.trim()) {
        errors[`description-${lang}`] = true;
        isValid = false;
      }
    });

    // Check category
    if (!formData.category.trim()) {
      errors.category = true;
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const clearValidationErrors = () => {
    setValidationErrors({});
  };

  // ---------------- Handlers ----------------
  const handleCreateAdvertisement = () => {
    // Validate all three languages are filled
    if (!validateAdvertisementForm(newAdvertisement)) {
      setCreateAlert({
        type: "error",
        message: "Please fill all languages before saving!",
      });
      setTimeout(() => setCreateAlert(null), 5000);
      return;
    }

    const newAd: Advertisement = {
      id: (advertisements.length + 1).toString(),
      ...newAdvertisement,
      date: new Date().toISOString().split("T")[0],
      views: 0,
      attachments: newAdvertisement.images.length,
      isViewed: false,
    };

    setAdvertisements([newAd, ...advertisements]);
    setIsCreateDialogOpen(false);
    setNewAdvertisement(initialFormData);
    setCurrentLanguage("en");
    clearValidationErrors();

    setCreateAlert({
      type: "success",
      message: "Advertisement saved successfully!",
    });
    setTimeout(() => setCreateAlert(null), 3000);
  };

  const handleEditAdvertisement = () => {
    if (!selectedAdvertisement) return;

    // Validate all three languages are filled
    if (!validateAdvertisementForm(editAdvertisement)) {
      setEditAlert({
        type: "error",
        message: "Please fill all languages before saving!",
      });
      setTimeout(() => setEditAlert(null), 5000);
      return;
    }

    const updatedAd: Advertisement = {
      ...selectedAdvertisement,
      ...editAdvertisement,
      attachments: editAdvertisement.images.length,
    };

    setAdvertisements((prev) =>
      prev.map((ad) => (ad.id === selectedAdvertisement.id ? updatedAd : ad))
    );
    setIsEditDialogOpen(false);
    clearValidationErrors();

    setEditAlert({
      type: "success",
      message: "Advertisement updated successfully!",
    });
    setTimeout(() => setEditAlert(null), 3000);
  };

  const handleDeleteAdvertisement = () => {
    if (!selectedAdvertisement) return;
    setAdvertisements((prev) =>
      prev.filter((ad) => ad.id !== selectedAdvertisement.id)
    );
    setIsDeleteDialogOpen(false);
  };

  const handleTogglePin = (id: string) => {
    setAdvertisements((prev) =>
      prev.map((ad) => (ad.id === id ? { ...ad, isPinned: !ad.isPinned } : ad))
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200";
      case "expired":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "draft":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Sort pinned & new first
  const sortedAds = [...advertisements].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    if (!a.isViewed && b.isViewed) return -1;
    if (a.isViewed && !b.isViewed) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const filteredAds = sortedAds.filter((ad) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      Object.values(ad.title).some((title) =>
        title.toLowerCase().includes(searchLower)
      ) ||
      Object.values(ad.description).some((desc) =>
        desc.toLowerCase().includes(searchLower)
      ) ||
      ad.contactPerson.toLowerCase().includes(searchLower);
    const matchesStatus = filterStatus === "all" || ad.status === filterStatus;
    const matchesCategory =
      filterCategory === "all" || ad.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Get unique categories for filter dropdown
  const categories = Array.from(new Set(advertisements.map((a) => a.category)));

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header & Create */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Public Advertisements
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and view all public announcements
          </p>
        </div>
        <Dialog
          open={isCreateDialogOpen}
          onOpenChange={(open) => {
            setIsCreateDialogOpen(open);
            if (!open) {
              setNewAdvertisement(initialFormData);
              setCurrentLanguage("en");
              clearValidationErrors();
              setCreateAlert(null);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" /> Create Advertisement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Advertisement</DialogTitle>
              <DialogDescription>
                Fill in the advertisement details in all three languages
                (English, Tamil, Sinhala)
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Language Selector */}
              <div className="flex gap-2">
                {(["en", "ta", "si"] as Language[]).map((lang) => (
                  <Button
                    key={lang}
                    type="button"
                    variant={currentLanguage === lang ? "default" : "outline"}
                    onClick={() => setCurrentLanguage(lang)}
                    className="flex-1"
                  >
                    {lang === "en" && "English"}
                    {lang === "ta" && "Tamil"}
                    {lang === "si" && "Sinhala"}
                  </Button>
                ))}
              </div>

              {/* Language-specific fields */}
              <LanguageFormSection
                language="en"
                isActive={currentLanguage === "en"}
                formData={newAdvertisement}
                onFormDataChange={setNewAdvertisement}
                validationErrors={validationErrors}
              />

              <LanguageFormSection
                language="ta"
                isActive={currentLanguage === "ta"}
                formData={newAdvertisement}
                onFormDataChange={setNewAdvertisement}
                validationErrors={validationErrors}
              />

              <LanguageFormSection
                language="si"
                isActive={currentLanguage === "si"}
                formData={newAdvertisement}
                onFormDataChange={setNewAdvertisement}
                validationErrors={validationErrors}
              />

              {/* Common fields */}
              <div className="border-t pt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <Label
                    htmlFor="category"
                    className={validationErrors.category ? "text-red-600" : ""}
                  >
                    Category *
                  </Label>
                  <Input
                    id="category"
                    value={newAdvertisement.category}
                    onChange={(e) =>
                      setNewAdvertisement({
                        ...newAdvertisement,
                        category: e.target.value,
                      })
                    }
                    placeholder="e.g., Utility, Health"
                    className={
                      validationErrors.category
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : ""
                    }
                  />
                  {validationErrors.category && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Category is required
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newAdvertisement.status}
                    onValueChange={(val) =>
                      setNewAdvertisement({
                        ...newAdvertisement,
                        status: val as any,
                      })
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input
                    id="contactPerson"
                    value={newAdvertisement.contactPerson}
                    onChange={(e) =>
                      setNewAdvertisement({
                        ...newAdvertisement,
                        contactPerson: e.target.value,
                      })
                    }
                    placeholder="Enter contact person name"
                  />
                </div>

                <div>
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    value={newAdvertisement.contactPhone}
                    onChange={(e) =>
                      setNewAdvertisement({
                        ...newAdvertisement,
                        contactPhone: e.target.value,
                      })
                    }
                    placeholder="+94 77 123 4567"
                  />
                </div>

                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newAdvertisement.startDate}
                    onChange={(e) =>
                      setNewAdvertisement({
                        ...newAdvertisement,
                        startDate: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newAdvertisement.endDate}
                    onChange={(e) =>
                      setNewAdvertisement({
                        ...newAdvertisement,
                        endDate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="border-t pt-4">
                <ImageUpload
                  images={newAdvertisement.images}
                  onImagesChange={(images) =>
                    setNewAdvertisement({ ...newAdvertisement, images })
                  }
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Switch
                  id="pin-advertisement"
                  checked={newAdvertisement.isPinned}
                  onCheckedChange={(val) =>
                    setNewAdvertisement({ ...newAdvertisement, isPinned: val })
                  }
                />
                <Label htmlFor="pin-advertisement" className="cursor-pointer">
                  Pin Advertisement
                </Label>
              </div>

              {/* Create Alert - Positioned under Pin Advertisement */}
              {createAlert && (
                <Alert
                  type={createAlert.type}
                  message={createAlert.message}
                  onClose={() => setCreateAlert(null)}
                />
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false);
                  setNewAdvertisement(initialFormData);
                  setCurrentLanguage("en");
                  clearValidationErrors();
                  setCreateAlert(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateAdvertisement}>
                Create Advertisement
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search advertisements by title, description, or contact person..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Filter by Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setFilterStatus("all");
                setFilterCategory("all");
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
          Showing {filteredAds.length} of {advertisements.length} advertisements
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">View in:</span>
          <Select
            value={currentLanguage}
            onValueChange={(val: Language) => setCurrentLanguage(val)}
          >
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ta">Tamil</SelectItem>
              <SelectItem value="si">Sinhala</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Advertisement Cards */}
      <div className="grid gap-4">
        {filteredAds.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">
                No advertisements found matching your criteria.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("all");
                  setFilterCategory("all");
                }}
              >
                Clear filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredAds.map((ad) => (
            <AdvertisementCard
              key={ad.id}
              advertisement={ad}
              onView={() => {
                setSelectedAdvertisement(ad);
                setIsViewDialogOpen(true);
                setAdvertisements((prev) =>
                  prev.map((a) =>
                    a.id === ad.id
                      ? { ...a, isViewed: true, views: a.views + 1 }
                      : a
                  )
                );
              }}
              onEdit={() => {
                setSelectedAdvertisement(ad);
                setEditAdvertisement({
                  title: ad.title,
                  description: ad.description,
                  category: ad.category,
                  status: ad.status,
                  startDate: ad.startDate,
                  endDate: ad.endDate,
                  contactPerson: ad.contactPerson,
                  contactPhone: ad.contactPhone,
                  isPinned: ad.isPinned,
                  images: ad.images,
                });
                setIsEditDialogOpen(true);
              }}
              onDelete={() => {
                setSelectedAdvertisement(ad);
                setIsDeleteDialogOpen(true);
              }}
              onTogglePin={() => handleTogglePin(ad.id)}
              getStatusColor={getStatusColor}
              formatDate={formatDate}
              currentLanguage={currentLanguage}
            />
          ))
        )}
      </div>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedAdvertisement?.title[currentLanguage]}
              {selectedAdvertisement?.isPinned && (
                <Pin className="w-4 h-4 text-blue-500 fill-blue-500" />
              )}
            </DialogTitle>
            <DialogDescription>
              Published on{" "}
              {selectedAdvertisement && formatDate(selectedAdvertisement.date)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Language Tabs for View */}
            <div className="flex gap-2 border-b pb-2">
              {(["en", "ta", "si"] as Language[]).map((lang) => (
                <Button
                  key={lang}
                  type="button"
                  variant={currentLanguage === lang ? "default" : "outline"}
                  onClick={() => setCurrentLanguage(lang)}
                  size="sm"
                >
                  {lang === "en" && "English"}
                  {lang === "ta" && "Tamil"}
                  {lang === "si" && "Sinhala"}
                </Button>
              ))}
            </div>

            {/* Image Gallery */}
            {selectedAdvertisement?.images &&
              selectedAdvertisement.images.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Images</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedAdvertisement.images.map((image, index) => (
                      <div
                        key={index}
                        className="rounded-md overflow-hidden border"
                      >
                        <img
                          src={image}
                          alt={`Advertisement image ${index + 1}`}
                          className="w-full h-32 object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-gray-700">
                {selectedAdvertisement?.description[currentLanguage]}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span>{selectedAdvertisement?.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge
                      className={getStatusColor(
                        selectedAdvertisement?.status || "active"
                      )}
                    >
                      {selectedAdvertisement?.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Date Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Date:</span>
                    <span>
                      {selectedAdvertisement &&
                        formatDate(selectedAdvertisement.startDate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">End Date:</span>
                    <span>
                      {selectedAdvertisement &&
                        formatDate(selectedAdvertisement.endDate)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Contact Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span>
                    {selectedAdvertisement?.contactPerson || "Not specified"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>
                    {selectedAdvertisement?.contactPhone || "Not specified"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-gray-500">
                {selectedAdvertisement?.views} views •{" "}
                {selectedAdvertisement?.attachments} attachments
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download Details
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) {
            clearValidationErrors();
            setEditAlert(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Advertisement</DialogTitle>
            <DialogDescription>
              Update the advertisement details in all three languages
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Language Selector for Edit */}
            <div className="flex gap-2">
              {(["en", "ta", "si"] as Language[]).map((lang) => (
                <Button
                  key={lang}
                  type="button"
                  variant={currentLanguage === lang ? "default" : "outline"}
                  onClick={() => setCurrentLanguage(lang)}
                  className="flex-1"
                >
                  {lang === "en" && "English"}
                  {lang === "ta" && "Tamil"}
                  {lang === "si" && "Sinhala"}
                </Button>
              ))}
            </div>

            {selectedAdvertisement && (
              <>
                {/* Language-specific fields for Edit */}
                <LanguageFormSection
                  language="en"
                  isActive={currentLanguage === "en"}
                  formData={editAdvertisement}
                  onFormDataChange={setEditAdvertisement}
                  validationErrors={validationErrors}
                />

                <LanguageFormSection
                  language="ta"
                  isActive={currentLanguage === "ta"}
                  formData={editAdvertisement}
                  onFormDataChange={setEditAdvertisement}
                  validationErrors={validationErrors}
                />

                <LanguageFormSection
                  language="si"
                  isActive={currentLanguage === "si"}
                  formData={editAdvertisement}
                  onFormDataChange={setEditAdvertisement}
                  validationErrors={validationErrors}
                />

                {/* Common fields for Edit */}
                <div className="border-t pt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label
                      htmlFor="edit-category"
                      className={
                        validationErrors.category ? "text-red-600" : ""
                      }
                    >
                      Category *
                    </Label>
                    <Input
                      id="edit-category"
                      value={editAdvertisement.category}
                      onChange={(e) =>
                        setEditAdvertisement({
                          ...editAdvertisement,
                          category: e.target.value,
                        })
                      }
                      className={
                        validationErrors.category
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : ""
                      }
                    />
                    {validationErrors.category && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Category is required
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="edit-status">Status</Label>
                    <Select
                      value={editAdvertisement.status}
                      onValueChange={(val) =>
                        setEditAdvertisement({
                          ...editAdvertisement,
                          status: val as any,
                        })
                      }
                    >
                      <SelectTrigger id="edit-status">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="edit-contactPerson">Contact Person</Label>
                    <Input
                      id="edit-contactPerson"
                      value={editAdvertisement.contactPerson}
                      onChange={(e) =>
                        setEditAdvertisement({
                          ...editAdvertisement,
                          contactPerson: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-contactPhone">Contact Phone</Label>
                    <Input
                      id="edit-contactPhone"
                      value={editAdvertisement.contactPhone}
                      onChange={(e) =>
                        setEditAdvertisement({
                          ...editAdvertisement,
                          contactPhone: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-startDate">Start Date</Label>
                    <Input
                      id="edit-startDate"
                      type="date"
                      value={editAdvertisement.startDate}
                      onChange={(e) =>
                        setEditAdvertisement({
                          ...editAdvertisement,
                          startDate: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-endDate">End Date</Label>
                    <Input
                      id="edit-endDate"
                      type="date"
                      value={editAdvertisement.endDate}
                      onChange={(e) =>
                        setEditAdvertisement({
                          ...editAdvertisement,
                          endDate: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Image Upload Section for Edit */}
                <div className="border-t pt-4">
                  <ImageUpload
                    images={editAdvertisement.images}
                    onImagesChange={(images) =>
                      setEditAdvertisement({ ...editAdvertisement, images })
                    }
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Switch
                    id="edit-pin-advertisement"
                    checked={editAdvertisement.isPinned}
                    onCheckedChange={(val) =>
                      setEditAdvertisement({
                        ...editAdvertisement,
                        isPinned: val,
                      })
                    }
                  />
                  <Label
                    htmlFor="edit-pin-advertisement"
                    className="cursor-pointer"
                  >
                    Pin Advertisement
                  </Label>
                </div>

                {/* Edit Alert - Positioned under Pin Advertisement */}
                {editAlert && (
                  <Alert
                    type={editAlert.type}
                    message={editAlert.message}
                    onClose={() => setEditAlert(null)}
                  />
                )}
              </>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditAdvertisement}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedAdvertisement?.title.en}
              "? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAdvertisement}>
              Delete Advertisement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
