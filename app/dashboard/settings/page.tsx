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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Mail,
  Phone,
  MapPin,
  Trash2,
  Plus,
  Globe,
  Save,
  RotateCcw,
  Eye,
  Languages,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";

// ==================== TYPES ====================
type Language = "en" | "ta" | "si";

interface SocialMedia {
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  youtube: string;
}

interface ContactInfo {
  email: string;
  phone: string;
  address: {
    en: string;
    ta: string;
    si: string;
  };
}

interface GeneralSettings {
  siteName: {
    en: string;
    ta: string;
    si: string;
  };
  contact: ContactInfo;
  socialMedia: SocialMedia;
}

interface FAQItem {
  id: string;
  question: {
    en: string;
    ta: string;
    si: string;
  };
  answer: {
    en: string;
    ta: string;
    si: string;
  };
  isActive: boolean;
}

interface SettingsType {
  general: GeneralSettings;
  faq: FAQItem[];
  language: Language;
}

// ==================== CONSTANTS ====================
const LANGUAGE_CONFIG = {
  en: { name: "English", nativeName: "English" },
  ta: { name: "Tamil", nativeName: "தமிழ்" },
  si: { name: "Sinhala", nativeName: "සිංහල" }
} as const;

const DEFAULT_SETTINGS: SettingsType = {
  general: {
    siteName: {
      en: "Municipal Council",
      ta: "நகராட்சி சபை",
      si: "මහ නගර සභාව"
    },
    contact: {
      email: "info@council.gov.lk",
      phone: "+94 11 234 5678",
      address: {
        en: "123 Main Street, Colombo, Sri Lanka",
        ta: "123 மெய்ன் தெரு, கொழும்பு, இலங்கை",
        si: "123 ප්‍රධාන වීදිය, කොළඹ, ශ්‍රී ලංකාව"
      }
    },
    socialMedia: {
      facebook: "https://facebook.com/municipalcouncil",
      twitter: "https://twitter.com/municipalcouncil",
      instagram: "https://instagram.com/municipalcouncil",
      linkedin: "https://linkedin.com/company/municipalcouncil",
      youtube: "https://youtube.com/municipalcouncil"
    }
  },
  faq: [
    {
      id: "1",
      question: {
        en: "How do I report a water supply issue?",
        ta: "நீர் வழங்கல் பிரச்சினையை எப்படி புகாரளிப்பது?",
        si: "ජල සැපයුම් ගැටලුවක් වාර්තා කරන්නේ කෙසේද?"
      },
      answer: {
        en: "You can report water supply issues through our mobile app, website, or by calling our 24/7 helpline at +94 11 234 5678.",
        ta: "நீர் வழங்கல் பிரச்சினைகளை எங்கள் மொபைல் பயன்பாடு, வலைத்தளம் அல்லது +94 11 234 5678 என்ற 24/7 உதவி எண்ணைத் தொடர்பு கொண்டு புகாரளிக்கலாம்.",
        si: "ඔබට ජල සැපයුම් ගැටලු අපගේ ජංගම යෙදුම, වෙබ් අඩවිය හරහා හෝ +94 11 234 5678 අඛණ්ඩ උපකාර අංකයට ඇමතුම් කිරීමෙන් වාර්තා කළ හැක."
      },
      isActive: true
    },
    {
      id: "2",
      question: {
        en: "What are the office hours?",
        ta: "அலுவலக நேரங்கள் என்ன?",
        si: "කාර්යාල වේලාවන් මොනවාද?"
      },
      answer: {
        en: "Our office is open from 8:30 AM to 4:30 PM, Monday to Friday. Closed on public holidays.",
        ta: "எங்கள் அலுவலகம் திங்கள் முதல் வெள்ளி வரை காலை 8:30 மணி முதல் மாலை 4:30 மணி வரை திறந்திருக்கும். பொது விடுமுறை நாட்களில் மூடப்பட்டிருக்கும்.",
        si: "අපගේ කාර්යාලය සඳුදා සිට සිකුරාදා දක්වා උදේ 8:30 සිට 4:30 දක්වා විවෘත වේ. රජයේ නිවාඩු දිනවලදී වසා ඇත."
      },
      isActive: true
    }
  ],
  language: "en"
};

// ==================== COMPONENTS ====================

