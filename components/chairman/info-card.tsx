// components/chairman/info-card.tsx
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, AlertCircle, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoCardItem, Language } from "@/types/chairman";
import { infoCardItemSchema } from "@/lib/validation";

interface InfoCardProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  items: InfoCardItem[];
  onAdd: (item: Omit<InfoCardItem, "id">) => Promise<void> | void;
  onEdit: (id: string, updates: Partial<InfoCardItem>) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
  currentLanguage: Language;
}

interface AlertState {
  type: 'success' | 'error';
  message: string;
  visible: boolean;
}

interface ValidationError {
  field: string;
  message: string;
  language?: string;
}

export const InfoCard = ({
  title,
  description,
  icon: Icon,
  items,
  onAdd,
  onEdit,
  onDelete,
  currentLanguage,
}: InfoCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InfoCardItem | null>(null);
  const [langTab, setLangTab] = useState<Language>("en");
  const [alert, setAlert] = useState<AlertState>({ 
    type: 'success', 
    message: '', 
    visible: false 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const form = useForm({
    resolver: zodResolver(infoCardItemSchema.omit({ id: true })),
    defaultValues: {
      title: { en: "", ta: "", si: "" },
      subtext: { en: "", ta: "", si: "" },
    },
  });

  const editForm = useForm({
    resolver: zodResolver(infoCardItemSchema.omit({ id: true })),
    defaultValues: {
      title: { en: "", ta: "", si: "" },
      subtext: { en: "", ta: "", si: "" },
    },
  });

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message, visible: true });
    setTimeout(() => {
      setAlert(prev => ({ ...prev, visible: false }));
    }, 5000);
  };

  // Enhanced validation function
  const validateFormData = (data: any): ValidationError[] => {
    const errors: ValidationError[] = [];
    
    // Validate all required fields for all languages
    const languages = ["en", "ta", "si"] as const;
    
    languages.forEach(lang => {
      // Validate title for each language
      if (!data.title?.[lang]?.trim()) {
        errors.push({
          field: "Title",
          message: `${getLanguageName(lang)} Title is required`,
          language: getLanguageName(lang)
        });
      }
      
      // Validate subtext for each language (if required)
      if (!data.subtext?.[lang]?.trim()) {
        errors.push({
          field: "Details",
          message: `${getLanguageName(lang)} Details are required`,
          language: getLanguageName(lang)
        });
      }
    });

    return errors;
  };

  const getLanguageName = (lang: Language): string => {
    const languageMap = {
      en: "English",
      ta: "Tamil", 
      si: "Sinhala"
    };
    return languageMap[lang];
  };

  const handleAdd = async (data: any) => {
    // Validate all fields before submitting
    const validationErrors = validateFormData(data);
    
    if (validationErrors.length > 0) {
      setValidationErrors(validationErrors);
      showAlert('error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setValidationErrors([]);
    
    try {
      await onAdd(data);
      form.reset();
      setIsDialogOpen(false);
      setLangTab("en");
      showAlert('success', `${title} added successfully!`);
    } catch (error) {
      showAlert('error', `Failed to add ${title.toLowerCase()}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (data: any) => {
    if (!editingItem) return;
    
    // Validate all fields before submitting
    const validationErrors = validateFormData(data);
    
    if (validationErrors.length > 0) {
      setValidationErrors(validationErrors);
      showAlert('error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setValidationErrors([]);
    
    try {
      await onEdit(editingItem.id, data);
      setEditingItem(null);
      editForm.reset();
      setIsEditDialogOpen(false);
      setLangTab("en");
      showAlert('success', `${title} updated successfully!`);
    } catch (error) {
      showAlert('error', `Failed to update ${title.toLowerCase()}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to delete this ${title.toLowerCase()}?`)) {
      return;
    }

    setIsLoading(true);
    try {
      await onDelete(id);
      showAlert('success', `${title} deleted successfully!`);
    } catch (error) {
      showAlert('error', `Failed to delete ${title.toLowerCase()}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const getDisplayText = (text: { en: string; ta: string; si: string }) => {
    return text[currentLanguage] || text.en;
  };

  const handleEditClick = (item: InfoCardItem) => {
    setEditingItem(item);
    editForm.reset(item);
    setIsEditDialogOpen(true);
    setLangTab("en");
    setValidationErrors([]);
  };

  const handleAddOpen = () => {
    form.reset({
      title: { en: "", ta: "", si: "" },
      subtext: { en: "", ta: "", si: "" },
    });
    setIsDialogOpen(true);
    setLangTab("en");
    setValidationErrors([]);
  };

  // Check if a specific field has validation error
  const hasFieldError = (field: 'title' | 'subtext', language: Language): boolean => {
    return validationErrors.some(error => 
      error.field.toLowerCase() === field.toLowerCase() && 
      error.language?.toLowerCase() === getLanguageName(language).toLowerCase()
    );
  };

  // Get validation error message for a specific field
  const getFieldErrorMessage = (field: 'title' | 'subtext', language: Language): string => {
    const error = validationErrors.find(error => 
      error.field.toLowerCase() === field.toLowerCase() && 
      error.language?.toLowerCase() === getLanguageName(language).toLowerCase()
    );
    return error?.message || '';
  };

  // Reset forms when dialogs close
  useEffect(() => {
    if (!isDialogOpen) {
      form.reset();
      setValidationErrors([]);
    }
  }, [isDialogOpen, form]);

  useEffect(() => {
    if (!isEditDialogOpen) {
      editForm.reset();
      setEditingItem(null);
      setValidationErrors([]);
    }
  }, [isEditDialogOpen, editForm]);

  // Validation Alert Component
  const ValidationAlert = () => {
    if (validationErrors.length === 0) return null;

    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-semibold">Validation Error</p>
            <p className="text-sm">Please fill in:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {validationErrors.map((error, index) => (
                <li key={index}>{error.message}</li>
              ))}
            </ul>
          </div>
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5 text-yellow-600" />}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Success/Error Alert */}
        {alert.visible && (
          <Alert className={`mb-4 ${
            alert.type === 'success' 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            {alert.type === 'success' ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={
              alert.type === 'success' ? 'text-green-800' : 'text-red-800'
            }>
              {alert.message}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <span className="text-sm font-medium">
                    {getDisplayText(item.title)}
                  </span>
                  {item.subtext && (
                    <p className="text-xs text-gray-500 mt-1">
                      {getDisplayText(item.subtext)}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClick(item)}
                    className="h-8 w-8 p-0"
                    disabled={isLoading}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    disabled={isLoading}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No {title.toLowerCase()} added yet.</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          {/* Add Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={handleAddOpen}
                disabled={isLoading}
              >
                <Plus className="w-4 h-4" />
                Add {title}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New {title}</DialogTitle>
                <p className="text-sm text-gray-500 mt-1">{description}</p>
              </DialogHeader>
              
              {/* Validation Alert */}
              <ValidationAlert />

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleAdd)}
                  className="space-y-6"
                >
                  <Tabs
                    value={langTab}
                    onValueChange={(v) => setLangTab(v as Language)}
                    className="mb-2"
                  >
                    <TabsList>
                      <TabsTrigger value="en">English</TabsTrigger>
                      <TabsTrigger value="ta">Tamil</TabsTrigger>
                      <TabsTrigger value="si">Sinhala</TabsTrigger>
                    </TabsList>
                    {(["en", "ta", "si"] as const).map((lang) => (
                      <TabsContent
                        key={lang}
                        value={lang}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <Label>Title  *</Label>
                          <Input
                            value={form.watch(`title.${lang}`)}
                            onChange={(e) => {
                              const newTitle = {
                                ...form.watch("title"),
                                [lang]: e.target.value,
                              };
                              form.setValue("title", newTitle);
                              // Clear validation error when user starts typing
                              if (e.target.value.trim()) {
                                setValidationErrors(prev => 
                                  prev.filter(error => 
                                    !(error.field === "Title" && error.language === getLanguageName(lang))
                                  )
                                );
                              }
                            }}
                            placeholder={`Enter title in ${getLanguageName(lang)}`}
                            disabled={isLoading}
                            className={hasFieldError('title', lang) ? "border-red-500" : ""}
                          />
                          {form.formState.errors.title?.[lang]?.message && (
                            <p className="text-sm text-red-600">
                              {form.formState.errors.title?.[lang]?.message}
                            </p>
                          )}
                          {hasFieldError('title', lang) && (
                            <p className="text-sm text-red-600">
                              {getFieldErrorMessage('title', lang)}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Details *</Label>
                          <Input
                            value={form.watch(`subtext.${lang}`)}
                            onChange={(e) => {
                              const newSubtext = {
                                ...form.watch("subtext"),
                                [lang]: e.target.value,
                              };
                              form.setValue("subtext", newSubtext);
                              // Clear validation error when user starts typing
                              if (e.target.value.trim()) {
                                setValidationErrors(prev => 
                                  prev.filter(error => 
                                    !(error.field === "Details" && error.language === getLanguageName(lang))
                                  )
                                );
                              }
                            }}
                            placeholder={`Enter details in ${getLanguageName(lang)}`}
                            disabled={isLoading}
                            className={hasFieldError('subtext', lang) ? "border-red-500" : ""}
                          />
                          {form.formState.errors.subtext?.[lang]?.message && (
                            <p className="text-sm text-red-600">
                              {form.formState.errors.subtext?.[lang]?.message}
                            </p>
                          )}
                          {hasFieldError('subtext', lang) && (
                            <p className="text-sm text-red-600">
                              {getFieldErrorMessage('subtext', lang)}
                            </p>
                          )}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Adding..." : "Add"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit {title}</DialogTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Edit the {title.toLowerCase()} details
                </p>
              </DialogHeader>

              {/* Validation Alert */}
              <ValidationAlert />

              <Form {...editForm}>
                <form
                  onSubmit={editForm.handleSubmit(handleEdit)}
                  className="space-y-6"
                >
                  <Tabs
                    value={langTab}
                    onValueChange={(v) => setLangTab(v as Language)}
                    className="mb-2"
                  >
                    <TabsList>
                      <TabsTrigger value="en">English</TabsTrigger>
                      <TabsTrigger value="ta">Tamil</TabsTrigger>
                      <TabsTrigger value="si">Sinhala</TabsTrigger>
                    </TabsList>
                    {(["en", "ta", "si"] as const).map((lang) => (
                      <TabsContent key={lang} value={lang} className="space-y-4">
                        <div className="space-y-2">
                          <Label>Title  *</Label>
                          <Input
                            value={editForm.watch(`title.${lang}`)}
                            onChange={(e) => {
                              editForm.setValue(`title.${lang}`, e.target.value);
                              // Clear validation error when user starts typing
                              if (e.target.value.trim()) {
                                setValidationErrors(prev => 
                                  prev.filter(error => 
                                    !(error.field === "Title" && error.language === getLanguageName(lang))
                                  )
                                );
                              }
                            }}
                            placeholder={`Enter title in ${getLanguageName(lang)}`}
                            disabled={isLoading}
                            className={hasFieldError('title', lang) ? "border-red-500" : ""}
                          />
                          <p className="text-sm text-red-600">
                            {editForm.formState.errors.title?.[lang]?.message || 
                             (hasFieldError('title', lang) && getFieldErrorMessage('title', lang))}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label>Details  *</Label>
                          <Input
                            value={editForm.watch(`subtext.${lang}`)}
                            onChange={(e) => {
                              editForm.setValue(`subtext.${lang}`, e.target.value);
                              // Clear validation error when user starts typing
                              if (e.target.value.trim()) {
                                setValidationErrors(prev => 
                                  prev.filter(error => 
                                    !(error.field === "Details" && error.language === getLanguageName(lang))
                                  )
                                );
                              }
                            }}
                            placeholder={`Enter details in ${getLanguageName(lang)}`}
                            disabled={isLoading}
                            className={hasFieldError('subtext', lang) ? "border-red-500" : ""}
                          />
                          <p className="text-sm text-red-600">
                            {editForm.formState.errors.subtext?.[lang]?.message || 
                             (hasFieldError('subtext', lang) && getFieldErrorMessage('subtext', lang))}
                          </p>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditDialogOpen(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Updating..." : "Update"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};