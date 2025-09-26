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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import {
  FileText,
  BookOpen,
  Shield,
  Heart,
  Wrench,
  Building,
  FileCheck,
  Settings,
  X,
  Image as ImageIcon,
} from "lucide-react";

export default function ServicesPage() {
  const [language, setLanguage] = useState<"en" | "ta" | "si">("en");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    document: null as File | null,
    images: [] as File[],
    date: "",
    contactInfo: {
      location: "",
      phone: "",
      email: "",
    },
  });

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
      uploadDocument: "Upload Documents",
      uploadImages: "Upload Service Images",
      description: "Service Description",
      serviceTitle: "Service Title",
      selectCategory: "Select Category",
      saveButton: "Save Service",
      formTitle: "Add New Service",
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
      uploadDocument: "ஆவணங்களை பதிவேற்று",
      uploadImages: "சேவை படங்களை பதிவேற்று",
      description: "சேவை விளக்கம்",
      serviceTitle: "சேவை தலைப்பு",
      selectCategory: "வகையை தேர்ந்தெடுக்கவும்",
      saveButton: "சேவையை சேமிக்கவும்",
      formTitle: "புதிய சேவையை சேர்க்கவும்",
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
      uploadDocument: "ලේඛන උඩුගත කරන්න",
      uploadImages: "සේවා පින්තූර උඩුගත කරන්න",
      description: "සේවා විස්තරය",
      serviceTitle: "සේවා මාතෘකාව",
      selectCategory: "ප්‍රවර්ගය තෝරන්න",
      saveButton: "සේවය සුරකින්න",
      formTitle: "නව සේවයක් එක් කරන්න",
    },
  };

  const currentContent = content[language];

  const categories = [
    { value: "education", label: currentContent.education, icon: <BookOpen className="h-4 w-4" /> },
    { value: "infrastructure", label: currentContent.infrastructure, icon: <Wrench className="h-4 w-4" /> },
    { value: "safety", label: currentContent.safety, icon: <Shield className="h-4 w-4" /> },
    { value: "health", label: currentContent.health, icon: <Heart className="h-4 w-4" /> },
  ];

  // Language-specific inputMode map
  const inputModes = {
    en: "latin",
    ta: "tamil",
    si: "sinhalese",
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleContactInfoChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value,
      },
    }));
  };

  const handleDocumentUpload = (file: File | null) => {
    setFormData((prev) => ({
      ...prev,
      document: file,
    }));
  };

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    setFormData((prev) => {
      if (prev.images.length + newFiles.length > 6) {
        alert("You can upload maximum 6 images.");
        return prev;
      }
      return {
        ...prev,
        images: [...prev.images, ...newFiles],
      };
    });
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.images.length < 1) {
      alert("Please upload at least 1 image.");
      return;
    }
    console.log("Form Data:", formData);
    alert("Service saved successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
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
                {(["en", "ta", "si"] as const).map((lang) => (
                  <Button
                    key={lang}
                    variant={language === lang ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                      setLanguage(lang);
                      setFormData((prev) => ({
                        ...prev,
                        title: "",
                        description: "",
                        contactInfo: { location: "", phone: "", email: "" },
                      }));
                    }}
                    className={`px-3 text-xs ${language === lang ? "bg-white shadow-sm" : "text-gray-600"}`}
                  >
                    {lang.toUpperCase()}
                  </Button>
                ))}
              </div>

              {/* <Button variant="outline" size="sm" className="gap-2"> */}
                {/* <Settings className="h-4 w-4" /> */}
                {/* Settings */}
              {/* </Button> */}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Categories */}
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

              {/* Contact Info */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-sm font-semibold uppercase tracking-wide text-gray-500 flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    {currentContent.contactInfo}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {["location", "phone", "email"].map((field) => (
                    <div className="space-y-2" key={field}>
                      <Label htmlFor={field} className="text-xs font-medium text-gray-500">
                        {currentContent[field as "location" | "phone" | "email"]}
                      </Label>
                      <Input
                        id={field}
                        value={(formData.contactInfo as any)[field]}
                        onChange={(e) => handleContactInfoChange(field, e.target.value)}
                        placeholder={`Enter ${field}`}
                        inputMode={inputModes[language] as any}
                        type={field === "email" ? "email" : "text"}
                      />
                    </div>
                  ))}

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

            {/* Main Form */}
            <div className="lg:col-span-3 space-y-6">
              {/* Header */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {currentContent.formTitle}
                  </CardTitle>
                  <CardDescription>Fill in the details for the new service</CardDescription>
                </CardHeader>
              </Card>

              {/* Title */}
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
                    inputMode={inputModes[language] as any}
                    className="text-lg font-medium"
                  />
                </CardContent>
              </Card>

              {/* Description */}
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
                    inputMode={inputModes[language] as any}
                    className="min-h-[120px] resize-vertical border-gray-300 focus:border-blue-500"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">{formData.description.length} characters</span>
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
                    <p className="text-sm text-gray-600 mb-1">Upload PDF, DOC, or DOCX files</p>
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
                      onClick={() => document.getElementById("document-upload")?.click()}
                      className="border-gray-300 text-gray-700"
                    >
                      Choose Document
                    </Button>
                    {formData.document && (
                      <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-blue-700">✓ {formData.document.name}</span>
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

              {/* Image Upload */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold uppercase tracking-wide text-gray-500 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    {currentContent.uploadImages}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">Upload JPG, PNG images</p>
                    <p className="text-xs text-gray-500 mb-3">Minimum 1, Maximum 6 images</p>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageUpload(e.target.files)}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("image-upload")?.click()}
                      className="border-gray-300 text-gray-700"
                    >
                      Choose Images
                    </Button>

                    {/* Preview */}
                    {formData.images.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {formData.images.map((img, index) => (
                          <div key={index} className="relative border rounded-lg overflow-hidden">
                            <img
                              src={URL.createObjectURL(img)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-32 object-cover"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 h-6 w-6 p-0 text-red-500 bg-white/70 rounded-full"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Save */}
              <div className="flex justify-end">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 px-8">
                  {currentContent.saveButton}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
