"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Search, Eye, Edit, Trash2, Pin, Calendar, MapPin, Users, FolderPlus, Download, Bell, Clock, User, X } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  description: string;
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

interface AnnouncementCardProps {
  announcement: Announcement;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
  getPriorityColor: (priority: string) => string;
  getStatusColor: (status: string) => string;
  formatDate: (dateString: string) => string;
}

const AnnouncementCard = ({ announcement, onView, onEdit, onDelete, onTogglePin, getPriorityColor, getStatusColor, formatDate }: AnnouncementCardProps) => (
  <Card className="hover:shadow-lg transition-shadow duration-300 relative overflow-hidden bg-white">
    <div className="absolute top-0 right-0 p-2">
      <Button variant="ghost" size="icon" onClick={onTogglePin} aria-label="Pin/Unpin Announcement">
        <Pin className={`h-5 w-5 ${announcement.isPinned ? 'text-blue-500 fill-blue-500' : 'text-gray-400'}`} />
      </Button>
    </div>
    <CardContent className="flex flex-col md:flex-row p-6 items-start md:items-center">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <CardTitle className="text-xl font-semibold truncate hover:text-blue-600 transition-colors cursor-pointer" onClick={onView}>
            {announcement.title}
          </CardTitle>
          {!announcement.isViewed && (
            <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
              New
            </Badge>
          )}
        </div>
        <CardDescription className="text-sm text-gray-600 mb-3 line-clamp-2">{announcement.description}</CardDescription>
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Published: {formatDate(announcement.date)}</span>
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
          <Badge className={getPriorityColor(announcement.priority)}>{announcement.priority.toUpperCase()}</Badge>
          <Badge className={getStatusColor(announcement.status)}>{announcement.status.toUpperCase()}</Badge>
          <Badge variant="secondary">{announcement.category}</Badge>
        </div>
      </div>
      <div className="flex-shrink-0 flex items-center gap-3 mt-4 md:mt-0 md:ml-6">
        <Button variant="outline" size="icon" onClick={onView} aria-label="View Announcement">
          <Eye className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onEdit} aria-label="Edit Announcement">
          <Edit className="w-4 h-4" />
        </Button>
        <Button variant="destructive" size="icon" onClick={onDelete} aria-label="Delete Announcement">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default function PublicAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: '1',
      title: 'Water Supply Maintenance - Ward 3 & 4',
      description: 'Scheduled water supply maintenance will affect Ward 3 and Ward 4 areas from January 17, 6:00 AM to 4:00 PM. Alternative water supply arrangements have been made at community centers.',
      date: '2024-01-16',
      category: 'Utility',
      ward: 'Ward 3 & 4, Mannar',
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
      title: 'Road Closure - Main Street Repair',
      description: 'Main Street will be closed for emergency repairs from January 18-20. Please use alternate routes via Church Road and Market Street.',
      date: '2024-01-15',
      category: 'Infrastructure',
      ward: 'Ward 1, Mannar',
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
    },
    {
      id: '3',
      title: 'Community Meeting Announcement',
      description: 'Monthly community meeting scheduled for January 25th at Town Hall. Agenda includes budget discussion and infrastructure projects.',
      date: '2024-01-14',
      category: 'Community',
      ward: 'All Wards',
      status: 'active',
      priority: 'low',
      views: 567,
      attachments: 1,
      startDate: '2024-01-25',
      endDate: '2024-01-25',
      contactPerson: 'Community Leader',
      contactPhone: '+94 75 345 6789',
      location: 'Town Hall, Mannar',
      isPinned: false,
      isViewed: true
    },
    {
      id: '4',
      title: 'Public Health Clinic Opening',
      description: 'A new public health clinic is opening in Ward 2 on January 28th. It will offer free check-ups and vaccinations.',
      date: '2024-01-13',
      category: 'Health',
      ward: 'Ward 2, Mannar',
      status: 'active',
      priority: 'high',
      views: 731,
      attachments: 1,
      startDate: '2024-01-28',
      endDate: '2024-01-28',
      contactPerson: 'Dr. Jane Doe',
      contactPhone: '+94 71 987 6543',
      location: 'New Clinic Building, Mannar',
      isPinned: false,
      isViewed: false
    },
    {
      id: '5',
      title: 'Annual Festival Planning Committee Meeting',
      description: 'All residents are invited to the annual festival planning meeting on February 5th. Your ideas are welcome!',
      date: '2024-01-12',
      category: 'Community',
      ward: 'All Wards',
      status: 'draft',
      priority: 'low',
      views: 204,
      attachments: 0,
      startDate: '2024-02-05',
      endDate: '2024-02-05',
      contactPerson: 'Festival Committee',
      contactPhone: '+94 77 111 2222',
      location: 'Community Hall',
      isPinned: false,
      isViewed: true
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    description: '',
    category: '',
    ward: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    status: 'active' as 'active' | 'expired' | 'draft',
    startDate: '',
    endDate: '',
    contactPerson: '',
    contactPhone: '',
    location: '',
    isPinned: false
  });

  const sortedAnnouncements = [...announcements].sort((a, b) => {
    // Pinned announcements first
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    // New announcements next
    if (!a.isViewed && b.isViewed) return -1;
    if (a.isViewed && !b.isViewed) return 1;
    // Otherwise, sort by date
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const filteredAnnouncements = sortedAnnouncements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          announcement.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || announcement.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || announcement.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleCreateAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.description || !newAnnouncement.category || !newAnnouncement.ward) {
      // Use a custom message box instead of alert()
      console.error('Please fill in all required fields');
      return;
    }

    const announcement: Announcement = {
      id: (Date.now()).toString(),
      title: newAnnouncement.title,
      description: newAnnouncement.description,
      date: new Date().toISOString().split('T')[0],
      category: newAnnouncement.category,
      ward: newAnnouncement.ward,
      status: newAnnouncement.status,
      priority: newAnnouncement.priority,
      views: 0,
      attachments: 0,
      startDate: newAnnouncement.startDate,
      endDate: newAnnouncement.endDate,
      contactPerson: newAnnouncement.contactPerson,
      contactPhone: newAnnouncement.contactPhone,
      location: newAnnouncement.location,
      isPinned: newAnnouncement.isPinned,
      isViewed: false
    };
    
    setAnnouncements([announcement, ...announcements]);
    setNewAnnouncement({ 
      title: '', 
      description: '', 
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
    setIsCreateDialogOpen(false);
  };

  const handleViewAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setIsViewDialogOpen(true);
    
    if (!announcement.isViewed) {
      setAnnouncements(prev => 
        prev.map(a => 
          a.id === announcement.id 
            ? { ...a, views: a.views + 1, isViewed: true }
            : a
        )
      );
    }
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
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
    setIsEditDialogOpen(true);
  };

  const handleUpdateAnnouncement = () => {
    if (!selectedAnnouncement || !newAnnouncement.title || !newAnnouncement.description || !newAnnouncement.category || !newAnnouncement.ward) {
      // Use a custom message box instead of alert()
      console.error('Please fill in all required fields');
      return;
    }

    const updatedAnnouncements = announcements.map(announcement =>
      announcement.id === selectedAnnouncement.id 
        ? {
            ...announcement,
            title: newAnnouncement.title,
            description: newAnnouncement.description,
            category: newAnnouncement.category,
            ward: newAnnouncement.ward,
            priority: newAnnouncement.priority,
            status: newAnnouncement.status,
            startDate: newAnnouncement.startDate,
            endDate: newAnnouncement.endDate,
            contactPerson: newAnnouncement.contactPerson,
            contactPhone: newAnnouncement.contactPhone,
            location: newAnnouncement.location,
            isPinned: newAnnouncement.isPinned
          }
        : announcement
    );

    setAnnouncements(updatedAnnouncements);
    setIsEditDialogOpen(false);
    setSelectedAnnouncement(null);
    setNewAnnouncement({ 
      title: '', 
      description: '', 
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

  const handleDeleteAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteAnnouncement = () => {
    if (selectedAnnouncement) {
      const updatedAnnouncements = announcements.filter(a => a.id !== selectedAnnouncement.id);
      setAnnouncements(updatedAnnouncements);
      setIsDeleteDialogOpen(false);
      setSelectedAnnouncement(null);
    }
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-50 text-green-700 border-green-200';
      case 'expired': return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'draft': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const totalViews = announcements.reduce((sum, announcement) => sum + announcement.views, 0);
  const totalAttachments = announcements.reduce((sum, announcement) => sum + announcement.attachments, 0);
  const activeAnnouncements = announcements.filter(announcement => announcement.status === 'active').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Public Announcements</h1>
            <p className="text-gray-600 mt-2">Manage and publish important community announcements</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white mt-4 sm:mt-0">
                <Plus className="w-4 h-4 mr-2" />
                Create Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Announcement</DialogTitle>
                <DialogDescription>
                  Fill in all the details for the new public announcement. Fields marked with * are required.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                    placeholder="Enter announcement title"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={newAnnouncement.description}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, description: e.target.value})}
                    placeholder="Enter detailed announcement description"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={newAnnouncement.category} onValueChange={(value) => setNewAnnouncement({...newAnnouncement, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Utility">Utility</SelectItem>
                        <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                        <SelectItem value="Community">Community</SelectItem>
                        <SelectItem value="Safety">Safety</SelectItem>
                        <SelectItem value="Health">Health</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* <div className="grid gap-2">
                    <Label htmlFor="ward">Ward *</Label>
                    <Input
                      id="ward"
                      value={newAnnouncement.ward}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, ward: e.target.value})}
                      placeholder="e.g., Ward 3 & 4, Mannar"
                    />
                  </div> */}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={newAnnouncement.priority} onValueChange={(value: 'high' | 'medium' | 'low') => setNewAnnouncement({...newAnnouncement, priority: value})}>
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
                    <Select value={newAnnouncement.status} onValueChange={(value: 'active' | 'expired' | 'draft') => setNewAnnouncement({...newAnnouncement, status: value})}>
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
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, startDate: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={newAnnouncement.endDate}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, endDate: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="contactPerson">Contact Person</Label>
                    <Input
                      id="contactPerson"
                      value={newAnnouncement.contactPerson}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, contactPerson: e.target.value})}
                      placeholder="Name of contact person"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      value={newAnnouncement.contactPhone}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, contactPhone: e.target.value})}
                      placeholder="Phone number"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newAnnouncement.location}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, location: e.target.value})}
                    placeholder="Specific location or venue"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={newAnnouncement.isPinned}
                    onCheckedChange={(checked) => setNewAnnouncement({...newAnnouncement, isPinned: checked})}
                  />
                  <Label htmlFor="pin">Pin this announcement to top</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateAnnouncement}>Publish Announcement</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <Bell className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Announcements</p>
                  <p className="text-2xl font-bold text-gray-900">{announcements.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <Eye className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-gray-900">{activeAnnouncements}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100">
                  <Users className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900">{totalViews}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100">
                  <FolderPlus className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Attachments</p>
                  <p className="text-2xl font-bold text-gray-900">{totalAttachments}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6 bg-white">
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
                    <SelectItem value="Utility">Utility</SelectItem>
                    <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="Community">Community</SelectItem>
                    <SelectItem value="Safety">Safety</SelectItem>
                    <SelectItem value="Health">Health</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="flex items-center gap-2" onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                  setFilterCategory('all');
                }}>
                  <X className="w-4 h-4" />
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
                onView={() => handleViewAnnouncement(announcement)}
                onEdit={() => handleEditAnnouncement(announcement)}
                onDelete={() => handleDeleteAnnouncement(announcement)}
                onTogglePin={() => togglePin(announcement.id)}
                getPriorityColor={getPriorityColor}
                getStatusColor={getStatusColor}
                formatDate={formatDate}
              />
            ))
          ) : (
            <Card className="text-center py-12 bg-white">
              <CardContent>
                <FolderPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No announcements found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* View Announcement Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedAnnouncement?.isPinned && <Pin className="w-4 h-4 text-blue-500 fill-current" />}
                {selectedAnnouncement?.title}
              </DialogTitle>
            </DialogHeader>
            {selectedAnnouncement && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge className={getPriorityColor(selectedAnnouncement.priority)}>
                    {selectedAnnouncement.priority.toUpperCase()}
                  </Badge>
                  <Badge className={getStatusColor(selectedAnnouncement.status)}>
                    {selectedAnnouncement.status.toUpperCase()}
                  </Badge>
                  <Badge variant="secondary">{selectedAnnouncement.category}</Badge>
                  {!selectedAnnouncement.isViewed && (
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                      New
                    </Badge>
                  )}
                </div>
                
                <div>
                  <p className="text-gray-700">{selectedAnnouncement.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 flex items-center gap-1">
                      <User className="w-4 h-4" /> Contact Person:
                    </span>
                    <span className="font-medium">{selectedAnnouncement.contactPerson || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 flex items-center gap-1">
                      <Clock className="w-4 h-4" /> Contact Phone:
                    </span>
                    <span className="font-medium">{selectedAnnouncement.contactPhone || 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Announcement Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Announcement</DialogTitle>
              <DialogDescription>
                Update the details for this public announcement.
              </DialogDescription>
            </DialogHeader>
            {selectedAnnouncement && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-title">Title *</Label>
                  <Input
                    id="edit-title"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                    placeholder="Enter announcement title"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Description *</Label>
                  <Textarea
                    id="edit-description"
                    value={newAnnouncement.description}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, description: e.target.value})}
                    placeholder="Enter detailed announcement description"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-category">Category *</Label>
                    <Select value={newAnnouncement.category} onValueChange={(value) => setNewAnnouncement({...newAnnouncement, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Utility">Utility</SelectItem>
                        <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                        <SelectItem value="Community">Community</SelectItem>
                        <SelectItem value="Safety">Safety</SelectItem>
                        <SelectItem value="Health">Health</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* <div className="grid gap-2">
                    <Label htmlFor="edit-ward">Ward *</Label>
                    <Input
                      id="edit-ward"
                      value={newAnnouncement.ward}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, ward: e.target.value})}
                      placeholder="e.g., Ward 3 & 4, Mannar"
                    />
                  </div> */}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-priority">Priority</Label>
                    <Select value={newAnnouncement.priority} onValueChange={(value: 'high' | 'medium' | 'low') => setNewAnnouncement({...newAnnouncement, priority: value})}>
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
                    <Label htmlFor="edit-status">Status</Label>
                    <Select value={newAnnouncement.status} onValueChange={(value: 'active' | 'expired' | 'draft') => setNewAnnouncement({...newAnnouncement, status: value})}>
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
                    <Label htmlFor="edit-startDate">Start Date</Label>
                    <Input
                      id="edit-startDate"
                      type="date"
                      value={newAnnouncement.startDate}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, startDate: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-endDate">End Date</Label>
                    <Input
                      id="edit-endDate"
                      type="date"
                      value={newAnnouncement.endDate}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, endDate: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-contactPerson">Contact Person</Label>
                    <Input
                      id="edit-contactPerson"
                      value={newAnnouncement.contactPerson}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, contactPerson: e.target.value})}
                      placeholder="Name of contact person"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-contactPhone">Contact Phone</Label>
                    <Input
                      id="edit-contactPhone"
                      value={newAnnouncement.contactPhone}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, contactPhone: e.target.value})}
                      placeholder="Phone number"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-location">Location</Label>
                  <Input
                    id="edit-location"
                    value={newAnnouncement.location}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, location: e.target.value})}
                    placeholder="Specific location or venue"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={newAnnouncement.isPinned}
                    onCheckedChange={(checked) => setNewAnnouncement({...newAnnouncement, isPinned: checked})}
                  />
                  <Label htmlFor="edit-pin">Pin this announcement to top</Label>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsEditDialogOpen(false);
                setSelectedAnnouncement(null);
              }}>Cancel</Button>
              <Button onClick={handleUpdateAnnouncement}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Announcement Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the announcement titled "{selectedAnnouncement?.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={confirmDeleteAnnouncement}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}
