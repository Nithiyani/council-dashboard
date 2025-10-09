"use client";

import { useState } from "react";
import { Crown, Edit, Calendar, MapPin, Phone, Mail, Award, Languages } from "lucide-react";
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
import { ChairmanData, Language, InfoCardItem } from "@/types/chairman";
import { LANGUAGES, INITIAL_CHAIRMAN_DATA } from "@/types/chairman";
import { chairmanDataSchema } from "@/lib/validation";

import { InfoCard } from "@/components/chairman/info-card";
import { MultilingualField } from "@/components/chairman/multilingual-field";

// Custom hooks
const useChairmanForm = (initialData: ChairmanData) => {
  const [chairmanData, setChairmanData] = useState<ChairmanData>(initialData);
  return { chairmanData, updateChairmanData: setChairmanData };
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

export default function ChairmanPage() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [langTab, setLangTab] = useState<Language>("en");

  const { chairmanData, updateChairmanData } = useChairmanForm(INITIAL_CHAIRMAN_DATA);

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

  const getText = (text: { en: string; ta: string; si: string }) => {
    return text[currentLanguage] || text.en;
  };

  const handleSaveProfile = (data: ChairmanData) => {
    updateChairmanData(data);
    setIsEditDialogOpen(false);
  };

  const handleSaveMessage = (data: { message: { en: string; ta: string; si: string } }) => {
    updateChairmanData({ ...chairmanData, message: data.message });
    setIsMessageDialogOpen(false);
  };

  const handleEditOpen = () => {
    editForm.reset(chairmanData);
    setIsEditDialogOpen(true);
  };

  const handleMessageOpen = () => {
    messageForm.reset({ message: chairmanData.message });
    setIsMessageDialogOpen(true);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
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
                src={chairmanData.photo} 
                alt={getText(chairmanData.name)} 
                className="w-full h-full object-cover" 
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
              <span>{chairmanData.contact.phone}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Mail className="w-4 h-4 text-red-600" />
              <span>{chairmanData.contact.email}</span>
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
              "{getText(chairmanData.message)}"
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
            <p className="text-sm text-gray-500 mt-1">Update chairman information in all languages.</p>
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
                        value={editForm.watch(`name.${lang}`)}
                        onChange={(e) => {
                          const newName = { ...editForm.watch("name"), [lang]: e.target.value };
                          editForm.setValue("name", newName);
                        }}
                        placeholder={`Enter name in ${lang}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Position ({lang.toUpperCase()}) *</Label>
                      <Input
                        value={editForm.watch(`position.${lang}`)}
                        onChange={(e) => {
                          const newPosition = { ...editForm.watch("position"), [lang]: e.target.value };
                          editForm.setValue("position", newPosition);
                        }}
                        placeholder={`Enter position in ${lang}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Address ({lang.toUpperCase()}) *</Label>
                      <Input
                        value={editForm.watch(`contact.address.${lang}`)}
                        onChange={(e) => {
                          const newAddress = { ...editForm.watch("contact.address"), [lang]: e.target.value };
                          editForm.setValue("contact.address", newAddress);
                        }}
                        placeholder={`Enter address in ${lang}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Current Term ({lang.toUpperCase()}) *</Label>
                      <Input
                        value={editForm.watch(`tenure.currentTerm.${lang}`)}
                        onChange={(e) => {
                          const newTerm = { ...editForm.watch("tenure.currentTerm"), [lang]: e.target.value };
                          editForm.setValue("tenure.currentTerm", newTerm);
                        }}
                        placeholder={`Enter current term in ${lang}`}
                      />
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
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input
                    {...editForm.register("contact.email")}
                    placeholder="Enter email address"
                    type="email"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Photo URL *</Label>
                  <Input
                    {...editForm.register("photo")}
                    placeholder="Enter photo URL"
                  />
                </div>
              </div>

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
            <p className="text-sm text-gray-500 mt-1">Edit the official message in all languages.</p>
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
                      <textarea
                        value={messageForm.watch(`message.${lang}`)}
                        onChange={(e) => {
                          const newMessage = { ...messageForm.watch("message"), [lang]: e.target.value };
                          messageForm.setValue("message", newMessage);
                        }}
                        placeholder={`Enter message in ${lang}`}
                        className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-vertical"
                      />
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
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