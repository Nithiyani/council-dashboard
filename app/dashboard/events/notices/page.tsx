"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Images, Plus, Upload, Trash2, Search, Video, FolderPlus, Eye, Download, Calendar, MapPin, Users, Filter, MoreVertical, Edit, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface Notice {
  id: string;
  title: string;
  date: string;
  description: string;
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
}

const sampleNotices: Notice[] = [
  {
    id: '1',
    title: 'Water Supply Maintenance - Ward 3 & 4',
    date: '1/16/2024',
    description: 'Scheduled water supply maintenance will affect Ward 3 and Ward 4 areas from January 17, 6:00 AM to 4:00 PM. Alternative water supply arrangements have been made at community centers. Residents are advised to store adequate water for essential needs during this period.',
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
    location: 'Community Center, Mannar'
  },
  {
    id: '2',
    title: 'Road Closure - Main Street Repair',
    date: '1/15/2024',
    description: 'Main Street will be closed for emergency repairs from January 18-20. Please use alternate routes via Church Road and Market Street. Emergency vehicles will have access at all times.',
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
    location: 'Main Street, Mannar'
  },
  {
    id: '3',
    title: 'Community Meeting Announcement',
    date: '1/14/2024',
    description: 'Monthly community meeting scheduled for January 25th at Town Hall. Agenda includes budget discussion, infrastructure projects, and community welfare programs. All residents are welcome to participate.',
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
    location: 'Town Hall, Mannar'
  }
];

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>(sampleNotices);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [newNotice, setNewNotice] = useState({
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
    location: ''
  });

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || notice.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || notice.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleCreateNotice = () => {
    if (!newNotice.title || !newNotice.description || !newNotice.category || !newNotice.ward) {
      alert('Please fill in all required fields');
      return;
    }

    const notice: Notice = {
      id: (Date.now()).toString(),
      title: newNotice.title,
      date: new Date().toLocaleDateString(),
      description: newNotice.description,
      category: newNotice.category,
      ward: newNotice.ward,
      status: newNotice.status,
      priority: newNotice.priority,
      views: 0,
      attachments: 0,
      startDate: newNotice.startDate,
      endDate: newNotice.endDate,
      contactPerson: newNotice.contactPerson,
      contactPhone: newNotice.contactPhone,
      location: newNotice.location
    };
    
    setNotices([notice, ...notices]);
    setNewNotice({ 
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
      location: ''
    });
    setIsCreateDialogOpen(false);
  };

  const handleViewNotice = (notice: Notice) => {
    setSelectedNotice(notice);
    setIsViewDialogOpen(true);
  };

  const handleEditNotice = (notice: Notice) => {
    setSelectedNotice(notice);
    setNewNotice({
      title: notice.title,
      description: notice.description,
      category: notice.category,
      ward: notice.ward,
      priority: notice.priority,
      status: notice.status,
      startDate: notice.startDate,
      endDate: notice.endDate,
      contactPerson: notice.contactPerson,
      contactPhone: notice.contactPhone,
      location: notice.location
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateNotice = () => {
    if (!selectedNotice || !newNotice.title || !newNotice.description || !newNotice.category || !newNotice.ward) {
      alert('Please fill in all required fields');
      return;
    }

    const updatedNotices = notices.map(notice =>
      notice.id === selectedNotice.id 
        ? {
            ...notice,
            title: newNotice.title,
            description: newNotice.description,
            category: newNotice.category,
            ward: newNotice.ward,
            priority: newNotice.priority,
            status: newNotice.status,
            startDate: newNotice.startDate,
            endDate: newNotice.endDate,
            contactPerson: newNotice.contactPerson,
            contactPhone: newNotice.contactPhone,
            location: newNotice.location
          }
        : notice
    );

    setNotices(updatedNotices);
    setIsEditDialogOpen(false);
    setSelectedNotice(null);
    setNewNotice({ 
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
      location: ''
    });
  };

  const handleDeleteNotice = (notice: Notice) => {
    setSelectedNotice(notice);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteNotice = () => {
    if (selectedNotice) {
      const updatedNotices = notices.filter(notice => notice.id !== selectedNotice.id);
      setNotices(updatedNotices);
      setIsDeleteDialogOpen(false);
      setSelectedNotice(null);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'expired': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'draft': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Public Notices</h1>
            <p className="text-gray-600 mt-2">Manage and publish important community announcements</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white mt-4 sm:mt-0">
                <Plus className="w-4 h-4 mr-2" />
                Create Notice
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Notice</DialogTitle>
                <DialogDescription>
                  Fill in all the details for the new public notice. Fields marked with * are required.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={newNotice.title}
                    onChange={(e) => setNewNotice({...newNotice, title: e.target.value})}
                    placeholder="Enter notice title"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={newNotice.description}
                    onChange={(e) => setNewNotice({...newNotice, description: e.target.value})}
                    placeholder="Enter detailed notice description"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={newNotice.category} onValueChange={(value) => setNewNotice({...newNotice, category: value})}>
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
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="ward">Ward *</Label>
                    <Input
                      id="ward"
                      value={newNotice.ward}
                      onChange={(e) => setNewNotice({...newNotice, ward: e.target.value})}
                      placeholder="e.g., Ward 3 & 4, Mannar"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={newNotice.priority} onValueChange={(value: 'high' | 'medium' | 'low') => setNewNotice({...newNotice, priority: value})}>
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
                    <Select value={newNotice.status} onValueChange={(value: 'active' | 'expired' | 'draft') => setNewNotice({...newNotice, status: value})}>
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
                      value={newNotice.startDate}
                      onChange={(e) => setNewNotice({...newNotice, startDate: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={newNotice.endDate}
                      onChange={(e) => setNewNotice({...newNotice, endDate: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="contactPerson">Contact Person</Label>
                    <Input
                      id="contactPerson"
                      value={newNotice.contactPerson}
                      onChange={(e) => setNewNotice({...newNotice, contactPerson: e.target.value})}
                      placeholder="Name of contact person"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      value={newNotice.contactPhone}
                      onChange={(e) => setNewNotice({...newNotice, contactPhone: e.target.value})}
                      placeholder="Phone number"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newNotice.location}
                    onChange={(e) => setNewNotice({...newNotice, location: e.target.value})}
                    placeholder="Specific location or venue"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateNotice}>Publish Notice</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Notices</p>
                  <p className="text-2xl font-bold text-gray-900">{notices.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <Eye className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-gray-900">{notices.filter(n => n.status === 'active').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100">
                  <Users className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900">{notices.reduce((sum, notice) => sum + notice.views, 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100">
                  <FolderPlus className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Attachments</p>
                  <p className="text-2xl font-bold text-gray-900">{notices.reduce((sum, notice) => sum + notice.attachments, 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search notices..."
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

        {/* Notices Grid */}
        <div className="grid gap-6">
          {filteredNotices.map((notice) => (
            <Card key={notice.id} className="bg-white/90 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge variant="outline" className={getPriorityColor(notice.priority)}>
                        {notice.priority.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(notice.status)}>
                        {notice.status.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                        {notice.category}
                      </Badge>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{notice.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{notice.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {notice.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {notice.ward}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {notice.views} views
                      </div>
                      {notice.attachments > 0 && (
                        <div className="flex items-center gap-1">
                          <FolderPlus className="w-4 h-4" />
                          {notice.attachments} files
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-4 lg:mt-0 lg:ml-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-2"
                      onClick={() => handleViewNotice(notice)}
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-2"
                      onClick={() => handleEditNotice(notice)}
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteNotice(notice)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredNotices.length === 0 && (
          <Card className="text-center py-12 bg-white/80 backdrop-blur-sm">
            <CardContent>
              <FolderPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No notices found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        )}

        {/* View Notice Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Notice Details</DialogTitle>
            </DialogHeader>
            {selectedNotice && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className={getPriorityColor(selectedNotice.priority)}>
                    {selectedNotice.priority.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className={getStatusColor(selectedNotice.status)}>
                    {selectedNotice.status.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                    {selectedNotice.category}
                  </Badge>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedNotice.title}</h3>
                  <p className="text-gray-600 mt-2">{selectedNotice.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Published Date:</span>
                      <span className="font-medium">{selectedNotice.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Ward:</span>
                      <span className="font-medium">{selectedNotice.ward}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Views:</span>
                      <span className="font-medium">{selectedNotice.views}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Start Date:</span>
                      <span className="font-medium">{formatDate(selectedNotice.startDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">End Date:</span>
                      <span className="font-medium">{formatDate(selectedNotice.endDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Attachments:</span>
                      <span className="font-medium">{selectedNotice.attachments}</span>
                    </div>
                  </div>
                </div>
                
                {(selectedNotice.contactPerson || selectedNotice.contactPhone || selectedNotice.location) && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {selectedNotice.contactPerson && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Contact Person:</span>
                          <span className="font-medium">{selectedNotice.contactPerson}</span>
                        </div>
                      )}
                      {selectedNotice.contactPhone && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Contact Phone:</span>
                          <span className="font-medium">{selectedNotice.contactPhone}</span>
                        </div>
                      )}
                      {selectedNotice.location && (
                        <div className="flex justify-between md:col-span-2">
                          <span className="text-gray-500">Location:</span>
                          <span className="font-medium text-right">{selectedNotice.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Notice Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Notice</DialogTitle>
              <DialogDescription>
                Update the notice details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title *</Label>
                <Input
                  id="edit-title"
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({...newNotice, title: e.target.value})}
                  placeholder="Enter notice title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description *</Label>
                <Textarea
                  id="edit-description"
                  value={newNotice.description}
                  onChange={(e) => setNewNotice({...newNotice, description: e.target.value})}
                  placeholder="Enter detailed notice description"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-category">Category *</Label>
                  <Select value={newNotice.category} onValueChange={(value) => setNewNotice({...newNotice, category: value})}>
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
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-ward">Ward *</Label>
                  <Input
                    id="edit-ward"
                    value={newNotice.ward}
                    onChange={(e) => setNewNotice({...newNotice, ward: e.target.value})}
                    placeholder="e.g., Ward 3 & 4, Mannar"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-priority">Priority</Label>
                  <Select value={newNotice.priority} onValueChange={(value: 'high' | 'medium' | 'low') => setNewNotice({...newNotice, priority: value})}>
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
                  <Select value={newNotice.status} onValueChange={(value: 'active' | 'expired' | 'draft') => setNewNotice({...newNotice, status: value})}>
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
                    value={newNotice.startDate}
                    onChange={(e) => setNewNotice({...newNotice, startDate: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-endDate">End Date</Label>
                  <Input
                    id="edit-endDate"
                    type="date"
                    value={newNotice.endDate}
                    onChange={(e) => setNewNotice({...newNotice, endDate: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-contactPerson">Contact Person</Label>
                  <Input
                    id="edit-contactPerson"
                    value={newNotice.contactPerson}
                    onChange={(e) => setNewNotice({...newNotice, contactPerson: e.target.value})}
                    placeholder="Name of contact person"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-contactPhone">Contact Phone</Label>
                  <Input
                    id="edit-contactPhone"
                    value={newNotice.contactPhone}
                    onChange={(e) => setNewNotice({...newNotice, contactPhone: e.target.value})}
                    placeholder="Phone number"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  value={newNotice.location}
                  onChange={(e) => setNewNotice({...newNotice, location: e.target.value})}
                  placeholder="Specific location or venue"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdateNotice}>Update Notice</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this notice? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {selectedNotice && (
              <div className="py-4">
                <p className="font-medium text-gray-900">{selectedNotice.title}</p>
                <p className="text-sm text-gray-600 mt-1">{selectedNotice.category} • {selectedNotice.ward}</p>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={confirmDeleteNotice}>Delete Notice</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}