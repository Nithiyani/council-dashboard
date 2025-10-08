// components/chairman/info-card.tsx
import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfoCardItem, Language } from "@/types/chairman";
import { infoCardItemSchema } from "@/lib/validation";

interface InfoCardProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  items: InfoCardItem[];
  onAdd: (item: Omit<InfoCardItem, "id">) => void;
  onEdit: (id: string, updates: Partial<InfoCardItem>) => void;
  onDelete: (id: string) => void;
  currentLanguage: Language;
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

  const handleAdd = (data: any) => {
    onAdd(data);
    form.reset();
    setIsDialogOpen(false);
    setLangTab("en");
  };

  const handleEdit = (data: any) => {
    if (editingItem) {
      onEdit(editingItem.id, data);
      setEditingItem(null);
      editForm.reset();
      setIsEditDialogOpen(false);
      setLangTab("en");
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
  };

  const handleAddOpen = () => {
    form.reset({
      title: { en: "", ta: "", si: "" },
      subtext: { en: "", ta: "", si: "" },
    });
    setIsDialogOpen(true);
    setLangTab("en");
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
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="p-4 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <span className="text-sm font-medium">{getDisplayText(item.title)}</span>
                  {item.subtext && (
                    <p className="text-xs text-gray-500 mt-1">{getDisplayText(item.subtext)}</p>
                  )}
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClick(item)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(item.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
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
              <Button variant="outline" className="flex items-center gap-2" onClick={handleAddOpen}>
                <Plus className="w-4 h-4" />
                Add {title}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New {title}</DialogTitle>
                <p className="text-sm text-gray-500 mt-1">{description}</p>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAdd)} className="space-y-6">
                  <Tabs value={langTab} onValueChange={v => setLangTab(v as Language)} className="mb-2">
                    <TabsList>
                      <TabsTrigger value="en">English</TabsTrigger>
                      <TabsTrigger value="ta">Tamil</TabsTrigger>
                      <TabsTrigger value="si">Sinhala</TabsTrigger>
                    </TabsList>
                    {(["en", "ta", "si"] as const).map((lang) => (
                      <TabsContent key={lang} value={lang} className="space-y-4">
                        <div className="space-y-2">
                          <Label>Title ({lang.toUpperCase()}) *</Label>
                          <Input
                            value={form.watch(`title.${lang}`)}
                            onChange={(e) => {
                              const newTitle = { ...form.watch("title"), [lang]: e.target.value };
                              form.setValue("title", newTitle);
                            }}
                            placeholder={`Enter title in ${lang}`}
                          />
                          {form.formState.errors.title?.[lang] && (
                            <p className="text-sm text-red-600">{form.formState.errors.title[lang].message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Details ({lang.toUpperCase()})</Label>
                          <Input
                            value={form.watch(`subtext.${lang}`)}
                            onChange={(e) => {
                              const newSubtext = { ...form.watch("subtext"), [lang]: e.target.value };
                              form.setValue("subtext", newSubtext);
                            }}
                            placeholder={`Enter details in ${lang}`}
                          />
                          {form.formState.errors.subtext?.[lang] && (
                            <p className="text-sm text-red-600">{form.formState.errors.subtext[lang].message}</p>
                          )}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add</Button>
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
                <p className="text-sm text-gray-500 mt-1">Edit the {title.toLowerCase()} details</p>
              </DialogHeader>
              <Form {...editForm}>
                <form onSubmit={editForm.handleSubmit(handleEdit)} className="space-y-6">
                  <Tabs value={langTab} onValueChange={v => setLangTab(v as Language)} className="mb-2">
                    <TabsList>
                      <TabsTrigger value="en">English</TabsTrigger>
                      <TabsTrigger value="ta">Tamil</TabsTrigger>
                      <TabsTrigger value="si">Sinhala</TabsTrigger>
                    </TabsList>
                    {(["en", "ta", "si"] as const).map((lang) => (
                      <TabsContent key={lang} value={lang} className="space-y-4">
                        <div className="space-y-2">
                          <Label>Title ({lang.toUpperCase()}) *</Label>
                          <Input
                            value={editForm.watch(`title.${lang}`)}
                            onChange={(e) => {
                              const newTitle = { ...editForm.watch("title"), [lang]: e.target.value };
                              editForm.setValue("title", newTitle);
                            }}
                            placeholder={`Enter title in ${lang}`}
                          />
                          {editForm.formState.errors.title?.[lang] && (
                            <p className="text-sm text-red-600">{editForm.formState.errors.title[lang].message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Details ({lang.toUpperCase()})</Label>
                          <Input
                            value={editForm.watch(`subtext.${lang}`)}
                            onChange={(e) => {
                              const newSubtext = { ...editForm.watch("subtext"), [lang]: e.target.value };
                              editForm.setValue("subtext", newSubtext);
                            }}
                            placeholder={`Enter details in ${lang}`}
                          />
                          {editForm.formState.errors.subtext?.[lang] && (
                            <p className="text-sm text-red-600">{editForm.formState.errors.subtext[lang].message}</p>
                          )}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Update</Button>
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