// Alert Component
interface AlertProps {
  type: "success" | "error" | "warning";
  message: string;
  onClose: () => void;
}

const Alert = ({ type, message, onClose }: AlertProps) => {
  const styles = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800"
  };

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertCircle
  };

  const Icon = icons[type];

  return (
    <div className={`border rounded-lg p-4 ${styles[type]} animate-in slide-in-from-top duration-300`}>
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5" />
        <div className="flex-1">
          <p className="font-medium">{message}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onClose}
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};

// Language Form Section
interface LanguageFormSectionProps {
  language: Language;
  isActive: boolean;
  value: { en: string; ta: string; si: string };
  onChange: (value: { en: string; ta: string; si: string }) => void;
  label: string;
  type?: "input" | "textarea";
  required?: boolean;
}

const LanguageFormSection = ({
  language,
  isActive,
  value,
  onChange,
  label,
  type = "input",
  required = true
}: LanguageFormSectionProps) => {
  if (!isActive) return null;

  const isEmpty = !value[language]?.trim();

  return (
    <div className="space-y-3 animate-in fade-in duration-300">
      <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <Languages className="w-4 h-4 text-blue-600" />
        <span className="font-medium text-blue-800">
          Editing in {LANGUAGE_CONFIG[language].name}
        </span>
      </div>

      <div>
        <Label htmlFor={`${label}-${language}`} className={isEmpty && required ? "text-red-600" : ""}>
          {label} in {LANGUAGE_CONFIG[language].name} {required && "*"}
        </Label>
        {type === "textarea" ? (
          <Textarea
            id={`${label}-${language}`}
            value={value[language]}
            onChange={(e) =>
              onChange({ ...value, [language]: e.target.value })
            }
            rows={4}
            className={`mt-1 resize-none ${isEmpty && required ? "border-red-300 focus:border-red-500 focus-visible:ring-red-500" : ""}`}
          />
        ) : (
          <Input
            id={`${label}-${language}`}
            value={value[language]}
            onChange={(e) =>
              onChange({ ...value, [language]: e.target.value })
            }
            className={`mt-1 ${isEmpty && required ? "border-red-300 focus:border-red-500 focus-visible:ring-red-500" : ""}`}
          />
        )}
        {isEmpty && required && (
          <p className="text-red-600 text-sm mt-1">
            {LANGUAGE_CONFIG[language].name} {label.toLowerCase()} is required
          </p>
        )}
      </div>
    </div>
  );
};

// Social Media Input
interface SocialMediaInputProps {
  platform: keyof SocialMedia;
  value: string;
  onChange: (value: string) => void;
}

const SocialMediaInput = ({ platform, value, onChange }: SocialMediaInputProps) => {
  const icons = {
    facebook: Facebook,
    twitter: Twitter,
    instagram: Instagram,
    linkedin: Linkedin,
    youtube: Youtube
  };

  const labels = {
    facebook: "Facebook",
    twitter: "Twitter", 
    instagram: "Instagram",
    linkedin: "LinkedIn",
    youtube: "YouTube"
  };

  const Icon = icons[platform];

  return (
    <div className="space-y-2">
      <Label htmlFor={platform} className="flex items-center gap-2">
        <Icon className="w-4 h-4" />
        {labels[platform]}
      </Label>
      <Input
        id={platform}
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`https://${platform}.com/username`}
        className="focus-visible:ring-blue-500"
      />
    </div>
  );
};

