"use client";
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Eye, Edit, Trash2, Pin, Calendar, MapPin, Users, FolderPlus, Bell, User, X, AlertCircle, CheckCircle } from 'lucide-react';

// Types
type Language = 'en' | 'ta' | 'si';

interface AnnouncementContent {
  en: string;
  ta: string;
  si: string;
}

interface Announcement {
  id: string;
  title: AnnouncementContent;
  description: AnnouncementContent;
  date: string;
  category: string;
  ward: string;
  status: 'active' | 'expired' | 'draft';
  priority: 'high' | 'medium' | 'low';
  views: number;
  attachments: number;
  startDate: string;
  endDate: string;
  contactPerson: string;
  contactPhone: string;
  location: string;
  isPinned: boolean;
  isViewed?: boolean;
  

}

// Constants
const CATEGORIES = ['Utility', 'Infrastructure', 'Community', 'Safety', 'Health', 'Education', 'Other'] as const;
const WARDS = ['All Wards', 'Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5', 'Ward 6'] as const;
const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'ta', label: 'Tamil' },
  { value: 'si', label: 'Sinhala' }
];

const SAMPLE_ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    title: {
      en: 'Water Supply Maintenance - Ward 3 & 4',
      ta: 'நீர் விநியோக பராமரிப்பு - வார்டு 3 & 4',
      si: 'ජල සැපයුම් නඩත්තුව - වාර්ඩ් 3 & 4'
    },
    description: {
      en: 'Scheduled water supply maintenance will affect Ward 3 and Ward 4 areas from January 17, 6:00 AM to 4:00 PM. Alternative water supply arrangements have been made at community centers.',
      ta: 'ஜனவரி 17, காலை 6:00 மணி முதல் மாலை 4:00 மணி வரை வார்டு 3 மற்றும் வார்டு 4 பகுதிகளை பராமரிப்பு பாதிக்கும். சமூக மையங்களில் மாற்று நீர் விநியோக ஏற்பாடுகள் செய்யப்பட்டுள்ளன.',
      si: 'ජනවාරි 17, පෙ.ව. 6:00 සිට ප.ව. 4:00 දක්වා වාර්ඩ් 3 සහ වාර්ඩ් 4 ප්‍රදේශ නඩත්තුවෙන් පීඩාවට ලක්වනු ඇත. සමාජ මධ්‍යස්ථානවල විකල්ප ජල සැපයුම් ගනුදෙනු සකස් කර ඇත.'
    },
    date: '2024-01-16',
    category: 'Utility',
    ward: 'Ward 3 & 4',
    status: 'active',
    priority: 'high',
    views: 1245,
    attachments: 3,
    startDate: '2024-01-17',
    endDate: '2024-01-17',
    contactPerson: 'Mr. John Smith',
    contactPhone: '+94 77 123 4567',
    location: 'Community Center, Mannar',
    isPinned: true,
    isViewed: true
  },
  {
    id: '2',
    title: {
      en: 'Road Closure - Main Street Repair',
      ta: 'சாலை மூடப்படுதல் - மெயின் தெரு பழுது',
      si: 'වීදි වසාදැමීම - ප්‍රධාන වීදිය අලුත්වැඩියාව'
    },
    description: {
      en: 'Main Street will be closed for emergency repairs from January 18-20. Please use alternate routes via Church Road and Market Street.',
      ta: 'ஜனவரி 18-20 வரை அவசர பழுதுபார்ப்பிற்காக மெயின் தெரு மூடப்படும். தயவுசெய்து சர்ச் ரோடு மற்றும் மார்க்கெட் தெரு வழியாக மாற்று வழிகளைப் பயன்படுத்தவும்.',
      si: 'ජනවාරි 18-20 දක්වා හදිසි අලුත්වැඩියා සඳහා ප්‍රධාන වීදිය වසා දමනු ලැබේ. කරුණාකර චර්ච් රෝඩ් සහ මාර්කට් වීදිය හරහා විකල්ප මාර්ග භාවිතා කරන්න.'
    },
    date: '2024-01-15',
    category: 'Infrastructure',
    ward: 'Ward 1',
    status: 'active',
    priority: 'medium',
    views: 892,
    attachments: 2,
    startDate: '2024-01-18',
    endDate: '2024-01-20',
    contactPerson: 'Ms. Sarah Johnson',
    contactPhone: '+94 76 234 5678',
    location: 'Main Street, Mannar',
    isPinned: true,
    isViewed: false
  }
];

