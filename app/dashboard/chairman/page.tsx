"use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Crown, Edit, Calendar, MapPin, Phone, Mail, Award, Languages, Trash2, Plus } from 'lucide-react';

// ----------------- Types -----------------
interface ContactInfo {
  phone: string;
  email: string;
  address: {
    english: string;
    tamil: string;
    sinhala: string;
  };
}

interface TenureInfo {
  startDate: {
    english: string;
    tamil: string;
    sinhala: string;
  };
  currentTerm: {
    english: string;
    tamil: string;
    sinhala: string;
  };
}

interface ChairmanData {
  name: {
    english: string;
    tamil: string;
    sinhala: string;
  };
  position: {
    english: string;
    tamil: string;
    sinhala: string;
  };
  photo: string;
  message: {
    english: string;
    tamil: string;
    sinhala: string;
  };
  contact: ContactInfo;
  tenure: TenureInfo;
}

interface InfoCardItem {
  id: string;
  title: {
    english: string;
    tamil: string;
    sinhala: string;
  };
  subtext?: {
    english: string;
    tamil: string;
    sinhala: string;
  };
}

interface InfoCardProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  items: InfoCardItem[];
  setItems: React.Dispatch<React.SetStateAction<InfoCardItem[]>>;
  language: string;
}

// ----------------- Language Support -----------------
const languages = [
  { value: 'english', label: 'English' },
  { value: 'tamil', label: 'Tamil' },
  { value: 'sinhala', label: 'Sinhala' }
];

// ----------------- InfoCard Component -----------------
function InfoCard({ title, description, icon: Icon, items, setItems, language }: InfoCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InfoCardItem | null>(null);
  const [newTitle, setNewTitle] = useState({ english: "", tamil: "", sinhala: "" });
  const [newSubtext, setNewSubtext] = useState({ english: "", tamil: "", sinhala: "" });

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleAddItem = () => {
    if (newTitle.english.trim() !== "" || newTitle.tamil.trim() !== "" || newTitle.sinhala.trim() !== "") {
      setItems([...items, { 
        id: generateId(),
        title: { ...newTitle }, 
        subtext: newSubtext.english || newSubtext.tamil || newSubtext.sinhala ? { ...newSubtext } : undefined 
      }]);
      setNewTitle({ english: "", tamil: "", sinhala: "" });
      setNewSubtext({ english: "", tamil: "", sinhala: "" });
      setIsDialogOpen(false);
    }
  };

  const handleEditItem = (item: InfoCardItem) => {
    setEditingItem(item);
    setNewTitle({ ...item.title });
    setNewSubtext(item.subtext ? { ...item.subtext } : { english: "", tamil: "", sinhala: "" });
    setIsEditDialogOpen(true);
  };

  const handleUpdateItem = () => {
    if (editingItem && (newTitle.english.trim() !== "" || newTitle.tamil.trim() !== "" || newTitle.sinhala.trim() !== "")) {
      setItems(items.map(item => 
        item.id === editingItem.id 
          ? { 
              ...item, 
              title: { ...newTitle }, 
              subtext: newSubtext.english || newSubtext.tamil || newSubtext.sinhala ? { ...newSubtext } : undefined 
            } 
          : item
      ));
      setEditingItem(null);
      setNewTitle({ english: "", tamil: "", sinhala: "" });
      setNewSubtext({ english: "", tamil: "", sinhala: "" });
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const getDisplayText = (text: { english: string; tamil: string; sinhala: string }) => {
    return text[language as keyof typeof text] || text.english || text.tamil || text.sinhala;
  };

  const resetForm = () => {
    setNewTitle({ english: "", tamil: "", sinhala: "" });
    setNewSubtext({ english: "", tamil: "", sinhala: "" });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5 text-yellow-600" />}
          {title}
        </CardTitle>
        <p className="text-sm text-gray-500">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, index) => (
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
                    onClick={() => handleEditItem(item)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDeleteItem(item.id)}
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
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add {title}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New {title}</DialogTitle>
                <p className="text-sm text-gray-500 mt-1">{description}</p>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <Label>Title (English) *</Label>
                  <Input
                    value={newTitle.english}
                    onChange={(e) => setNewTitle({...newTitle, english: e.target.value})}
                    placeholder={`Enter ${title} title in English...`}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title (Tamil)</Label>
                  <Input
                    value={newTitle.tamil}
                    onChange={(e) => setNewTitle({...newTitle, tamil: e.target.value})}
                    placeholder={`Enter ${title} title in Tamil...`}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title (Sinhala)</Label>
                  <Input
                    value={newTitle.sinhala}
                    onChange={(e) => setNewTitle({...newTitle, sinhala: e.target.value})}
                    placeholder={`Enter ${title} title in Sinhala...`}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Details (English)</Label>
                  <Input
                    value={newSubtext.english}
                    onChange={(e) => setNewSubtext({...newSubtext, english: e.target.value})}
                    placeholder={`Enter ${title} details in English...`}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Details (Tamil)</Label>
                  <Input
                    value={newSubtext.tamil}
                    onChange={(e) => setNewSubtext({...newSubtext, tamil: e.target.value})}
                    placeholder={`Enter ${title} details in Tamil...`}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Details (Sinhala)</Label>
                  <Input
                    value={newSubtext.sinhala}
                    onChange={(e) => setNewSubtext({...newSubtext, sinhala: e.target.value})}
                    placeholder={`Enter ${title} details in Sinhala...`}
                  />
                </div>
              </div>
              <DialogFooter className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddItem} disabled={!newTitle.english.trim() && !newTitle.tamil.trim() && !newTitle.sinhala.trim()}>
                  Add
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) {
              setEditingItem(null);
              resetForm();
            }
          }}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit {title}</DialogTitle>
                <p className="text-sm text-gray-500 mt-1">Edit the {title.toLowerCase()} details</p>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <Label>Title (English) *</Label>
                  <Input
                    value={newTitle.english}
                    onChange={(e) => setNewTitle({...newTitle, english: e.target.value})}
                    placeholder={`Enter ${title} title in English...`}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title (Tamil)</Label>
                  <Input
                    value={newTitle.tamil}
                    onChange={(e) => setNewTitle({...newTitle, tamil: e.target.value})}
                    placeholder={`Enter ${title} title in Tamil...`}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title (Sinhala)</Label>
                  <Input
                    value={newTitle.sinhala}
                    onChange={(e) => setNewTitle({...newTitle, sinhala: e.target.value})}
                    placeholder={`Enter ${title} title in Sinhala...`}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Details (English)</Label>
                  <Input
                    value={newSubtext.english}
                    onChange={(e) => setNewSubtext({...newSubtext, english: e.target.value})}
                    placeholder={`Enter ${title} details in English...`}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Details (Tamil)</Label>
                  <Input
                    value={newSubtext.tamil}
                    onChange={(e) => setNewSubtext({...newSubtext, tamil: e.target.value})}
                    placeholder={`Enter ${title} details in Tamil...`}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Details (Sinhala)</Label>
                  <Input
                    value={newSubtext.sinhala}
                    onChange={(e) => setNewSubtext({...newSubtext, sinhala: e.target.value})}
                    placeholder={`Enter ${title} details in Sinhala...`}
                  />
                </div>
              </div>
              <DialogFooter className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleUpdateItem} disabled={!newTitle.english.trim() && !newTitle.tamil.trim() && !newTitle.sinhala.trim()}>
                  Update
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}