// ==================== VALIDATION FUNCTIONS ====================
const validateSettings = (settings: SettingsType): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validate General Settings
  // Site Name validation
  if (!settings.general.siteName.en.trim()) errors.push("English site name is required");
  if (!settings.general.siteName.ta.trim()) errors.push("Tamil site name is required");
  if (!settings.general.siteName.si.trim()) errors.push("Sinhala site name is required");

  // Address validation
  if (!settings.general.contact.address.en.trim()) errors.push("English address is required");
  if (!settings.general.contact.address.ta.trim()) errors.push("Tamil address is required");
  if (!settings.general.contact.address.si.trim()) errors.push("Sinhala address is required");

  // Email validation
  if (!settings.general.contact.email.trim()) {
    errors.push("Email is required");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.general.contact.email)) {
    errors.push("Valid email is required");
  }

  // Phone validation
  if (!settings.general.contact.phone.trim()) {
    errors.push("Phone number is required");
  }

  // Validate FAQ items
  settings.faq.forEach((faq, index) => {
    if (!faq.question.en.trim()) errors.push(`FAQ ${index + 1}: English question is required`);
    if (!faq.question.ta.trim()) errors.push(`FAQ ${index + 1}: Tamil question is required`);
    if (!faq.question.si.trim()) errors.push(`FAQ ${index + 1}: Sinhala question is required`);
    
    if (!faq.answer.en.trim()) errors.push(`FAQ ${index + 1}: English answer is required`);
    if (!faq.answer.ta.trim()) errors.push(`FAQ ${index + 1}: Tamil answer is required`);
    if (!faq.answer.si.trim()) errors.push(`FAQ ${index + 1}: Sinhala answer is required`);
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

// ==================== MAIN COMPONENT ====================
export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsType>(DEFAULT_SETTINGS);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "faq">("general");
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en");
  const [alert, setAlert] = useState<{ type: "success" | "error" | "warning"; message: string } | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("municipal-settings");
    if (saved) {
      try {
        const parsedSettings = JSON.parse(saved);
        setSettings(parsedSettings);
      } catch (error) {
        console.error("Error loading settings:", error);
        setAlert({ type: "error", message: "Error loading saved settings" });
      }
    }
  }, []);

  // Validate settings whenever they change
  useEffect(() => {
    const validation = validateSettings(settings);
    setValidationErrors(validation.errors);
  }, [settings]);

  // Update setting and mark as changed
  const updateSetting = <K extends keyof SettingsType>(key: K, value: SettingsType[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  // Update nested general setting
  const updateGeneralSetting = <K extends keyof GeneralSettings>(key: K, value: GeneralSettings[K]) => {
    setSettings(prev => ({
      ...prev,
      general: { ...prev.general, [key]: value }
    }));
    setHasChanges(true);
  };

  // Update nested contact setting
  const updateContactSetting = <K extends keyof ContactInfo>(key: K, value: ContactInfo[K]) => {
    setSettings(prev => ({
      ...prev,
      general: {
        ...prev.general,
        contact: { ...prev.general.contact, [key]: value }
      }
    }));
    setHasChanges(true);
  };

  // Update social media
  const updateSocialMedia = (platform: keyof SocialMedia, value: string) => {
    setSettings(prev => ({
      ...prev,
      general: {
        ...prev.general,
        socialMedia: { ...prev.general.socialMedia, [platform]: value }
      }
    }));
    setHasChanges(true);
  };

  // FAQ management
  const addFAQ = () => {
    const newFAQ: FAQItem = {
      id: Date.now().toString(),
      question: { en: "", ta: "", si: "" },
      answer: { en: "", ta: "", si: "" },
      isActive: true
    };
    setSettings(prev => ({ ...prev, faq: [...prev.faq, newFAQ] }));
    setHasChanges(true);
  };

  const updateFAQ = (id: string, field: "question" | "answer", value: { en: string; ta: string; si: string }) => {
    setSettings(prev => ({
      ...prev,
      faq: prev.faq.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
    setHasChanges(true);
  };

  const toggleFAQ = (id: string) => {
    setSettings(prev => ({
      ...prev,
      faq: prev.faq.map(item => 
        item.id === id ? { ...item, isActive: !item.isActive } : item
      )
    }));
    setHasChanges(true);
  };

  const deleteFAQ = (id: string) => {
    setSettings(prev => ({
      ...prev,
      faq: prev.faq.filter(item => item.id !== id)
    }));
    setHasChanges(true);
  };

  // Save changes with validation
  const handleSaveChanges = () => {
    const validation = validateSettings(settings);
    
    if (!validation.isValid) {
      setAlert({ 
        type: "error", 
        message: "Please fill all required fields in all languages before saving!" 
      });
      return;
    }

    localStorage.setItem("municipal-settings", JSON.stringify(settings));
    setHasChanges(false);
    setAlert({ type: "success", message: "Settings saved successfully!" });
    setTimeout(() => setAlert(null), 3000);
  };

  // Reset to default
  const handleResetToDefault = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem("municipal-settings");
    setHasChanges(false);
    setAlert({ type: "success", message: "Settings reset to default!" });
    setTimeout(() => setAlert(null), 3000);
  };

  const isSaveDisabled = !hasChanges || validationErrors.length > 0;

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
            <Settings className="w-6 h-6 sm:w-8 sm:h-8" />
            System Settings
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Manage municipal council system configuration and preferences
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          <Button 
            variant="outline" 
            onClick={handleResetToDefault}
            className="flex-1 lg:flex-none"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Reset Defaults</span>
            <span className="sm:hidden">Reset</span>
          </Button>
          
          <Button 
            onClick={handleSaveChanges} 
            disabled={isSaveDisabled} 
            className="flex-1 lg:flex-none bg-blue-600 hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Save Changes</span>
            <span className="sm:hidden">Save</span>
          </Button>
        </div>
      </div>

      {/* Alert */}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Validation Summary */}
      {validationErrors.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-red-800 text-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Required Fields Missing
            </CardTitle>
            <CardDescription className="text-red-700">
              Please fill all required fields in all languages before saving
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-red-700 text-sm space-y-1 max-h-32 overflow-y-auto">
              {validationErrors.slice(0, 5).map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
              {validationErrors.length > 5 && (
                <li>• ...and {validationErrors.length - 5} more errors</li>
              )}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Tab Navigation */}
      <div className="flex space-x-1 border-b border-gray-200 overflow-x-auto">
        <Button
          variant="ghost"
          className={`px-3 sm:px-4 py-2 rounded-none border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "general"
              ? "border-blue-600 text-blue-600 bg-blue-50"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("general")}
        >
          <Settings className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">General Settings</span>
          <span className="sm:hidden">General</span>
        </Button>
        <Button
          variant="ghost"
          className={`px-3 sm:px-4 py-2 rounded-none border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "faq"
              ? "border-blue-600 text-blue-600 bg-blue-50"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("faq")}
        >
          <Eye className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">FAQ Management</span>
          <span className="sm:hidden">FAQ</span>
        </Button>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* General Settings */}
        {activeTab === "general" && (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Globe className="w-5 h-5" />
                  Site Information
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Basic site configuration and multilingual content. All languages are required.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Language Selector */}
                <div className="flex flex-col sm:flex-row gap-2">
                  {(["en", "ta", "si"] as Language[]).map((lang) => (
                    <Button
                      key={lang}
                      type="button"
                      variant={currentLanguage === lang ? "default" : "outline"}
                      onClick={() => setCurrentLanguage(lang)}
                      className="flex-1"
                    >
                     
                      <span className="hidden xs:inline">{LANGUAGE_CONFIG[lang].nativeName}</span>
                      <span className="xs:hidden">{LANGUAGE_CONFIG[lang].name}</span>
                    </Button>
                  ))}
                </div>

                {/* Site Name */}
                <LanguageFormSection
                  language={currentLanguage}
                  isActive={true}
                  value={settings.general.siteName}
                  onChange={(value) => updateGeneralSetting("siteName", value)}
                  label="Site Name"
                  required={true}
                />

                <Separator />

                {/* Contact Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Contact Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address *
                      </Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={settings.general.contact.email}
                        onChange={(e) => updateContactSetting("email", e.target.value)}
                        className={!settings.general.contact.email.trim() ? "border-red-300 focus:border-red-500 focus-visible:ring-red-500" : ""}
                      />
                      {!settings.general.contact.email.trim() && (
                        <p className="text-red-600 text-sm">Email is required</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone" className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone Number *
                      </Label>
                      <Input
                        id="contactPhone"
                        value={settings.general.contact.phone}
                        onChange={(e) => updateContactSetting("phone", e.target.value)}
                        className={!settings.general.contact.phone.trim() ? "border-red-300 focus:border-red-500 focus-visible:ring-red-500" : ""}
                      />
                      {!settings.general.contact.phone.trim() && (
                        <p className="text-red-600 text-sm">Phone number is required</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Address *
                    </Label>
                    <LanguageFormSection
                      language={currentLanguage}
                      isActive={true}
                      value={settings.general.contact.address}
                      onChange={(value) => updateContactSetting("address", value)}
                      label="Address"
                      type="textarea"
                      required={true}
                    />
                  </div>
                </div>

                <Separator />

                {/* Social Media */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Social Media Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {Object.entries(settings.general.socialMedia).map(([platform, url]) => (
                      <SocialMediaInput
                        key={platform}
                        platform={platform as keyof SocialMedia}
                        value={url}
                        onChange={(value) => updateSocialMedia(platform as keyof SocialMedia, value)}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* FAQ Settings */}
        {activeTab === "faq" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Frequently Asked Questions</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Manage multilingual FAQ content for the public portal. All languages are required for each FAQ.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Language Selector */}
              <div className="flex flex-col sm:flex-row gap-2">
                {(["en", "ta", "si"] as Language[]).map((lang) => (
                  <Button
                    key={lang}
                    type="button"
                    variant={currentLanguage === lang ? "default" : "outline"}
                    onClick={() => setCurrentLanguage(lang)}
                    className="flex-1"
                  >
                    <span className="text-base mr-2">{LANGUAGE_CONFIG[lang].flag}</span>
                    <span className="hidden xs:inline">{LANGUAGE_CONFIG[lang].nativeName}</span>
                    <span className="xs:hidden">{LANGUAGE_CONFIG[lang].name}</span>
                  </Button>
                ))}
              </div>

              {/* FAQ Items */}
              <div className="space-y-4">
                {settings.faq.map((item) => {
                  const questionEmpty = !item.question[currentLanguage]?.trim();
                  const answerEmpty = !item.answer[currentLanguage]?.trim();
                  
                  return (
                    <Card key={item.id} className={!item.isActive ? "opacity-60" : ""}>
                      <CardContent className="p-4 sm:p-6 space-y-4">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-3">
                            <Switch
                              checked={item.isActive}
                              onCheckedChange={() => toggleFAQ(item.id)}
                            />
                            <Badge variant={item.isActive ? "default" : "secondary"}>
                              {item.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteFAQ(item.id)}
                            className="h-8 w-8"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <Label className={questionEmpty ? "text-red-600" : ""}>
                              Question *
                            </Label>
                            <Input
                              value={item.question[currentLanguage]}
                              onChange={(e) => updateFAQ(item.id, "question", {
                                ...item.question,
                                [currentLanguage]: e.target.value
                              })}
                              placeholder={`Enter question in ${LANGUAGE_CONFIG[currentLanguage].name}`}
                              className={questionEmpty ? "border-red-300 focus:border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            {questionEmpty && (
                              <p className="text-red-600 text-sm">
                                {LANGUAGE_CONFIG[currentLanguage].name} question is required
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label className={answerEmpty ? "text-red-600" : ""}>
                              Answer *
                            </Label>
                            <Textarea
                              value={item.answer[currentLanguage]}
                              onChange={(e) => updateFAQ(item.id, "answer", {
                                ...item.answer,
                                [currentLanguage]: e.target.value
                              })}
                              rows={3}
                              placeholder={`Enter answer in ${LANGUAGE_CONFIG[currentLanguage].name}`}
                              className={`resize-none ${answerEmpty ? "border-red-300 focus:border-red-500 focus-visible:ring-red-500" : ""}`}
                            />
                            {answerEmpty && (
                              <p className="text-red-600 text-sm">
                                {LANGUAGE_CONFIG[currentLanguage].name} answer is required
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <Button onClick={addFAQ} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add New FAQ
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Save Changes Banner */}
      {hasChanges && (
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:right-6 sm:bottom-6 bg-blue-600 text-white p-4 rounded-lg shadow-lg animate-in slide-in-from-bottom duration-300 z-50">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4" />
              <span className="font-medium text-sm sm:text-base">You have unsaved changes</span>
            </div>
            <div className="flex space-x-2 w-full sm:w-auto">
              <Button 
                size="sm" 
                variant="secondary" 
                onClick={handleSaveChanges}
                disabled={isSaveDisabled}
                className="flex-1 sm:flex-none bg-white text-blue-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <Save className="w-3 h-3 mr-1" />
                Save Now
              </Button>
            </div>
          </div>
          {validationErrors.length > 0 && (
            <p className="text-sm mt-2 text-yellow-200 text-center sm:text-left">
              {validationErrors.length} validation error{validationErrors.length !== 1 ? 's' : ''} must be fixed
            </p>
          )}
        </div>
      )}
    </div>
  );
}