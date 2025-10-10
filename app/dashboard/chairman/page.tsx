"use client";

import { useState, useEffect } from "react";
import { Crown, Edit, Calendar, MapPin, Phone, Mail, Award, Languages, AlertCircle, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { ChairmanData, Language, InfoCardItem } from "@/types/chairman";
import { LANGUAGES, INITIAL_CHAIRMAN_DATA } from "@/types/chairman";
import { chairmanDataSchema } from "@/lib/validation";

import { InfoCard } from "@/components/chairman/info-card";
import { MultilingualField } from "@/components/chairman/multilingual-field";

// ✅ Enhanced Validation Types
type ValidationError = {
  field: string;
  message: string;
  language?: string;
  type: 'error' | 'warning';
};

type ValidationResult = {
  isValid: boolean;
  errors: ValidationError[];
  hasErrors: boolean;
  hasWarnings: boolean;
};

// ✅ Custom hooks with enhanced validation
const useChairmanForm = (initialData: ChairmanData) => {
  const [chairmanData, setChairmanData] = useState<ChairmanData>(initialData);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  
  const updateChairmanData = (data: ChairmanData) => {
    setChairmanData(data);
    // Clear validation errors when data is successfully updated
    setValidationErrors([]);
  };

  return { 
    chairmanData, 
    updateChairmanData,
    validationErrors,
    setValidationErrors,
    clearValidationErrors: () => setValidationErrors([])
  };
};

const useInfoCards = (initialItems: InfoCardItem[] = []) => {
  const [items, setItems] = useState<InfoCardItem[]>(initialItems);
  
  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addItem = (item: Omit<InfoCardItem, "id">) => {
    const newItem: InfoCardItem = { ...item, id: generateId() };
    setItems(prev => [...prev, newItem]);
  };

  const updateItem = (id: string, updates: Partial<InfoCardItem>) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return { items, addItem, updateItem, deleteItem };
};

// ✅ Enhanced Validation Functions
const validateChairmanData = (data: ChairmanData): ValidationResult => {
  const errors: ValidationError[] = [];

  // Check required multilingual fields
  const requiredMultilingualFields = [
    { field: 'name', label: 'Name' },
    { field: 'position', label: 'Position' },
    { field: 'message', label: 'Message' }
  ] as const;

  const contactMultilingualFields = [
    { field: 'address', label: 'Address' }
  ] as const;

  const tenureMultilingualFields = [
    { field: 'currentTerm', label: 'Current Term' }
  ] as const;

  // Validate multilingual required fields
  requiredMultilingualFields.forEach(({ field, label }) => {
    LANGUAGES.forEach(lang => {
      const value = data[field]?.[lang.value as keyof typeof data[typeof field]];
      if (!value || !String(value).trim()) {
        errors.push({
          field: `${field}.${lang.value}`,
          message: `${label} is required`,
          language: lang.label,
          type: 'error'
        });
      } else if (String(value).trim().length < 2) {
        errors.push({
          field: `${field}.${lang.value}`,
          message: `${label} must be at least 2 characters`,
          language: lang.label,
          type: 'error'
        });
      }
    });
  });

  // Validate contact multilingual fields
  contactMultilingualFields.forEach(({ field, label }) => {
    LANGUAGES.forEach(lang => {
      const value = data.contact[field]?.[lang.value as keyof typeof data.contact[typeof field]];
      if (!value || !String(value).trim()) {
        errors.push({
          field: `contact.${field}.${lang.value}`,
          message: `Contact ${label.toLowerCase()} is required`,
          language: lang.label,
          type: 'error'
        });
      }
    });
  });

  // Validate tenure multilingual fields
  tenureMultilingualFields.forEach(({ field, label }) => {
    LANGUAGES.forEach(lang => {
      const value = data.tenure[field]?.[lang.value as keyof typeof data.tenure[typeof field]];
      if (!value || !String(value).trim()) {
        errors.push({
          field: `tenure.${field}.${lang.value}`,
          message: `Tenure ${label.toLowerCase()} is required`,
          language: lang.label,
          type: 'error'
        });
      }
    });
  });

  // Validate contact fields
  if (!data.contact.phone?.trim()) {
    errors.push({
      field: 'contact.phone',
      message: 'Phone number is required',
      type: 'error'
    });
  } else if (!/^[\d\s+\-()]+$/.test(data.contact.phone)) {
    errors.push({
      field: 'contact.phone',
      message: 'Please enter a valid phone number',
      type: 'error'
    });
  }

  if (!data.contact.email?.trim()) {
    errors.push({
      field: 'contact.email',
      message: 'Email address is required',
      type: 'error'
    });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact.email)) {
    errors.push({
      field: 'contact.email',
      message: 'Please enter a valid email address',
      type: 'error'
    });
  }

  if (!data.photo?.trim()) {
    errors.push({
      field: 'photo',
      message: 'Photo URL is required',
      type: 'error'
    });
  } else if (!/^https?:\/\/.+\..+/.test(data.photo)) {
    errors.push({
      field: 'photo',
      message: 'Please enter a valid photo URL',
      type: 'warning'
    });
  }

  // Validate tenure format (warnings)
  if (data.tenure.currentTerm.en && !/^.{3,}$/.test(data.tenure.currentTerm.en)) {
    errors.push({
      field: 'tenure.currentTerm.en',
      message: 'Current term seems too short',
      language: 'English',
      type: 'warning'
    });
  }

  return {
    isValid: errors.filter(e => e.type === 'error').length === 0,
    errors,
    hasErrors: errors.some(e => e.type === 'error'),
    hasWarnings: errors.some(e => e.type === 'warning')
  };
};