// ----------------- Initial Data -----------------
const initialChairmanData: ChairmanData = {
  name: {
    english: "Dr. Sarah Johnson",
    tamil: "டாக்டர் சாரா ஜான்சன்",
    sinhala: "ඩා. සාරා ජොන්සන්"
  },
  position: {
    english: "Chairman",
    tamil: "தலைவர்",
    sinhala: "ප්‍රධානියා"
  },
  photo: "https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=300",
  message: {
    english: "As Chairman, I am committed to serving our community with transparency, dedication, and progress. Together, we will build a stronger, more prosperous future for all residents.",
    tamil: "தலைவராக, நான் வெளிப்படைத்தன்மை, அர்ப்பணிப்பு மற்றும் முன்னேற்றத்துடன் எங்கள் சமூகத்திற்கு சேவை செய்ய உறுதிபூண்டுள்ளேன். ஒன்றாக, அனைத்து குடிமக்களுக்கும் வலுவான, செழிப்பான எதிர்காலத்தை உருவாக்குவோம்.",
    sinhala: "ප්‍රධානියා ලෙස, පාරදෘෂ්ටිකත්වය, කැපවීම සහ ප්‍රගතිය සමඟ අපගේ ප්‍රජාවට සේවය කිරීමට මම ප්‍රතිඥා දෙනවා. එක්ව, සියලුම වැසියන් සඳහා ශක්තිමත්, සමෘද්ධිමත් අනාගතයක් ගොඩනඟමු."
  },
  contact: {
    phone: "+1 (555) 123-4567",
    email: "chairman@council.gov",
    address: {
      english: "Municipal Building, Main Street",
      tamil: "நகராட்சி கட்டடம், மெயின் தெரு",
      sinhala: "මහ නගර සභා ගොඩනැගිල්ල, ප්‍රධාන වීදිය"
    }
  },
  tenure: {
    startDate: {
      english: "January 2022",
      tamil: "ஜனவரி 2022",
      sinhala: "2022 ජනවාරි"
    },
    currentTerm: {
      english: "2022-2026",
      tamil: "2022-2026",
      sinhala: "2022-2026"
    }
  }
};

