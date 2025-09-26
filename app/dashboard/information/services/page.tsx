// app/dashboard/information/services/page.tsx
"use client";

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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import {
  Upload,
  FileText,
  Image as ImageIcon,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Users,
  BookOpen,
  Shield,
  Heart,
  Wrench,
  Building,
  FileCheck,
  Settings,
  X,
  Plus,
  Grid3X3,
  Trash2,
  Eye
} from "lucide-react";

interface Service {
  id: number;
  title: string;
  description: string;
}

const initialServices: Service[] = [
  {
    id: 1,
    title: "Garbage Collection",
    description:
      "Schedules, guidelines, and contacts for waste collection across all wards and zones.",
  },
  {
    id: 2,
    title: "Certificates & Permits",
    description:
      "Guidance on applying for birth, marriage, death certificates, and business permits.",
  },
  {
    id: 3,
    title: "Public Notices",
    description:
      "Official announcements, tenders, council meetings, budget reports, and consultations.",
  },
];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [newService, setNewService] = useState({ title: "", description: "" });
  const [language, setLanguage] = useState<"en" | "ta" | "si">("en");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    bannerImage: null as File | null,
    document: null as File | null,
    date: "",
    contactInfo: {
      location: "",
      phone: "",
      email: ""
    }
  });
  const [galleryImages, setGalleryImages] = useState<File[]>([]);

  const handleAddService = () => {
    const service: Service = {
      id: services.length + 1,
      title: newService.title,
      description: newService.description,
    };
    setServices([...services, service]);
    setNewService({ title: "", description: "" });
    setIsDialogOpen(false);
  };

  const handleEditService = () => {
    if (editingService) {
      setServices(
        services.map((s) => (s.id === editingService.id ? editingService : s))
      );
      setEditingService(null);
      setIsDialogOpen(false);
    }
  };

  const handleDeleteService = (id: number) => {
    setServices(services.filter((s) => s.id !== id));
  };

  // Language content
  const content = {
    en: {
      title: "Community Services Management",
      subtitle: "Manage and organize community services efficiently",
      categories: "Service Categories",
      education: "Education & Welfare",
      infrastructure: "Infrastructure & Development",
      safety: "Safety & Protection",
      health: "Health & Environment",
      contactInfo: "Contact Information",
      location: "Location",
      phone: "Phone",
      email: "Email",
      date: "Date Created",
      uploadImage: "Upload Banner Image",
      uploadDocument: "Upload Documents",
      description: "Service Description",
      serviceTitle: "Service Title",
      selectCategory: "Select Category",
      saveButton: "Save Service",
      formTitle: "Add New Service",
      gallery: "Gallery Images",
      addGallery: "Add to Gallery",
      manageGallery: "Manage Gallery",
      noImages: "No images added yet",
      removeImage: "Remove image",
      addImages: "Add Images",
      galleryDescription: "Add multiple images to showcase your service"
    },
    ta: {
      title: "சமூக சேவைகள் மேலாண்மை",
      subtitle: "சமூக சேவைகளை திறம்பட நிர்வகித்து ஒழுங்கமைக்கவும்",
      categories: "சேவை வகைகள்",
      education: "கல்வி & நலன்",
      infrastructure: "உள்கட்டமைப்பு & வளர்ச்சி",
      safety: "பாதுகாப்பு",
      health: "சுகாதாரம் & சூழல்",
      contactInfo: "தொடர்பு தகவல்",
      location: "இடம்",
      phone: "தொலைபேசி",
      email: "மின்னஞ்சல்",
      date: "உருவாக்கப்பட்ட தேதி",
      uploadImage: "பேனர் படத்தை பதிவேற்று",
      uploadDocument: "ஆவணங்களை பதிவேற்று",
      description: "சேவை விளக்கம்",
      serviceTitle: "சேவை தலைப்பு",
      selectCategory: "வகையை தேர்ந்தெடுக்கவும்",
      saveButton: "சேவையை சேமிக்கவும்",
      formTitle: "புதிய சேவையை சேர்க்கவும்",
      gallery: "கேலரி படங்கள்",
      addGallery: "கேலரியில் சேர்க்க",
      manageGallery: "கேலரியை நிர்வகிக்க",
      noImages: "இன்னும் படங்கள் சேர்க்கப்படவில்லை",
      removeImage: "படத்தை நீக்கு",
      addImages: "படங்களை சேர்க்க",
      galleryDescription: "உங்கள் சேவையை காட்சிப்படுத்த பல படங்களை சேர்க்கவும்"
    },
    si: {
      title: "සමාජ සේවා කළමනාකරණය",
      subtitle: "සමාජ සේවා කාර්යක්ෂමව කළමනාකරණය කර සංවිධානය කරන්න",
      categories: "සේවා කාණ්ඩ",
      education: "අධ්‍යාපනය සහ සුබසාධනය",
      infrastructure: "අඩිතාලම සහ සංවර්ධනය",
      safety: "සුරක්ෂිතතාව සහ ආරක්ෂාව",
      health: "සෞඛ්‍ය සහ පරිසරය",
      contactInfo: "සම්බන්ධතා තොරතුරු",
      location: "ස්ථානය",
      phone: "දුරකථන",
      email: "විද්‍යුත් තැපෑල",
      date: "නිර්මාණය කළ දිනය",
      uploadImage: "බැනර් රුපය උඩුගත කරන්න",
      uploadDocument: "ලේඛන උඩුගත කරන්න",
      description: "සේවා විස්තරය",
      serviceTitle: "සේවා මාතෘකාව",
      selectCategory: "ප්‍රවර්ගය තෝරන්න",
      saveButton: "සේවය සුරකින්න",
      formTitle: "නව සේවයක් එක් කරන්න",
      gallery: "ගැලරි රුප",
      addGallery: "ගැලරියට එක් කරන්න",
      manageGallery: "ගැලරිය කළමනාකරණය කරන්න",
      noImages: "තවම රුප එකතු කර නැත",
      removeImage: "රුපය ඉවත් කරන්න",
      addImages: "රුප එකතු කරන්න",
      galleryDescription: "ඔබේ සේවය ප්‍රදර්ශනය කිරීමට බහු රුප එක් කරන්න"
    }
  };

  const currentContent = content[language];

  const categories = [
    { value: "education", label: currentContent.education, icon: <BookOpen className="h-4 w-4" /> },
    { value: "infrastructure", label: currentContent.infrastructure, icon: <Wrench className="h-4 w-4" /> },
    { value: "safety", label: currentContent.safety, icon: <Shield className="h-4 w-4" /> },
    { value: "health", label: currentContent.health, icon: <Heart className="h-4 w-4" /> }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContactInfoChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value
      }
    }));
  };

  const handleImageUpload = (file: File | null) => {
    setFormData(prev => ({
      ...prev,
      bannerImage: file
    }));
  };

  const handleDocumentUpload = (file: File | null) => {
    setFormData(prev => ({
      ...prev,
      document: file
    }));
  };

  const handleGalleryUpload = (files: FileList) => {
    const newImages = Array.from(files);
    setGalleryImages(prev => [...prev, ...newImages]);
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      galleryImages: galleryImages
    };
    console.log("Form Data:", submissionData);
    alert("Service saved successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{currentContent.title}</h1>
              <p className="text-gray-600 mt-1">{currentContent.subtitle}</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <Button
                  variant={language === "en" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setLanguage("en")}
                  className={`px-3 text-xs ${language === "en" ? "bg-white shadow-sm" : "text-gray-600"}`}
                >
                  EN
                </Button>
                <Button
                  variant={language === "ta" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setLanguage("ta")}
                  className={`px-3 text-xs ${language === "ta" ? "bg-white shadow-sm" : "text-gray-600"}`}
                >
                  TA
                </Button>
                <Button
                  variant={language === "si" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setLanguage("si")}
                  className={`px-3 text-xs ${language === "si" ? "bg-white shadow-sm" : "text-gray-600"}`}
                >
                  SI
                </Button>
              </div>

              <Button variant="outline" size="sm" className="gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <Button
            variant="outline"
            className="flex items-center mb-4"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" /> Add New Service
          </Button>

          <Tabs defaultValue="services" className="space-y-4">
            <TabsList>
              <TabsTrigger value="services">Services</TabsTrigger>
            </TabsList>

            <TabsContent value="services">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <Card key={service.id} className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{service.description}</CardDescription>
                      <div className="flex space-x-2 mt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingService(service);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteService(service.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Categories & Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Category Selection */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                    {currentContent.categories}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={currentContent.selectCategory} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          <div className="flex items-center gap-2">
                            {category.icon}
                            {category.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-sm font-semibold uppercase tracking-wide text-gray-500 flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    {currentContent.contactInfo}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-xs font-medium text-gray-500">
                      {currentContent.location}
                    </Label>
                    <Input
                      id="location"
                      value={formData.contactInfo.location}
                      onChange={(e) => handleContactInfoChange("location", e.target.value)}
                      placeholder="Enter location"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs font-medium text-gray-500">
                      {currentContent.phone}
                    </Label>
                    <Input
                      id="phone"
                      value={formData.contactInfo.phone}
                      onChange={(e) => handleContactInfoChange("phone", e.target.value)}
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-medium text-gray-500">
                      {currentContent.email}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.contactInfo.email}
                      onChange={(e) => handleContactInfoChange("email", e.target.value)}
                      placeholder="Enter email address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-xs font-medium text-gray-500">
                      {currentContent.date}
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Content - Service Form */}
            <div className="lg:col-span-3 space-y-6">
              {/* Service Header */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {currentContent.formTitle}
                  </CardTitle>
                  <CardDescription>
                    Fill in the details for the new service
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Title Section */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                    {currentContent.serviceTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter service title"
                    className="text-lg font-medium"
                  />
                </CardContent>
              </Card>

              {/* Description Section */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold uppercase tracking-wide text-gray-500 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {currentContent.description}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Enter detailed service description..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="min-h-[120px] resize-vertical border-gray-300 focus:border-blue-500"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">
                      {formData.description.length} characters
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Upload Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Banner Image Upload */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold uppercase tracking-wide text-gray-500 flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      {currentContent.uploadImage}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-1">Drag and drop your banner image here</p>
                      <p className="text-xs text-gray-500 mb-3">or click to browse files</p>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                        className="hidden"
                        id="banner-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('banner-upload')?.click()}
                        className="border-gray-300 text-gray-700"
                      >
                        Choose Banner Image
                      </Button>
                      {formData.bannerImage && (
                        <div className="mt-3 p-2 bg-green-50 rounded border border-green-200">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-green-700">
                              ✓ {formData.bannerImage.name}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleImageUpload(null)}
                              className="h-6 w-6 p-0 text-red-500"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Document Upload */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold uppercase tracking-wide text-gray-500 flex items-center gap-2">
                      <FileCheck className="h-4 w-4" />
                      {currentContent.uploadDocument}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-1">Upload PDF, DOC, or DOCX files</p>
                      <p className="text-xs text-gray-500 mb-3">Maximum file size: 20MB</p>
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => e.target.files?.[0] && handleDocumentUpload(e.target.files[0])}
                        className="hidden"
                        id="document-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('document-upload')?.click()}
                        className="border-gray-300 text-gray-700"
                      >
                        Choose Document
                      </Button>
                      {formData.document && (
                        <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-blue-700">
                              ✓ {formData.document.name}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDocumentUpload(null)}
                              className="h-6 w-6 p-0 text-red-500"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Gallery Section */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold uppercase tracking-wide text-gray-500 flex items-center gap-2">
                    <Grid3X3 className="h-4 w-4" />
                    {currentContent.gallery}
                  </CardTitle>
                  <CardDescription>
                    {currentContent.galleryDescription}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Gallery Upload */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mb-4">
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-1">Drag and drop multiple images here</p>
                    <p className="text-xs text-gray-500 mb-3">or click to browse files</p>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => e.target.files && handleGalleryUpload(e.target.files)}
                      className="hidden"
                      id="gallery-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('gallery-upload')?.click()}
                      className="border-gray-300 text-gray-700 gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      {currentContent.addImages}
                    </Button>
                  </div>

                  {/* Gallery Preview */}
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <Grid3X3 className="h-4 w-4" />
                      {currentContent.manageGallery} ({galleryImages.length} images)
                    </h4>

                    {galleryImages.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <ImageIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <p>{currentContent.noImages}</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {galleryImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border">
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="h-8 w-8 text-gray-400" />
                              </div>
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removeGalleryImage(index)}
                                  className="h-8 w-8 p-0"
                                  title={currentContent.removeImage}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 mt-1 truncate">{image.name}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Save Button */}
              <div className="flex justify-end">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 px-8">
                  {currentContent.saveButton}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Dialog for Add / Edit */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingService ? "Edit Service" : "Add New Service"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Title</Label>
              <Input
                className="col-span-3"
                value={editingService?.title || newService.title}
                onChange={(e) =>
                  editingService
                    ? setEditingService({ ...editingService, title: e.target.value })
                    : setNewService({ ...newService, title: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Description</Label>
              <Input
                className="col-span-3"
                value={editingService?.description || newService.description}
                onChange={(e) =>
                  editingService
                    ? setEditingService({ ...editingService, description: e.target.value })
                    : setNewService({ ...newService, description: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={editingService ? handleEditService : handleAddService}>
              {editingService ? "Save" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}