// ✅ Enhanced Alert Components
interface ValidationAlertProps {
  errors: ValidationError[];
  onClose: () => void;
}

const ValidationAlert = ({ errors, onClose }: ValidationAlertProps) => {
  if (errors.length === 0) return null;

  const errorCount = errors.filter(e => e.type === 'error').length;
  const warningCount = errors.filter(e => e.type === 'warning').length;

  return (
    <Alert variant={errorCount > 0 ? "destructive" : "default"} className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold">
                {errorCount > 0 ? `Please fix ${errorCount} error${errorCount > 1 ? 's' : ''}` : ''}
                {errorCount > 0 && warningCount > 0 ? ' and ' : ''}
                {warningCount > 0 ? `${warningCount} warning${warningCount > 1 ? 's' : ''}` : ''}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-transparent"
              onClick={onClose}
            >
              ×
            </Button>
          </div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {errors.map((error, index) => (
              <div
                key={index}
                className={`flex items-start gap-2 text-sm ${
                  error.type === 'error' ? 'text-red-700' : 'text-amber-700'
                }`}
              >
                <span className={`mt-0.5 flex-shrink-0 ${
                  error.type === 'error' ? 'text-red-500' : 'text-amber-500'
                }`}>
                  {error.type === 'error' ? '●' : '⚠'}
                </span>
                <span>
                  {error.language && <strong>{error.language}: </strong>}
                  {error.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};

interface SuccessAlertProps {
  message: string;
  onClose: () => void;
}

const SuccessAlert = ({ message, onClose }: SuccessAlertProps) => {
  return (
    <Alert className="mb-4 bg-green-50 border-green-200">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertDescription className="text-green-800">
        <div className="flex justify-between items-center">
          <span className="font-medium">{message}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-green-100 text-green-800"
            onClick={onClose}
          >
            ×
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

// ✅ Form Alert Component for inline form errors
interface FormAlertProps {
  errorMessage: string;
  errors?: ValidationError[];
  onClose: () => void;
}

const FormAlert = ({ errorMessage, errors = [], onClose }: FormAlertProps) => {
  if (!errorMessage && errors.length === 0) return null;

  const errorCount = errors.filter(e => e.type === 'error').length;
  const warningCount = errors.filter(e => e.type === 'warning').length;

  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-4">
      <div className="flex items-start">
        <AlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-red-800 font-medium">
            {errorMessage || `Please fix ${errorCount} error${errorCount > 1 ? 's' : ''} before saving.`}
          </p>
          {errors.length > 0 && (
            <div className="mt-2 space-y-1">
              {errors.slice(0, 5).map((error, index) => (
                <p key={index} className="text-red-600 text-sm">
                  • {error.language && <strong>{error.language}: </strong>}
                  {error.message}
                </p>
              ))}
              {errors.length > 5 && (
                <p className="text-red-600 text-sm">
                  • ... and {errors.length - 5} more error{errors.length - 5 > 1 ? 's' : ''}
                </p>
              )}
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-red-100 text-red-800 flex-shrink-0"
          onClick={onClose}
        >
          ×
        </Button>
      </div>
    </div>
  );
};

// ✅ Real-time Validation Hook
const useRealTimeValidation = () => {
  const [fieldErrors, setFieldErrors] = useState<Map<string, ValidationError>>(new Map());

  const validateField = (field: string, value: string, rules: { required?: boolean; pattern?: RegExp; minLength?: number }) => {
    const errors: ValidationError[] = [];

    if (rules.required && (!value || !value.trim())) {
      errors.push({
        field,
        message: 'This field is required',
        type: 'error'
      });
    }

    if (value && rules.pattern && !rules.pattern.test(value)) {
      errors.push({
        field,
        message: 'Please enter a valid format',
        type: 'error'
      });
    }

    if (value && rules.minLength && value.length < rules.minLength) {
      errors.push({
        field,
        message: `Must be at least ${rules.minLength} characters`,
        type: 'error'
      });
    }

    // Update field errors
    setFieldErrors(prev => {
      const newMap = new Map(prev);
      if (errors.length > 0) {
        newMap.set(field, errors[0]);
      } else {
        newMap.delete(field);
      }
      return newMap;
    });

    return errors.length === 0;
  };

  const getFieldError = (field: string): ValidationError | undefined => {
    return fieldErrors.get(field);
  };

  const clearFieldError = (field: string) => {
    setFieldErrors(prev => {
      const newMap = new Map(prev);
      newMap.delete(field);
      return newMap;
    });
  };

  const clearAllErrors = () => {
    setFieldErrors(new Map());
  };

  return {
    validateField,
    getFieldError,
    clearFieldError,
    clearAllErrors,
    fieldErrors: Array.from(fieldErrors.values())
  };
};

export default function ChairmanPage() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [langTab, setLangTab] = useState<Language>("en");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [formErrorMessage, setFormErrorMessage] = useState<string>("");
  const [formValidationErrors, setFormValidationErrors] = useState<ValidationError[]>([]);

  const { 
    chairmanData, 
    updateChairmanData,
    validationErrors,
    setValidationErrors,
    clearValidationErrors 
  } = useChairmanForm(INITIAL_CHAIRMAN_DATA);

  const realTimeValidation = useRealTimeValidation();

  const academics = useInfoCards([
    {
      id: '1',
      title: {
        en: "Master of Science (Mechanical Engineering, Production Technology)",
        ta: "முதுநிலை அறிவியல் (இயந்திர பொறியியல், உற்பத்தி தொழில்நுட்பம்)",
        si: "විද්‍යා මාස්ටර් (යාන්ත්‍රික ඉංජිනේරු, නිෂ්පාදන තාක්ෂණය)"
      },
      subtext: {
        en: "University of XYZ, Country",
        ta: "எக்ஸ்ஒய்இசட் பல்கலைக்கழகம், நாடு",
        si: "XYZ විශ්වවිද්‍යාලය, රට"
      }
    }
  ]);

  const honours = useInfoCards([
    {
      id: '1',
      title: {
        en: "Master of Science (M.Sc.) in Mechanical Engineering",
        ta: "இயந்திர பொறியியலில் முதுநிலை அறிவியல் (M.Sc.)",
        si: "යාන්ත්‍රික ඉංජිනේරු විද්‍යාවේ මාස්ටර් උපාධිය (M.Sc.)"
      },
      subtext: {
        en: "Tribhuvan University, Kathmandu, Nepal",
        ta: "திரிபுவன் பல்கலைக்கழகம், காட்மாண்டு, நேபாளம்",
        si: "ත්‍රිභුවන විශ්වවිද්‍යාලය, කතමණ්ඩු, නේපාලය"
      }
    }
  ]);

  const editForm = useForm<ChairmanData>({
    resolver: zodResolver(chairmanDataSchema),
    defaultValues: chairmanData,
  });

  const messageForm = useForm<{ message: { en: string; ta: string; si: string } }>({
    resolver: zodResolver(chairmanDataSchema.pick({ message: true })),
    defaultValues: { message: chairmanData.message },
  });

  // ✅ Enhanced validation handlers
  const handleSaveProfile = (data: ChairmanData) => {
    const validation = validateChairmanData(data);
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      setFormValidationErrors(validation.errors);
      
      // Set form error message
      const errorCount = validation.errors.filter(e => e.type === 'error').length;
      const warningCount = validation.errors.filter(e => e.type === 'warning').length;
      
      let errorMessage = '';
      if (errorCount > 0) {
        errorMessage = `Please fix ${errorCount} required field${errorCount > 1 ? 's' : ''} before saving.`;
      }
      if (warningCount > 0 && errorCount === 0) {
        errorMessage = `There are ${warningCount} warning${warningCount > 1 ? 's' : ''}. You can still save, but please review them.`;
      }
      
      setFormErrorMessage(errorMessage);
      return;
    }

    // If only warnings, allow save but show success with warning note
    if (validation.hasWarnings && !validation.hasErrors) {
      setSuccessMessage("Profile updated successfully with warnings. Please review the warnings.");
    } else {
      setSuccessMessage("Chairman profile updated successfully!");
    }

    setValidationErrors([]);
    setFormErrorMessage('');
    setFormValidationErrors([]);
    realTimeValidation.clearAllErrors();
    updateChairmanData(data);
    setIsEditDialogOpen(false);
    setTimeout(() => setSuccessMessage(""), 5000);
  };

  const handleSaveMessage = (data: { message: { en: string; ta: string; si: string } }) => {
    const errors: ValidationError[] = [];
    
    // Validate message in all languages
    LANGUAGES.forEach(lang => {
      if (!data.message[lang.value]?.trim()) {
        errors.push({
          field: `message.${lang.value}`,
          message: 'Message is required',
          language: lang.label,
          type: 'error'
        });
      } else if (data.message[lang.value].trim().length < 10) {
        errors.push({
          field: `message.${lang.value}`,
          message: 'Message should be at least 10 characters',
          language: lang.label,
          type: 'warning'
        });
      }
    });

    const hasErrors = errors.some(e => e.type === 'error');
    const hasWarnings = errors.some(e => e.type === 'warning');

    if (hasErrors) {
      setValidationErrors(errors);
      setFormValidationErrors(errors);
      
      const errorCount = errors.filter(e => e.type === 'error').length;
      let errorMessage = `Please fix ${errorCount} error${errorCount > 1 ? 's' : ''} in the message fields before saving.`;
      
      setFormErrorMessage(errorMessage);
      return;
    }

    // If only warnings, allow save but show success with warning note
    if (hasWarnings && !hasErrors) {
      setSuccessMessage("Message updated successfully with warnings. Please review the message length.");
    } else {
      setSuccessMessage("Chairman's message updated successfully!");
    }

    setValidationErrors([]);
    setFormErrorMessage('');
    setFormValidationErrors([]);
    realTimeValidation.clearAllErrors();
    updateChairmanData({ ...chairmanData, message: data.message });
    setIsMessageDialogOpen(false);
    setTimeout(() => setSuccessMessage(""), 5000);
  };

  // ✅ Real-time field validation handlers
  const handleFieldChange = (
    field: string, 
    value: string, 
    language?: string
  ) => {
    const fullFieldName = language ? `${field}.${language}` : field;
    
    // Clear previous errors for this field
    realTimeValidation.clearFieldError(fullFieldName);
    setFormErrorMessage('');
    setFormValidationErrors(prev => prev.filter(error => error.field !== fullFieldName));
    
    // Validate based on field type
    const rules = getValidationRules(field);
    realTimeValidation.validateField(fullFieldName, value, rules);
  };

  const getValidationRules = (field: string) => {
    const rules: { required?: boolean; pattern?: RegExp; minLength?: number } = {
      required: true
    };

    switch (field) {
      case 'contact.phone':
        rules.pattern = /^[\d\s+\-()]+$/;
        break;
      case 'contact.email':
        rules.pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        break;
      case 'photo':
        rules.pattern = /^https?:\/\/.+\..+/;
        break;
      case 'message':
        rules.minLength = 10;
        break;
      default:
        rules.minLength = 2;
    }

    return rules;
  };

  const getFieldError = (field: string, language?: string): ValidationError | undefined => {
    const fullFieldName = language ? `${field}.${language}` : field;
    return realTimeValidation.getFieldError(fullFieldName) || 
           validationErrors.find(error => error.field === fullFieldName) ||
           formValidationErrors.find(error => error.field === fullFieldName);
  };

  const hasFieldError = (field: string, language?: string): boolean => {
    return !!getFieldError(field, language);
  };

  const handleEditOpen = () => {
    editForm.reset(chairmanData);
    clearValidationErrors();
    setFormErrorMessage('');
    setFormValidationErrors([]);
    realTimeValidation.clearAllErrors();
    setIsEditDialogOpen(true);
  };

  const handleMessageOpen = () => {
    messageForm.reset({ message: chairmanData.message });
    clearValidationErrors();
    setFormErrorMessage('');
    setFormValidationErrors([]);
    realTimeValidation.clearAllErrors();
    setIsMessageDialogOpen(true);
  };

  const getText = (text: { en: string; ta: string; si: string }) => {
    return text[currentLanguage] || text.en;
  };

  // Reset form errors when dialog closes
  useEffect(() => {
    if (!isEditDialogOpen && !isMessageDialogOpen) {
      setFormErrorMessage('');
      setFormValidationErrors([]);
    }
  }, [isEditDialogOpen, isMessageDialogOpen]);

  // Check if required files/components are available
  const missingComponents = [];
  
  if (!InfoCard) {
    missingComponents.push("InfoCard component");
  }
  
  if (!MultilingualField) {
    missingComponents.push("MultilingualField component");
  }
  
  if (!chairmanDataSchema) {
    missingComponents.push("Chairman data validation schema");
  }
  
  if (!INITIAL_CHAIRMAN_DATA) {
    missingComponents.push("Initial chairman data");
  }

  if (missingComponents.length > 0) {
    return (
      <div className="space-y-6 p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-semibold">Missing Required Components</p>
              <p>Please complete the following files to use the Chairman page:</p>
              <ul className="list-disc list-inside space-y-1">
                {missingComponents.map((component, index) => (
                  <li key={index} className="text-sm">{component}</li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Success Alert */}
      {successMessage && (
        <SuccessAlert 
          message={successMessage} 
          onClose={() => setSuccessMessage("")} 
        />
      )}

      {/* Validation Alert */}
      {validationErrors.length > 0 && (
        <ValidationAlert
          errors={validationErrors}
          onClose={clearValidationErrors}
        />
      )}

      {/* Header - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-4">
        <div className="text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Chairman Management</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage chairman profile and information</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-center">
          <Select value={currentLanguage} onValueChange={(value: Language) => setCurrentLanguage(value)}>
            <SelectTrigger className="w-full sm:w-40">
              <Languages className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleEditOpen} className="w-full sm:w-auto">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Profile & Message - Mobile Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1 hover:shadow-lg transition-shadow">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden mb-4 border-4 border-gray-200">
              <img 
                src={chairmanData.photo || "/placeholder-avatar.png"} 
                alt={getText(chairmanData.name)} 
                className="w-full h-full object-cover" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder-avatar.png";
                }}
              />
            </div>
            <CardTitle className="flex items-center justify-center gap-2 text-lg sm:text-xl">
              <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
              {getText(chairmanData.name)}
            </CardTitle>
            <CardDescription className="text-base sm:text-lg font-medium">
              {getText(chairmanData.position)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2 text-sm">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Term: {getText(chairmanData.tenure.currentTerm)}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Phone className="w-4 h-4 text-green-600" />
              <span>{chairmanData.contact.phone || "Not provided"}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Mail className="w-4 h-4 text-red-600" />
              <span>{chairmanData.contact.email || "Not provided"}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="w-4 h-4 text-purple-600" />
              <span className="break-words">{getText(chairmanData.contact.address)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Message Card */}
        <Card className="lg:col-span-2 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-center sm:text-left">
              <CardTitle className="text-lg sm:text-xl">Chairman's Message</CardTitle>
              <CardDescription>Official message from the chairman</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleMessageOpen} className="w-full sm:w-auto">
              <Edit className="w-4 h-4 mr-2" />
              Update Message
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-lg">
              "{getText(chairmanData.message) || "No message available. Please update the chairman's message."}"
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Academics & Honours Cards */}
      <div className="space-y-4 sm:space-y-6">
        <InfoCard
          title="Academics & Qualifications"
          description="Educational background and qualifications"
          icon={Award}
          items={academics.items}
          onAdd={academics.addItem}
          onEdit={academics.updateItem}
          onDelete={academics.deleteItem}
          currentLanguage={currentLanguage}
        />

        <InfoCard
          title="Honours"
          description="Recognitions and honours received"
          icon={Award}
          items={honours.items}
          onAdd={honours.addItem}
          onEdit={honours.updateItem}
          onDelete={honours.deleteItem}
          currentLanguage={currentLanguage}
        />
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto w-[95vw]">
          <DialogHeader>
            <DialogTitle>Edit Chairman Profile</DialogTitle>
            <p className="text-sm text-gray-500 mt-1">Update chairman information in all languages. All fields are required.</p>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleSaveProfile)} className="space-y-6">
              <Tabs value={langTab} onValueChange={v => setLangTab(v as Language)} className="mb-2">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="ta">Tamil</TabsTrigger>
                  <TabsTrigger value="si">Sinhala</TabsTrigger>
                </TabsList>
                {(["en", "ta", "si"] as const).map((lang) => (
                  <TabsContent key={lang} value={lang} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Name ({lang.toUpperCase()}) *</Label>
                      <Input
                        value={editForm.watch(`name.${lang}`) || ""}
                        onChange={(e) => {
                          const newName = { ...editForm.watch("name"), [lang]: e.target.value };
                          editForm.setValue("name", newName);
                          handleFieldChange('name', e.target.value, lang);
                        }}
                        placeholder={`Enter name in ${lang}`}
                        className={hasFieldError('name', lang) ? "border-red-500" : ""}
                      />
                      {hasFieldError('name', lang) && (
                        <p className="text-red-500 text-sm">
                          {getFieldError('name', lang)?.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Position ({lang.toUpperCase()}) *</Label>
                      <Input
                        value={editForm.watch(`position.${lang}`) || ""}
                        onChange={(e) => {
                          const newPosition = { ...editForm.watch("position"), [lang]: e.target.value };
                          editForm.setValue("position", newPosition);
                          handleFieldChange('position', e.target.value, lang);
                        }}
                        placeholder={`Enter position in ${lang}`}
                        className={hasFieldError('position', lang) ? "border-red-500" : ""}
                      />
                      {hasFieldError('position', lang) && (
                        <p className="text-red-500 text-sm">
                          {getFieldError('position', lang)?.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Address ({lang.toUpperCase()}) *</Label>
                      <Input
                        value={editForm.watch(`contact.address.${lang}`) || ""}
                        onChange={(e) => {
                          const newAddress = { ...editForm.watch("contact.address"), [lang]: e.target.value };
                          editForm.setValue("contact.address", newAddress);
                          handleFieldChange('contact.address', e.target.value, lang);
                        }}
                        placeholder={`Enter address in ${lang}`}
                        className={hasFieldError('contact.address', lang) ? "border-red-500" : ""}
                      />
                      {hasFieldError('contact.address', lang) && (
                        <p className="text-red-500 text-sm">
                          {getFieldError('contact.address', lang)?.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Current Term ({lang.toUpperCase()}) *</Label>
                      <Input
                        value={editForm.watch(`tenure.currentTerm.${lang}`) || ""}
                        onChange={(e) => {
                          const newTerm = { ...editForm.watch("tenure.currentTerm"), [lang]: e.target.value };
                          editForm.setValue("tenure.currentTerm", newTerm);
                          handleFieldChange('tenure.currentTerm', e.target.value, lang);
                        }}
                        placeholder={`Enter current term in ${lang}`}
                        className={hasFieldError('tenure.currentTerm', lang) ? "border-red-500" : ""}
                      />
                      {hasFieldError('tenure.currentTerm', lang) && (
                        <p className="text-red-500 text-sm">
                          {getFieldError('tenure.currentTerm', lang)?.message}
                        </p>
                      )}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contact Information</h3>
                
                <div className="space-y-2">
                  <Label>Phone *</Label>
                  <Input
                    {...editForm.register("contact.phone")}
                    onChange={(e) => {
                      editForm.setValue("contact.phone", e.target.value);
                      handleFieldChange('contact.phone', e.target.value);
                    }}
                    placeholder="Enter phone number"
                    className={hasFieldError('contact.phone') ? "border-red-500" : ""}
                  />
                  {hasFieldError('contact.phone') && (
                    <p className="text-red-500 text-sm">
                      {getFieldError('contact.phone')?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input
                    {...editForm.register("contact.email")}
                    onChange={(e) => {
                      editForm.setValue("contact.email", e.target.value);
                      handleFieldChange('contact.email', e.target.value);
                    }}
                    placeholder="Enter email address"
                    type="email"
                    className={hasFieldError('contact.email') ? "border-red-500" : ""}
                  />
                  {hasFieldError('contact.email') && (
                    <p className="text-red-500 text-sm">
                      {getFieldError('contact.email')?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Photo URL *</Label>
                  <Input
                    {...editForm.register("photo")}
                    onChange={(e) => {
                      editForm.setValue("photo", e.target.value);
                      handleFieldChange('photo', e.target.value);
                    }}
                    placeholder="Enter photo URL"
                    className={hasFieldError('photo') ? "border-red-500" : ""}
                  />
                  {hasFieldError('photo') && (
                    <p className={`text-sm ${
                      getFieldError('photo')?.type === 'error' ? 'text-red-500' : 'text-amber-600'
                    }`}>
                      {getFieldError('photo')?.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Alert Messages under the form */}
              <FormAlert 
                errorMessage={formErrorMessage}
                errors={formValidationErrors}
                onClose={() => {
                  setFormErrorMessage('');
                  setFormValidationErrors([]);
                }}
              />

              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button type="submit" className="w-full sm:w-auto">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Message Dialog */}
      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto w-[95vw]">
          <DialogHeader>
            <DialogTitle>Update Chairman's Message</DialogTitle>
            <p className="text-sm text-gray-500 mt-1">Edit the official message in all languages. All fields are required.</p>
          </DialogHeader>
          <Form {...messageForm}>
            <form onSubmit={messageForm.handleSubmit(handleSaveMessage)} className="space-y-4">
              <Tabs value={langTab} onValueChange={v => setLangTab(v as Language)} className="mb-2">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="ta">Tamil</TabsTrigger>
                  <TabsTrigger value="si">Sinhala</TabsTrigger>
                </TabsList>
                {(["en", "ta", "si"] as const).map((lang) => (
                  <TabsContent key={lang} value={lang} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Message ({lang.toUpperCase()}) *</Label>
                      <Textarea
                        value={messageForm.watch(`message.${lang}`) || ""}
                        onChange={(e) => {
                          const newMessage = { ...messageForm.watch("message"), [lang]: e.target.value };
                          messageForm.setValue("message", newMessage);
                          handleFieldChange('message', e.target.value, lang);
                        }}
                        placeholder={`Enter message in ${lang}`}
                        className={`min-h-[100px] resize-vertical ${
                          hasFieldError('message', lang) ? "border-red-500" : ""
                        }`}
                      />
                      {hasFieldError('message', lang) && (
                        <p className={`text-sm ${
                          getFieldError('message', lang)?.type === 'error' ? 'text-red-500' : 'text-amber-600'
                        }`}>
                          {getFieldError('message', lang)?.message}
                        </p>
                      )}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>

              {/* Alert Messages under the form */}
              <FormAlert 
                errorMessage={formErrorMessage}
                errors={formValidationErrors}
                onClose={() => {
                  setFormErrorMessage('');
                  setFormValidationErrors([]);
                }}
              />

              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button type="button" variant="outline" onClick={() => setIsMessageDialogOpen(false)} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button type="submit" className="w-full sm:w-auto">Update Message</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}