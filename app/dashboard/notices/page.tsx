"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Plus, Edit, Trash2, Search, Calendar, Eye, EyeOff, Clock, Languages, MapPin } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Step 1: Define Notice type with multi-language support
interface Notice {
  id: number;
  title: {
    en: string;
    ta: string;
    si: string;
  };
  content: {
    en: string;
    ta: string;
    si: string;
  };
  category: string;
  priority: string;
  status: string;
  publishDate: string;
  scheduledDate: string;
  author: string;
  location: {
    en: string;
    ta: string;
    si: string;
  };
}

// Step 2: Initial Data
const noticesData: Notice[] = [
  {
    id: 1,
    title: {
      en: "Road Closure Notice - Main Street",
      ta: "சாலை மூடப்படும் அறிவிப்பு - மெயின் ஸ்ட்ரீட்",
      si: "වීදි වසාදැමීමේ නිවේදනය - ප්‍රධාන වීදිය"
    },
    content: {
      en: "Main Street will be closed for maintenance from January 15-20, 2025. Alternative routes are available via Oak Avenue.",
      ta: "மெயின் ஸ்ட்ரீட் ஜனவரி 15-20, 2025 வரை பராமரிப்பிற்காக மூடப்படும். ஓக் அவென்யூ வழியாக மாற்று வழிகள் உள்ளன.",
      si: "ප්‍රධාන වීදිය 2025 ජනවාරි 15-20 දක්වා නඩත්තුව සඳහා වසා දමනු ඇත. ඔක් ඇවිනියු හරහා විකල්ප මාර්ග ලබා ගත හැකිය."
    },
    category: "Infrastructure",
    priority: "High",
    status: "Published",
    publishDate: "2025-01-10",
    scheduledDate: "2025-01-15",
    author: "Admin",
    location: {
      en: "Main Street, City Center",
      ta: "மெயின் ஸ்ட்ரீட், நகர மையம்",
      si: "ප්‍රධාන වීදිය, නගර මධ්‍යස්ථානය"
    }
  },
  {
    id: 2,
    title: {
      en: "Community Meeting - Budget Discussion",
      ta: "சமூக கூட்டம் - பட்ஜெட் விவாதம்",
      si: "ප්‍රජා රැස්වීම - අයවැය සාකච්ඡාව"
    },
    content: {
      en: "Join us for the annual budget discussion meeting on February 5th at the Municipal Building.",
      ta: "பிப்ரவரி 5 ஆம் தேதி நகராட்சி கட்டடத்தில் வருடாந்திர பட்ஜெட் விவாதக் கூட்டத்தில் கலந்து கொள்ளுங்கள்.",
      si: "පෙබරවාරි 5 වන දින නගර සභා ගොඩනැගිල්ලේදී වාර්ෂික අයවැය සාකච්ඡා රැස්වීමට සහභාගි වන්න."
    },
    category: "Meeting",
    priority: "Medium",
    status: "Scheduled",
    publishDate: "2025-01-25",
    scheduledDate: "2025-02-05",
    author: "Secretary",
    location: {
      en: "Municipal Building, Conference Hall",
      ta: "நகராட்சி கட்டடம், மாநாட்டு மண்டபம்",
      si: "නගර සභා ගොඩනැගිල්ල, සම්මන්ත්‍රණ ශාලාව"
    }
  }
];