// Utility Functions
const getPriorityColor = (priority: string) => {
  const colors = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200'
  };
  return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
};

const getStatusColor = (status: string) => {
  const colors = {
    active: 'bg-green-100 text-green-800 border-green-200',
    expired: 'bg-gray-100 text-gray-800 border-gray-200',
    draft: 'bg-blue-100 text-blue-800 border-blue-200'
  };
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
};

const formatDate = (dateString: string) => {
  if (!dateString) return 'Not specified';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Components
const LanguageTabs = ({ 
  value, 
  onValueChange,
  type = "view"
}: { 
  value: Language; 
  onValueChange: (value: Language) => void;
  type?: "view" | "edit";
}) => (
  <Tabs value={value} onValueChange={(val) => onValueChange(val as Language)}>
    <TabsList className="grid w-full grid-cols-3">
      {LANGUAGES.map((lang) => (
        <TabsTrigger key={lang.value} value={lang.value}>
          {lang.label}
        </TabsTrigger>
      ))}
    </TabsList>
  </Tabs>
);


const StatsCard = ({ icon: Icon, title, value, color }: { icon: any; title: string; value: number; color: string }) => (
  <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
    <CardContent className="p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const AlertMessage = ({ type, title, message }: { type: 'error' | 'success'; title: string; message: string }) => {
  const styles = {
    error: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-green-50 border-green-200 text-green-800'
  };
  
  return (
    <div className={`border rounded-md p-4 ${styles[type]}`}>
      <div className="flex items-center">
        {type === 'error' ? <AlertCircle className="w-5 h-5 mr-2" /> : <CheckCircle className="w-5 h-5 mr-2" />}
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
};

const AnnouncementCard = ({ 
  announcement, 
  onView, 
  onEdit, 
  onDelete, 
  onTogglePin,
  currentLanguage
}: { 
  announcement: Announcement;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
  currentLanguage: Language;
}) => (
  <Card className="bg-white/90 backdrop-blur-sm hover:shadow-lg transition-shadow relative overflow-hidden">
    <div className="absolute top-0 right-0 p-2">
      <Button variant="ghost" size="icon" onClick={onTogglePin} aria-label="Pin/Unpin">
        <Pin className={`h-5 w-5 ${announcement.isPinned ? 'text-blue-500 fill-blue-500' : 'text-gray-400'}`} />
      </Button>
    </div>
    <CardContent className="flex flex-col md:flex-row p-6 items-start md:items-center">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <CardTitle className="text-xl font-semibold truncate hover:text-blue-600 transition-colors cursor-pointer" onClick={onView}>
            {announcement.title[currentLanguage]}
          </CardTitle>
          {!announcement.isViewed && (
            <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
              New
            </Badge>
          )}
        </div>
        <CardDescription className="text-sm text-gray-600 mb-3 line-clamp-2">
          {announcement.description[currentLanguage]}
        </CardDescription>
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(announcement.date)}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{announcement.ward}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>{announcement.contactPerson || 'No Contact'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <Badge variant="outline" className={getPriorityColor(announcement.priority)}>
            {announcement.priority.toUpperCase()}
          </Badge>
          <Badge variant="outline" className={getStatusColor(announcement.status)}>
            {announcement.status.toUpperCase()}
          </Badge>
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            {announcement.category}
          </Badge>
        </div>

        {/* Language Indicators */}
        <div className="flex gap-2 mt-3">
          <Badge variant="outline" className="text-xs bg-gray-50">
            TA: {announcement.title.ta.substring(0, 20)}...
          </Badge>
          <Badge variant="outline" className="text-xs bg-gray-50">
            SI: {announcement.title.si.substring(0, 20)}...
          </Badge>
        </div>
      </div>
      <div className="flex-shrink-0 flex items-center gap-3 mt-4 md:mt-0 md:ml-6">
        <Button variant="outline" size="icon" onClick={onView} aria-label="View">
          <Eye className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onEdit} aria-label="Edit">
          <Edit className="w-4 h-4" />
        </Button>
        <Button variant="destructive" size="icon" onClick={onDelete} aria-label="Delete">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default function PublicAnnouncementsPage() {
  // State
  const [announcements, setAnnouncements] = useState<Announcement[]>(SAMPLE_ANNOUNCEMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [dialogState, setDialogState] = useState({ create: false, view: false, edit: false, delete: false });
  const [message, setMessage] = useState({ type: '', text: '' });

  const [newAnnouncement, setNewAnnouncement] = useState({
  title: { en: '', ta: '', si: '' },
  description: { en: '', ta: '', si: '' },
  category: '',
  ward: '',
  priority: 'medium' as 'high' | 'medium' | 'low', // Fix: Cast to the correct union type
  status: 'active' as 'active' | 'expired' | 'draft',
  startDate: '',
  endDate: '',
  contactPerson: '',
  contactPhone: '',
  location: '',
  isPinned: false
});

  // Computed values
  const sortedAnnouncements = [...announcements].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    if (!a.isViewed && b.isViewed) return -1;
    if (a.isViewed && !b.isViewed) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const filteredAnnouncements = sortedAnnouncements.filter(announcement => {
    const matchesSearch = Object.values(announcement.title).some(title => 
      title.toLowerCase().includes(searchTerm.toLowerCase())
    ) || Object.values(announcement.description).some(desc =>
      desc.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = filterStatus === 'all' || announcement.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || announcement.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const stats = {
    total: announcements.length,
    active: announcements.filter(a => a.status === 'active').length,
    views: announcements.reduce((sum, a) => sum + a.views, 0),
    attachments: announcements.reduce((sum, a) => sum + a.attachments, 0)
  };

  // Handlers
  const validateAnnouncement = (): string | null => {
    const missingFields = [];
    
    if (!newAnnouncement.category) missingFields.push('Category');
    if (!newAnnouncement.ward) missingFields.push('Ward');
    
    LANGUAGES.forEach(lang => {
      if (!newAnnouncement.title[lang.value].trim()) missingFields.push(`${lang.label} Title`);
      if (!newAnnouncement.description[lang.value].trim()) missingFields.push(`${lang.label} Description`);
    });

    return missingFields.length > 0 ? `Please fill in: ${missingFields.join(', ')}` : null;
  };

  const handleCreateAnnouncement = () => {
    const error = validateAnnouncement();
    if (error) {
      setMessage({ type: 'error', text: error });
      return;
    }

    const announcement: Announcement = {
      id: Date.now().toString(),
      ...newAnnouncement,
      views: 0,
      attachments: 0,
      date: new Date().toISOString().split('T')[0],
      isViewed: false
    };
    
    setAnnouncements([announcement, ...announcements]);
    resetForm();
    setMessage({ type: 'success', text: 'Announcement created successfully!' });
    setTimeout(() => setMessage({ type: '', text: '' }), 2000);
  };

  const handleUpdateAnnouncement = () => {
    const error = validateAnnouncement();
    if (error) {
      setMessage({ type: 'error', text: error });
      return;
    }

    if (!selectedAnnouncement) return;

    const updatedAnnouncements = announcements.map(announcement =>
      announcement.id === selectedAnnouncement.id 
        ? { ...announcement, ...newAnnouncement }
        : announcement
    );

    setAnnouncements(updatedAnnouncements);
    resetForm();
    setMessage({ type: 'success', text: 'Announcement updated successfully!' });
    setTimeout(() => setMessage({ type: '', text: '' }), 2000);
  };

  const handleDeleteAnnouncement = () => {
    if (!selectedAnnouncement) return;
    setAnnouncements(announcements.filter(a => a.id !== selectedAnnouncement.id));
    setDialogState(prev => ({ ...prev, delete: false }));
  };

  const resetForm = () => {
    setNewAnnouncement({
      title: { en: '', ta: '', si: '' },
      description: { en: '', ta: '', si: '' },
      category: '',
      ward: '',
      priority: 'medium',
      status: 'active',
      startDate: '',
      endDate: '',
      contactPerson: '',
      contactPhone: '',
      location: '',
      isPinned: false
    });
  };

  const openDialog = (type: keyof typeof dialogState, announcement?: Announcement) => {
    if (announcement) setSelectedAnnouncement(announcement);
    if (type === 'edit' && announcement) {
      setNewAnnouncement({
        title: announcement.title,
        description: announcement.description,
        category: announcement.category,
        ward: announcement.ward,
        priority: announcement.priority,
        status: announcement.status,
        startDate: announcement.startDate,
        endDate: announcement.endDate,
        contactPerson: announcement.contactPerson,
        contactPhone: announcement.contactPhone,
        location: announcement.location,
        isPinned: announcement.isPinned
      });
    }
    if (type === 'view' && announcement && !announcement.isViewed) {
      setAnnouncements(prev => 
        prev.map(a => 
          a.id === announcement.id 
            ? { ...a, views: a.views + 1, isViewed: true }
            : a
        )
      );
    }
    setDialogState(prev => ({ ...prev, [type]: true }));
  };

  const closeDialog = (type: keyof typeof dialogState) => {
    setDialogState(prev => ({ ...prev, [type]: false }));
    setMessage({ type: '', text: '' });
    if (type === 'create' || type === 'edit') resetForm();
  };

  const updateAnnouncementField = (field: string, value: string) => {
    setNewAnnouncement(prev => ({ ...prev, [field]: value }));
  };

  const updateAnnouncementContent = (field: 'title' | 'description', value: string) => {
    setNewAnnouncement(prev => ({
      ...prev,
      [field]: { ...prev[field], [selectedLanguage]: value }
    }));
  };

  const togglePin = (id: string) => {
    setAnnouncements(prev => 
      prev.map(announcement => 
        announcement.id === id 
          ? { ...announcement, isPinned: !announcement.isPinned }
          : announcement
      )
    );
  };

  const getLanguageLabel = (lang: Language) => {
    return LANGUAGES.find(l => l.value === lang)?.label || lang;
  };

  // Form Fields Component
  const AnnouncementFormFields = () => (
    <div className="grid gap-4 py-4">
      {/* Language Tabs */}
      <LanguageTabs value={selectedLanguage} onValueChange={setSelectedLanguage} type="edit" />

      {/* Title Input */}
      <div className="grid gap-2">
        <Label htmlFor="title">
          Title ({getLanguageLabel(selectedLanguage)}) *
        </Label>
        <Input
          id="title"
          value={newAnnouncement.title[selectedLanguage]}
          onChange={(e) => updateAnnouncementContent('title', e.target.value)}
          placeholder={`Enter title in ${getLanguageLabel(selectedLanguage)}`}
          className={!newAnnouncement.title[selectedLanguage].trim() && message.type === 'error' ? "border-red-500" : ""}
        />
        {!newAnnouncement.title[selectedLanguage].trim() && message.type === 'error' && (
          <p className="text-red-500 text-sm">Title is required in {getLanguageLabel(selectedLanguage)}</p>
        )}
      </div>

      {/* Description Input */}
      <div className="grid gap-2">
        <Label htmlFor="description">
          Description ({getLanguageLabel(selectedLanguage)}) *
        </Label>
        <Textarea
          id="description"
          value={newAnnouncement.description[selectedLanguage]}
          onChange={(e) => updateAnnouncementContent('description', e.target.value)}
          placeholder={`Enter description in ${getLanguageLabel(selectedLanguage)}`}
          rows={4}
          className={!newAnnouncement.description[selectedLanguage].trim() && message.type === 'error' ? "border-red-500" : ""}
        />
        {!newAnnouncement.description[selectedLanguage].trim() && message.type === 'error' && (
          <p className="text-red-500 text-sm">Description is required in {getLanguageLabel(selectedLanguage)}</p>
        )}
      </div>

      {/* Common Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="category">Category *</Label>
          <Select value={newAnnouncement.category} onValueChange={(value) => updateAnnouncementField('category', value)}>
            <SelectTrigger className={!newAnnouncement.category && message.type === 'error' ? "border-red-500" : ""}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!newAnnouncement.category && message.type === 'error' && (
            <p className="text-red-500 text-sm">Category is required</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="ward">Ward *</Label>
          <Select value={newAnnouncement.ward} onValueChange={(value) => updateAnnouncementField('ward', value)}>
            <SelectTrigger className={!newAnnouncement.ward && message.type === 'error' ? "border-red-500" : ""}>
              <SelectValue placeholder="Select ward" />
            </SelectTrigger>
            <SelectContent>
              {WARDS.map(ward => (
                <SelectItem key={ward} value={ward}>{ward}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!newAnnouncement.ward && message.type === 'error' && (
            <p className="text-red-500 text-sm">Ward is required</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="priority">Priority</Label>
          <Select value={newAnnouncement.priority} onValueChange={(value: 'high' | 'medium' | 'low') => updateAnnouncementField('priority', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="status">Status</Label>
          <Select value={newAnnouncement.status} onValueChange={(value: 'active' | 'expired' | 'draft') => updateAnnouncementField('status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={newAnnouncement.startDate}
            onChange={(e) => updateAnnouncementField('startDate', e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={newAnnouncement.endDate}
            onChange={(e) => updateAnnouncementField('endDate', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="contactPerson">Contact Person</Label>
          <Input
            id="contactPerson"
            value={newAnnouncement.contactPerson}
            onChange={(e) => updateAnnouncementField('contactPerson', e.target.value)}
            placeholder="Name of contact person"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="contactPhone">Contact Phone</Label>
          <Input
            id="contactPhone"
            value={newAnnouncement.contactPhone}
            onChange={(e) => updateAnnouncementField('contactPhone', e.target.value)}
            placeholder="Phone number"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={newAnnouncement.location}
          onChange={(e) => updateAnnouncementField('location', e.target.value)}
          placeholder="Specific location or venue"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={newAnnouncement.isPinned}
          onCheckedChange={(checked) => updateAnnouncementField('isPinned', checked.toString())}
        />
        <Label htmlFor="pin">Pin this announcement to top</Label>
      </div>
    </div>
  );

  // Render
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Public Announcements</h1>
            <p className="text-gray-600 mt-2">Manage community announcements</p>
          </div>
          <Button 
            onClick={() => openDialog('create')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white mt-4 sm:mt-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Announcement
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard icon={Bell} title="Total Announcements" value={stats.total} color="blue" />
          <StatsCard icon={Eye} title="Active" value={stats.active} color="green" />
          <StatsCard icon={Users} title="Total Views" value={stats.views} color="yellow" />
          <StatsCard icon={FolderPlus} title="Attachments" value={stats.attachments} color="purple" />
        </div>

        {/* Language Switcher */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <p className="text-sm text-gray-600 mb-4 sm:mb-0">
            Showing {filteredAnnouncements.length} of {announcements.length} announcements
          </p>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">View in:</span>
            <Select value={currentLanguage} onValueChange={(val: Language) => setCurrentLanguage(val)}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map(lang => (
                  <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search & Filters */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search announcements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => { setSearchTerm(''); setFilterStatus('all'); setFilterCategory('all'); }}>
                  <X className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Announcements List */}
        <div className="space-y-4">
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                onView={() => openDialog('view', announcement)}
                onEdit={() => openDialog('edit', announcement)}
                onDelete={() => openDialog('delete', announcement)}
                onTogglePin={() => togglePin(announcement.id)}
                currentLanguage={currentLanguage}
              />
            ))
          ) : (
            <Card className="text-center py-12 bg-white/80 backdrop-blur-sm">
              <CardContent>
                <FolderPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No announcements found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Create/Edit Dialog */}
        {(dialogState.create || dialogState.edit) && (
          <Dialog open={dialogState.create || dialogState.edit} onOpenChange={() => closeDialog(dialogState.create ? 'create' : 'edit')}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{dialogState.create ? 'Create' : 'Edit'} Announcement</DialogTitle>
                <DialogDescription>
                  Fill in all details in all three languages. All language fields are required.
                </DialogDescription>
              </DialogHeader>
              
              <AnnouncementFormFields />

              {message.text && (
                <AlertMessage 
                  type={message.type as 'error' | 'success'} 
                  title={message.type === 'error' ? 'Validation Error' : 'Success'} 
                  message={message.text} 
                />
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => closeDialog(dialogState.create ? 'create' : 'edit')}>
                  Cancel
                </Button>
                <Button onClick={dialogState.create ? handleCreateAnnouncement : handleUpdateAnnouncement}>
                  {dialogState.create ? 'Publish' : 'Update'} Announcement
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* View Dialog */}
        {dialogState.view && selectedAnnouncement && (
          <Dialog open={dialogState.view} onOpenChange={() => closeDialog('view')}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedAnnouncement.isPinned && <Pin className="w-4 h-4 text-blue-500 fill-current" />}
                  Announcement Details
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className={getPriorityColor(selectedAnnouncement.priority)}>
                    {selectedAnnouncement.priority.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className={getStatusColor(selectedAnnouncement.status)}>
                    {selectedAnnouncement.status.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                    {selectedAnnouncement.category}
                  </Badge>
                  {!selectedAnnouncement.isViewed && (
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                      New
                    </Badge>
                  )}
                </div>

                {/* Language Tabs for Viewing */}
                <LanguageTabs value={currentLanguage} onValueChange={setCurrentLanguage} type="view" />
                
                <Tabs value={currentLanguage} className="w-full">
                  <TabsContent value={currentLanguage} className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{selectedAnnouncement.title[currentLanguage]}</h3>
                      <p className="text-gray-600 mt-2 whitespace-pre-wrap">{selectedAnnouncement.description[currentLanguage]}</p>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm border-t pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Published:</span>
                      <span className="font-medium">{formatDate(selectedAnnouncement.date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Ward:</span>
                      <span className="font-medium">{selectedAnnouncement.ward}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Views:</span>
                      <span className="font-medium">{selectedAnnouncement.views}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Start Date:</span>
                      <span className="font-medium">{formatDate(selectedAnnouncement.startDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">End Date:</span>
                      <span className="font-medium">{formatDate(selectedAnnouncement.endDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Location:</span>
                      <span className="font-medium">{selectedAnnouncement.location || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 flex items-center gap-1">
                      <User className="w-4 h-4" /> Contact Person:
                    </span>
                    <span className="font-medium">{selectedAnnouncement.contactPerson || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Contact Phone:</span>
                    <span className="font-medium">{selectedAnnouncement.contactPhone || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => closeDialog('view')}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Delete Dialog */}
        {dialogState.delete && selectedAnnouncement && (
          <Dialog open={dialogState.delete} onOpenChange={() => closeDialog('delete')}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete "{selectedAnnouncement.title.en}"? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => closeDialog('delete')}>Cancel</Button>
                <Button variant="destructive" onClick={handleDeleteAnnouncement}>Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}