// ----------------- ChairmanPage Component -----------------
export default function ChairmanPage() {
  const [chairmanData, setChairmanData] = useState<ChairmanData>(initialChairmanData);
  const [editData, setEditData] = useState<ChairmanData>(initialChairmanData);
  const [currentLanguage, setCurrentLanguage] = useState('english');

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);

  // Academics & Honours
  const [academics, setAcademics] = useState<InfoCardItem[]>([
    { 
      id: '1',
      title: {
        english: "Master of Science (Mechanical Engineering, Production Technology)",
        tamil: "முதுநிலை அறிவியல் (இயந்திர பொறியியல், உற்பத்தி தொழில்நுட்பம்)",
        sinhala: "විද්‍යා මාස්ටර් (යාන්ත්‍රික ඉංජිනේරු, නිෂ්පාදන තාක්ෂණය)"
      },
      subtext: {
        english: "University of XYZ, Country",
        tamil: "எக்ஸ்ஒய்இசட் பல்கலைக்கழகம், நாடு",
        sinhala: "XYZ විශ්වවිද්‍යාලය, රට"
      }
    }
  ]);

  const [honours, setHonours] = useState<InfoCardItem[]>([
    { 
      id: '1',
      title: {
        english: "Master of Science (M.Sc.) in Mechanical Engineering",
        tamil: "இயந்திர பொறியியலில் முதுநிலை அறிவியல் (M.Sc.)",
        sinhala: "යාන්ත්‍රික ඉංජිනේරු විද්‍යාවේ මාස්ටර් උපාධිය (M.Sc.)"
      },
      subtext: {
        english: "Tribhuvan University, Kathmandu, Nepal",
        tamil: "திரிபுவன் பல்கலைக்கழகம், காட்மாண்டு, நேபாளம்",
        sinhala: "ත්‍රිභුවන විශ්වවිද්‍යාලය, කතමණ්ඩු, නේපාලය"
      }
    }
  ]);

  // Helper function to get text in current language
  const getText = (text: { english: string; tamil: string; sinhala: string }) => {
    return text[currentLanguage as keyof typeof text] || text.english;
  };

  // Save profile
  const handleSaveProfile = () => {
    setChairmanData(editData);
    setIsEditDialogOpen(false);
  }

  // Save message
  const handleSaveMessage = () => {
    setChairmanData({...chairmanData, message: editData.message});
    setIsMessageDialogOpen(false);
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chairman Management</h1>
          <p className="text-gray-600">Manage chairman profile and information</p>
        </div>
        <div className="flex space-x-2">
          {/* Language Selector */}
          <Select value={currentLanguage} onValueChange={setCurrentLanguage}>
            <SelectTrigger className="w-40">
              <Languages className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Edit Profile */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader className="sticky top-0 bg-white z-10 pb-4 border-b">
                <DialogTitle>Edit Chairman Profile</DialogTitle>
                <p className="text-sm text-gray-500 mt-1">Update chairman information in all languages.</p>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {/* Name Fields */}
                <div className="space-y-2">
                  <Label htmlFor="name-english">Name (English)</Label>
                  <Input 
                    id="name-english" 
                    value={editData.name.english} 
                    onChange={(e) => setEditData({...editData, name: {...editData.name, english: e.target.value}})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name-tamil">Name (Tamil)</Label>
                  <Input 
                    id="name-tamil" 
                    value={editData.name.tamil} 
                    onChange={(e) => setEditData({...editData, name: {...editData.name, tamil: e.target.value}})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name-sinhala">Name (Sinhala)</Label>
                  <Input 
                    id="name-sinhala" 
                    value={editData.name.sinhala} 
                    onChange={(e) => setEditData({...editData, name: {...editData.name, sinhala: e.target.value}})} 
                  />
                </div>

                {/* Position Fields */}
                <div className="space-y-2">
                  <Label htmlFor="position-english">Position (English)</Label>
                  <Input 
                    id="position-english" 
                    value={editData.position.english} 
                    onChange={(e) => setEditData({...editData, position: {...editData.position, english: e.target.value}})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position-tamil">Position (Tamil)</Label>
                  <Input 
                    id="position-tamil" 
                    value={editData.position.tamil} 
                    onChange={(e) => setEditData({...editData, position: {...editData.position, tamil: e.target.value}})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position-sinhala">Position (Sinhala)</Label>
                  <Input 
                    id="position-sinhala" 
                    value={editData.position.sinhala} 
                    onChange={(e) => setEditData({...editData, position: {...editData.position, sinhala: e.target.value}})} 
                  />
                </div>

                {/* Contact Fields */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    value={editData.contact.phone} 
                    onChange={(e) => setEditData({...editData, contact: {...editData.contact, phone: e.target.value}})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    value={editData.contact.email} 
                    onChange={(e) => setEditData({...editData, contact: {...editData.contact, email: e.target.value}})} 
                  />
                </div>

                {/* Address Fields */}
                <div className="space-y-2">
                  <Label htmlFor="address-english">Address (English)</Label>
                  <Input 
                    id="address-english" 
                    value={editData.contact.address.english} 
                    onChange={(e) => setEditData({...editData, contact: {...editData.contact, address: {...editData.contact.address, english: e.target.value}}})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address-tamil">Address (Tamil)</Label>
                  <Input 
                    id="address-tamil" 
                    value={editData.contact.address.tamil} 
                    onChange={(e) => setEditData({...editData, contact: {...editData.contact, address: {...editData.contact.address, tamil: e.target.value}}})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address-sinhala">Address (Sinhala)</Label>
                  <Input 
                    id="address-sinhala" 
                    value={editData.contact.address.sinhala} 
                    onChange={(e) => setEditData({...editData, contact: {...editData.contact, address: {...editData.contact.address, sinhala: e.target.value}}})} 
                  />
                </div>

                {/* Tenure Fields */}
                <div className="space-y-2">
                  <Label htmlFor="term-english">Current Term (English)</Label>
                  <Input 
                    id="term-english" 
                    value={editData.tenure.currentTerm.english} 
                    onChange={(e) => setEditData({...editData, tenure: {...editData.tenure, currentTerm: {...editData.tenure.currentTerm, english: e.target.value}}})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="term-tamil">Current Term (Tamil)</Label>
                  <Input 
                    id="term-tamil" 
                    value={editData.tenure.currentTerm.tamil} 
                    onChange={(e) => setEditData({...editData, tenure: {...editData.tenure, currentTerm: {...editData.tenure.currentTerm, tamil: e.target.value}}})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="term-sinhala">Current Term (Sinhala)</Label>
                  <Input 
                    id="term-sinhala" 
                    value={editData.tenure.currentTerm.sinhala} 
                    onChange={(e) => setEditData({...editData, tenure: {...editData.tenure, currentTerm: {...editData.tenure.currentTerm, sinhala: e.target.value}}})} 
                  />
                </div>
              </div>
              <DialogFooter className="sticky bottom-0 bg-white pt-4 border-t">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveProfile}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Profile & Message */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile */}
        <Card className="lg:col-span-1 hover:shadow-lg transition-shadow">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-gray-200">
              <img src={chairmanData.photo} alt={getText(chairmanData.name)} className="w-full h-full object-cover" />
            </div>
            <CardTitle className="flex items-center justify-center gap-2">
              <Crown className="w-5 h-5 text-yellow-600" />
              {getText(chairmanData.name)}
            </CardTitle>
            <CardDescription className="text-lg font-medium">{getText(chairmanData.position)}</CardDescription>
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
              <span>{getText(chairmanData.contact.address)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Message */}
        <Card className="lg:col-span-2 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Chairman's Message</CardTitle>
              <CardDescription>Official message from the chairman</CardDescription>
            </div>
            <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Update Message
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Update Chairman's Message</DialogTitle>
                  <p className="text-sm text-gray-500 mt-1">Edit the official message in all languages.</p>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div className="space-y-2">
                    <Label>Message (English)</Label>
                    <Textarea 
                      value={editData.message.english} 
                      onChange={(e) => setEditData({...editData, message: {...editData.message, english: e.target.value}})} 
                      className="min-h-[100px]" 
                      placeholder="Enter chairman's message in English..." 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Message (Tamil)</Label>
                    <Textarea 
                      value={editData.message.tamil} 
                      onChange={(e) => setEditData({...editData, message: {...editData.message, tamil: e.target.value}})} 
                      className="min-h-[100px]" 
                      placeholder="Enter chairman's message in Tamil..." 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Message (Sinhala)</Label>
                    <Textarea 
                      value={editData.message.sinhala} 
                      onChange={(e) => setEditData({...editData, message: {...editData.message, sinhala: e.target.value}})} 
                      className="min-h-[100px]" 
                      placeholder="Enter chairman's message in Sinhala..." 
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsMessageDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleSaveMessage}>Update Message</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed text-lg">"{getText(chairmanData.message)}"</p>
          </CardContent>
        </Card>
      </div>

      {/* Academics & Honours */}
      <InfoCard 
        title="Academics & Qualifications" 
        description="Educational background and qualifications" 
        icon={Award} 
        items={academics} 
        setItems={setAcademics}
        language={currentLanguage}
      />
      <InfoCard 
        title="Honours" 
        description="Recognitions and honours received" 
        icon={Award} 
        items={honours} 
        setItems={setHonours}
        language={currentLanguage}
      />

    </div>
  );
}