export default function NoticesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [notices, setNotices] = useState<Notice[]>(noticesData);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const [newNotice, setNewNotice] = useState<Omit<Notice, 'id' | 'status' | 'publishDate' | 'author'>>({
    title: { en: '', ta: '', si: '' },
    content: { en: '', ta: '', si: '' },
    category: 'Infrastructure',
    priority: 'Medium',
    scheduledDate: '',
    location: { en: '', ta: '', si: '' }
  });

  const categories = ['Infrastructure', 'Meeting', 'Utilities', 'Environment', 'General'];
  const priorities = ['Low', 'Medium', 'High', 'Urgent'];

  const filteredNotices = notices.filter((notice) => {
    const matchesSearch =
      notice.title.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.title.ta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.title.si.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.content.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.content.ta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.content.si.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || notice.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const validateNotice = (notice: typeof newNotice): boolean => {
    // Check if all title fields are filled
    if (!notice.title.en.trim() || !notice.title.ta.trim() || !notice.title.si.trim()) {
      showAlert('error', 'Please fill in the title in all three languages');
      return false;
    }
    
    // Check if all content fields are filled
    if (!notice.content.en.trim() || !notice.content.ta.trim() || !notice.content.si.trim()) {
      showAlert('error', 'Please fill in the content in all three languages');
      return false;
    }

    // Check if all location fields are filled
    if (!notice.location.en.trim() || !notice.location.ta.trim() || !notice.location.si.trim()) {
      showAlert('error', 'Please fill in the location in all three languages');
      return false;
    }

    return true;
  };

  const handleAddNotice = () => {
    if (!validateNotice(newNotice)) {
      return;
    }

    const notice: Notice = {
      id: notices.length + 1,
      ...newNotice,
      status: 'Draft',
      publishDate: '',
      author: 'Admin'
    };
    setNotices([...notices, notice]);
    setNewNotice({ 
      title: { en: '', ta: '', si: '' }, 
      content: { en: '', ta: '', si: '' }, 
      category: 'Infrastructure', 
      priority: 'Medium', 
      scheduledDate: '',
      location: { en: '', ta: '', si: '' }
    });
    setIsAddDialogOpen(false);
    showAlert('success', 'Notice added successfully!');
  };

  const handleEditNotice = (notice: Notice) => {
    setSelectedNotice(notice);
    setIsEditDialogOpen(true);
  };

  const handleUpdateNotice = () => {
    if (!selectedNotice) return;

    if (!validateNotice(selectedNotice)) {
      return;
    }

    setNotices(notices.map(notice =>
      notice.id === selectedNotice.id ? selectedNotice : notice
    ));
    setIsEditDialogOpen(false);
    showAlert('success', 'Notice updated successfully!');
  };

  const handleDeleteNotice = (id: number) => {
    setNotices(notices.filter(notice => notice.id !== id));
    showAlert('success', 'Notice deleted successfully!');
  };

  const handlePublishToggle = (id: number) => {
    setNotices(notices.map(notice =>
      notice.id === id
        ? { 
            ...notice, 
            status: notice.status === 'Published' ? 'Draft' : 'Published', 
            publishDate: notice.status === 'Draft' ? new Date().toISOString().split('T')[0] : '' 
          }
        : notice
    ));
    showAlert('success', 'Notice status updated!');
  };

  const handleScheduleNotice = (id: number, date: string) => {
    setNotices(notices.map(notice =>
      notice.id === id
        ? { ...notice, status: 'Scheduled', scheduledDate: date }
        : notice
    ));
    setIsScheduleDialogOpen(false);
    showAlert('success', 'Notice scheduled successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Alert */}
      {alert && (
        <Alert className={alert.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
          <AlertDescription className={alert.type === 'success' ? 'text-green-800' : 'text-red-800'}>
            {alert.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notices & Announcements</h1>
          <p className="text-gray-600">Manage public notices and community announcements</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Notice
        </Button>
      </div>

      {/* Notices Table */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Notices Directory</CardTitle>
          <CardDescription>Manage all public notices and announcements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search notices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Notice (English)</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Scheduled Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotices.map((notice) => (
                  <TableRow key={notice.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <p className="font-medium">{notice.title.en}</p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">{notice.content.en}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-gray-500" />
                        <span className="text-sm">{notice.location.en}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{notice.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        notice.priority === 'Urgent' ? 'destructive' :
                          notice.priority === 'High' ? 'default' :
                            notice.priority === 'Medium' ? 'secondary' : 'outline'
                      }>
                        {notice.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        notice.status === 'Published' ? 'default' :
                          notice.status === 'Scheduled' ? 'secondary' : 'outline'
                      }>
                        {notice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1 text-sm">
                        <Calendar className="w-3 h-3" />
                        <span>{notice.scheduledDate ? new Date(notice.scheduledDate).toLocaleDateString() : 'Not set'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditNotice(notice)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePublishToggle(notice.id)}
                        >
                          {notice.status === 'Published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedNotice(notice);
                            setIsScheduleDialogOpen(true);
                          }}
                        >
                          <Clock className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDeleteNotice(notice.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Notice Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Notice</DialogTitle>
            <DialogDescription>Create a new public notice or announcement in all three languages.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            
            {/* Title Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Languages className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-medium">Title</h3>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="add-title-en">English Title</Label>
                  <Input
                    id="add-title-en"
                    placeholder="Enter title in English"
                    value={newNotice.title.en}
                    onChange={(e) => setNewNotice({ 
                      ...newNotice, 
                      title: { ...newNotice.title, en: e.target.value } 
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-title-ta">Tamil Title</Label>
                  <Input
                    id="add-title-ta"
                    placeholder="Enter title in Tamil"
                    value={newNotice.title.ta}
                    onChange={(e) => setNewNotice({ 
                      ...newNotice, 
                      title: { ...newNotice.title, ta: e.target.value } 
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-title-si">Sinhala Title</Label>
                  <Input
                    id="add-title-si"
                    placeholder="Enter title in Sinhala"
                    value={newNotice.title.si}
                    onChange={(e) => setNewNotice({ 
                      ...newNotice, 
                      title: { ...newNotice.title, si: e.target.value } 
                    })}
                  />
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Languages className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-medium">Content</h3>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="add-content-en">English Content</Label>
                  <Textarea
                    id="add-content-en"
                    placeholder="Enter content in English"
                    value={newNotice.content.en}
                    onChange={(e) => setNewNotice({ 
                      ...newNotice, 
                      content: { ...newNotice.content, en: e.target.value } 
                    })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-content-ta">Tamil Content</Label>
                  <Textarea
                    id="add-content-ta"
                    placeholder="Enter content in Tamil"
                    value={newNotice.content.ta}
                    onChange={(e) => setNewNotice({ 
                      ...newNotice, 
                      content: { ...newNotice.content, ta: e.target.value } 
                    })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-content-si">Sinhala Content</Label>
                  <Textarea
                    id="add-content-si"
                    placeholder="Enter content in Sinhala"
                    value={newNotice.content.si}
                    onChange={(e) => setNewNotice({ 
                      ...newNotice, 
                      content: { ...newNotice.content, si: e.target.value } 
                    })}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-medium">Location</h3>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="add-location-en">English Location</Label>
                  <Input
                    id="add-location-en"
                    placeholder="Enter location in English"
                    value={newNotice.location.en}
                    onChange={(e) => setNewNotice({ 
                      ...newNotice, 
                      location: { ...newNotice.location, en: e.target.value } 
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-location-ta">Tamil Location</Label>
                  <Input
                    id="add-location-ta"
                    placeholder="Enter location in Tamil"
                    value={newNotice.location.ta}
                    onChange={(e) => setNewNotice({ 
                      ...newNotice, 
                      location: { ...newNotice.location, ta: e.target.value } 
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-location-si">Sinhala Location</Label>
                  <Input
                    id="add-location-si"
                    placeholder="Enter location in Sinhala"
                    value={newNotice.location.si}
                    onChange={(e) => setNewNotice({ 
                      ...newNotice, 
                      location: { ...newNotice.location, si: e.target.value } 
                    })}
                  />
                </div>
              </div>
            </div>

            {/* Category, Priority, Scheduled Date */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="add-category">Category</Label>
                <Select value={newNotice.category} onValueChange={(value) => setNewNotice({ ...newNotice, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-priority">Priority</Label>
                <Select value={newNotice.priority} onValueChange={(value) => setNewNotice({ ...newNotice, priority: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-scheduled">Scheduled Date</Label>
                <Input
                  id="add-scheduled"
                  type="date"
                  value={newNotice.scheduledDate}
                  onChange={(e) => setNewNotice({ ...newNotice, scheduledDate: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddNotice}>Add Notice</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Notice Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Notice</DialogTitle>
            <DialogDescription>Update the notice details in all three languages.</DialogDescription>
          </DialogHeader>
          {selectedNotice && (
            <div className="grid gap-6 py-4">
              
              {/* Title Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Languages className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-medium">Title</h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-title-en">English Title</Label>
                    <Input
                      id="edit-title-en"
                      placeholder="Enter title in English"
                      value={selectedNotice.title.en}
                      onChange={(e) => setSelectedNotice({ 
                        ...selectedNotice, 
                        title: { ...selectedNotice.title, en: e.target.value } 
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-title-ta">Tamil Title</Label>
                    <Input
                      id="edit-title-ta"
                      placeholder="Enter title in Tamil"
                      value={selectedNotice.title.ta}
                      onChange={(e) => setSelectedNotice({ 
                        ...selectedNotice, 
                        title: { ...selectedNotice.title, ta: e.target.value } 
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-title-si">Sinhala Title</Label>
                    <Input
                      id="edit-title-si"
                      placeholder="Enter title in Sinhala"
                      value={selectedNotice.title.si}
                      onChange={(e) => setSelectedNotice({ 
                        ...selectedNotice, 
                        title: { ...selectedNotice.title, si: e.target.value } 
                      })}
                    />
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Languages className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-medium">Content</h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-content-en">English Content</Label>
                    <Textarea
                      id="edit-content-en"
                      placeholder="Enter content in English"
                      value={selectedNotice.content.en}
                      onChange={(e) => setSelectedNotice({ 
                        ...selectedNotice, 
                        content: { ...selectedNotice.content, en: e.target.value } 
                      })}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-content-ta">Tamil Content</Label>
                    <Textarea
                      id="edit-content-ta"
                      placeholder="Enter content in Tamil"
                      value={selectedNotice.content.ta}
                      onChange={(e) => setSelectedNotice({ 
                        ...selectedNotice, 
                        content: { ...selectedNotice.content, ta: e.target.value } 
                      })}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-content-si">Sinhala Content</Label>
                    <Textarea
                      id="edit-content-si"
                      placeholder="Enter content in Sinhala"
                      value={selectedNotice.content.si}
                      onChange={(e) => setSelectedNotice({ 
                        ...selectedNotice, 
                        content: { ...selectedNotice.content, si: e.target.value } 
                      })}
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Location Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-medium">Location</h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-location-en">English Location</Label>
                    <Input
                      id="edit-location-en"
                      placeholder="Enter location in English"
                      value={selectedNotice.location.en}
                      onChange={(e) => setSelectedNotice({ 
                        ...selectedNotice, 
                        location: { ...selectedNotice.location, en: e.target.value } 
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-location-ta">Tamil Location</Label>
                    <Input
                      id="edit-location-ta"
                      placeholder="Enter location in Tamil"
                      value={selectedNotice.location.ta}
                      onChange={(e) => setSelectedNotice({ 
                        ...selectedNotice, 
                        location: { ...selectedNotice.location, ta: e.target.value } 
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-location-si">Sinhala Location</Label>
                    <Input
                      id="edit-location-si"
                      placeholder="Enter location in Sinhala"
                      value={selectedNotice.location.si}
                      onChange={(e) => setSelectedNotice({ 
                        ...selectedNotice, 
                        location: { ...selectedNotice.location, si: e.target.value } 
                      })}
                    />
                  </div>
                </div>
              </div>

              {/* Category, Priority, Scheduled Date */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select value={selectedNotice.category} onValueChange={(value) => setSelectedNotice({ ...selectedNotice, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-priority">Priority</Label>
                  <Select value={selectedNotice.priority} onValueChange={(value) => setSelectedNotice({ ...selectedNotice, priority: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-scheduled">Scheduled Date</Label>
                  <Input
                    id="edit-scheduled"
                    type="date"
                    value={selectedNotice.scheduledDate}
                    onChange={(e) => setSelectedNotice({ ...selectedNotice, scheduledDate: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateNotice}>Update Notice</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Notice Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Schedule Notice</DialogTitle>
            <DialogDescription>Set a scheduled date for this notice.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="schedule-date" className="text-right">Date</Label>
              <Input
                id="schedule-date"
                type="date"
                className="col-span-3"
                defaultValue={selectedNotice?.scheduledDate}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              const dateInput = document.getElementById('schedule-date') as HTMLInputElement;
              handleScheduleNotice(selectedNotice!.id, dateInput.value);
            }}>Schedule Notice</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}