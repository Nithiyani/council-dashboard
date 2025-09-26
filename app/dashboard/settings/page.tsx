"use client";

import { useState, useEffect } from "react";
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
import { Separator } from "@/components/ui/separator";
import { Settings, Mail, Phone, MapPin, Trash2, Edit } from "lucide-react";

// Step 1: Types
interface SocialMedia {
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
}

interface GeneralSettings {
  siteName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialMedia: SocialMedia;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface SettingsType {
  general: GeneralSettings;
  faq: FAQItem[];
}

// Step 2: Default settings
const defaultSettings: SettingsType = {
  general: {
    siteName: "Municipal Council",
    contactEmail: "info@council.gov",
    contactPhone: "+1 (555) 123-4567",
    address: "123 Main Street, City, State 12345",
    socialMedia: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
    },
  },
  faq: [
    {
      question: "How do I reset settings?",
      answer: 'Click the "Reset to Default" button at the top-right corner.',
    },
    {
      question: "How do I save changes?",
      answer: 'Click the "Save Changes" button after editing any field.',
    },
  ],
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsType>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "faq">("general");

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("settings");
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  // Update general setting
  const updateSetting = <K extends keyof GeneralSettings>(
    key: K,
    value: GeneralSettings[K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      general: {
        ...prev.general,
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  // Update nested social media
  const updateNestedSetting = <K extends keyof SocialMedia>(
    key: K,
    value: string
  ) => {
    setSettings((prev) => ({
      ...prev,
      general: {
        ...prev.general,
        socialMedia: {
          ...prev.general.socialMedia,
          [key]: value,
        },
      },
    }));
    setHasChanges(true);
  };

  // FAQ management functions
  const addFAQ = () => {
    setSettings((prev) => ({
      ...prev,
      faq: [...prev.faq, { question: "", answer: "" }],
    }));
    setHasChanges(true);
  };

  const updateFAQ = (index: number, field: "question" | "answer", value: string) => {
    const updated = [...settings.faq];
    updated[index][field] = value;
    setSettings((prev) => ({ ...prev, faq: updated }));
    setHasChanges(true);
  };

  const deleteFAQ = (index: number) => {
    const updated = settings.faq.filter((_, i) => i !== index);
    setSettings((prev) => ({ ...prev, faq: updated }));
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    localStorage.setItem("settings", JSON.stringify(settings));
    setHasChanges(false);
    alert("Settings saved successfully!");
  };

  const handleResetToDefault = () => {
    setSettings(defaultSettings);
    localStorage.removeItem("settings");
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage system configuration and preferences</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleResetToDefault}>
            Reset to Default
          </Button>
          <Button onClick={handleSaveChanges} disabled={!hasChanges}>
            Save Changes
          </Button>
        </div>
      </div>

      {/* Tab Menu */}
      <div className="flex space-x-4 border-b border-gray-200 mb-4">
        <button
          className={`px-4 py-2 ${
            activeTab === "general"
              ? "border-b-2 border-blue-600 font-semibold"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("general")}
        >
          General Settings
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "faq"
              ? "border-b-2 border-blue-600 font-semibold"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("faq")}
        >
          FAQ
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {/* General Settings */}
        {activeTab === "general" && (
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" /> General Settings
              </CardTitle>
              <CardDescription>Basic site information and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Site Name */}
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={settings.general.siteName}
                  onChange={(e) => updateSetting("siteName", e.target.value)}
                />
              </div>

              <Separator />

              {/* Contact Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Email Address
                    </Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={settings.general.contactEmail}
                      onChange={(e) => updateSetting("contactEmail", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" /> Phone Number
                    </Label>
                    <Input
                      id="contactPhone"
                      value={settings.general.contactPhone}
                      onChange={(e) => updateSetting("contactPhone", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Address
                  </Label>
                  <Textarea
                    id="address"
                    value={settings.general.address}
                    onChange={(e) => updateSetting("address", e.target.value)}
                  />
                </div>

                <Separator />

                {/* Social Media */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Social Media Links</h3>
                  {Object.entries(settings.general.socialMedia).map(([key, value]) => (
                    <div className="space-y-2" key={key}>
                      <Label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
                      <Input
                        id={key}
                        type="url"
                        value={value}
                        onChange={(e) =>
                          updateNestedSetting(
                            key as keyof SocialMedia,
                            e.target.value
                          )
                        }
                        placeholder={`Enter ${key} URL`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* FAQ Settings */}
        {activeTab === "faq" && (
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>FAQ</CardTitle>
              <CardDescription>Manage Frequently Asked Questions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {settings.faq.map((item, index) => (
                <div key={index} className="space-y-2 border p-2 rounded">
                  <div className="flex items-center justify-between gap-2">
                    <Label>Question</Label>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteFAQ(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <Input
                    value={item.question}
                    onChange={(e) => updateFAQ(index, "question", e.target.value)}
                  />
                  <Label>Answer</Label>
                  <Textarea
                    value={item.answer}
                    onChange={(e) => updateFAQ(index, "answer", e.target.value)}
                  />
                </div>
              ))}
              <Button onClick={addFAQ}>Add New FAQ</Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Save Changes Banner */}
      {hasChanges && activeTab === "general" && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <span>You have unsaved changes</span>
            <Button size="sm" variant="secondary" onClick={handleSaveChanges}>
              Save Now
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}