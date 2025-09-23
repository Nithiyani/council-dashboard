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
import { Images, Plus, Upload, Trash2, Search, Video, FolderPlus, Eye, Download, Calendar, Clock, User, Bell, Pin, Edit, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  time: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  isPinned: boolean;
  attachments: string[];
  views: number;
  isViewed?: boolean;
}

export default function AnnouncementsUI() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: '1',
      title: 'System Maintenance Scheduled',
      content: 'There will be a scheduled system maintenance this weekend. The system will be unavailable from 10 PM Saturday to 2 AM Sunday. Please save all your work before the maintenance window begins.',
      author: 'IT Department',
      date: '2024-01-15',
      time: '14:30',
      priority: 'high',
      category: 'System',
      isPinned: true,
      attachments: ['maintenance-schedule.pdf'],
      views: 142,
      isViewed: true
    },
    {
      id: '2',
      title: 'Quarterly Meeting Reminder',
      content: 'Don\'t forget about the quarterly all-hands meeting next Friday. Please prepare your department updates and have your reports ready for presentation.',
      author: 'HR Department',
      date: '2024-01-12',
      time: '09:15',
      priority: 'medium',
      category: 'Meeting',
      isPinned: true,
      attachments: ['agenda.docx', 'presentation.pptx'],
      views: 89,
      isViewed: false
    },
    {
      id: '3',
      title: 'New Feature Release',
      content: 'We\'ve released new dashboard analytics features. Check out the updated documentation for details on how to use the new reporting tools and data visualization options.',
      author: 'Product Team',
      date: '2024-01-10',
      time: '11:00',
      priority: 'medium',
      category: 'Update',
      isPinned: false,
      attachments: ['release-notes.pdf', 'user-guide.pdf'],
      views: 67,
      isViewed: true
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    category: 'General',
    priority: 'medium' as 'low' | 'medium' | 'high',
    isPinned: false
  });

  const [editAnnouncement, setEditAnnouncement] = useState({
    id: '',
    title: '',
    content: '',
    category: 'General',
    priority: 'medium' as 'low' | 'medium' | 'high',
    isPinned: false
  });

  const categories = ['All', 'System', 'Meeting', 'Update', 'General', 'Urgent'];

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || announcement.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateAnnouncement = () => {
    const announcement: Announcement = {
      id: Date.now().toString(),
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      author: 'Current User',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      priority: newAnnouncement.priority,
      category: newAnnouncement.category,
      isPinned: newAnnouncement.isPinned,
      attachments: [],
      views: 0,
      isViewed: false
    };

    setAnnouncements(prev => [announcement, ...prev]);
    setIsCreateDialogOpen(false);
    setNewAnnouncement({
      title: '',
      content: '',
      category: 'General',
      priority: 'medium',
      isPinned: false
    });
  };

  const handleViewAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setIsViewDialogOpen(true);
    
    // Mark as viewed and increment views
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
    setEditAnnouncement({
      id: announcement.id,
      title: announcement.title,
      content: announcement.content,
      category: announcement.category,
      priority: announcement.priority,
      isPinned: announcement.isPinned
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateAnnouncement = () => {
    setAnnouncements(prev => 
      prev.map(announcement => 
        announcement.id === editAnnouncement.id 
          ? { 
              ...announcement, 
              title: editAnnouncement.title,
              content: editAnnouncement.content,
              category: editAnnouncement.category,
              priority: editAnnouncement.priority,
              isPinned: editAnnouncement.isPinned
            }
          : announcement
      )
    );
    setIsEditDialogOpen(false);
    setEditAnnouncement({
      id: '',
      title: '',
      content: '',
      category: 'General',
      priority: 'medium',
      isPinned: false
    });
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

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(announcement => announcement.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Announcements</h1>
            <p className="text-gray-600">Stay updated with the latest news and updates</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                New Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Announcement</DialogTitle>
                <DialogDescription>
                  Share important information with your team members.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter announcement title"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Enter announcement content"
                    rows={5}
                    value={newAnnouncement.content}
                    onChange={(e) => setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={newAnnouncement.category} onValueChange={(value) => setNewAnnouncement(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General">General</SelectItem>
                        <SelectItem value="System">System</SelectItem>
                        <SelectItem value="Meeting">Meeting</SelectItem>
                        <SelectItem value="Update">Update</SelectItem>
                        <SelectItem value="Urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={newAnnouncement.priority} onValueChange={(value: 'low' | 'medium' | 'high') => setNewAnnouncement(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={newAnnouncement.isPinned}
                    onCheckedChange={(checked) => setNewAnnouncement(prev => ({ ...prev, isPinned: checked }))}
                  />
                  <Label htmlFor="pin">Pin to top</Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateAnnouncement}>
                  Create Announcement
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search announcements..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.filter(cat => cat !== 'All').map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Announcements Grid */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Announcements</TabsTrigger>
            <TabsTrigger value="pinned">Pinned</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredAnnouncements.map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                onTogglePin={togglePin}
                onDelete={deleteAnnouncement}
                onView={handleViewAnnouncement}
                onEdit={handleEditAnnouncement}
                getPriorityColor={getPriorityColor}
              />
            ))}
          </TabsContent>

          <TabsContent value="pinned" className="space-y-4">
            {filteredAnnouncements.filter(a => a.isPinned).map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                onTogglePin={togglePin}
                onDelete={deleteAnnouncement}
                onView={handleViewAnnouncement}
                onEdit={handleEditAnnouncement}
                getPriorityColor={getPriorityColor}
              />
            ))}
          </TabsContent>

          <TabsContent value="recent" className="space-y-4">
            {filteredAnnouncements
              .filter(a => new Date(a.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
              .map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  onTogglePin={togglePin}
                  onDelete={deleteAnnouncement}
                  onView={handleViewAnnouncement}
                  onEdit={handleEditAnnouncement}
                  getPriorityColor={getPriorityColor}
                />
              ))}
          </TabsContent>
        </Tabs>

        {filteredAnnouncements.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <FolderPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600">No announcements found</h3>
              <p className="text-gray-500">Try adjusting your search or create a new announcement.</p>
            </CardContent>
          </Card>
        )}

        {/* View Announcement Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedAnnouncement?.isPinned && <Pin className="w-4 h-4 text-blue-500 fill-current" />}
                {selectedAnnouncement?.title}
              </DialogTitle>
              <DialogDescription>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-2">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{selectedAnnouncement?.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{selectedAnnouncement?.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{selectedAnnouncement?.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{selectedAnnouncement?.views} views</span>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="flex gap-2">
                <Badge className={getPriorityColor(selectedAnnouncement?.priority || 'medium')}>
                  {(selectedAnnouncement?.priority || 'medium').toUpperCase()}
                </Badge>
                <Badge variant="secondary">{selectedAnnouncement?.category}</Badge>
                {selectedAnnouncement?.isPinned && (
                  <Badge variant="outline" className="text-blue-600 border-blue-200">
                    <Pin className="w-3 h-3 mr-1" />
                    Pinned
                  </Badge>
                )}
              </div>
              
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line">{selectedAnnouncement?.content}</p>
              </div>
              
              {selectedAnnouncement?.attachments && selectedAnnouncement.attachments.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Attachments ({selectedAnnouncement.attachments.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAnnouncement.attachments.map((attachment, index) => (
                      <Badge key={index} variant="outline" className="cursor-pointer hover:bg-gray-100 px-3 py-1">
                        {attachment}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Announcement Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Announcement</DialogTitle>
              <DialogDescription>
                Update the announcement details below.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  placeholder="Enter announcement title"
                  value={editAnnouncement.title}
                  onChange={(e) => setEditAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-content">Content</Label>
                <Textarea
                  id="edit-content"
                  placeholder="Enter announcement content"
                  rows={5}
                  value={editAnnouncement.content}
                  onChange={(e) => setEditAnnouncement(prev => ({ ...prev, content: e.target.value }))}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select value={editAnnouncement.category} onValueChange={(value) => setEditAnnouncement(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General">General</SelectItem>
                      <SelectItem value="System">System</SelectItem>
                      <SelectItem value="Meeting">Meeting</SelectItem>
                      <SelectItem value="Update">Update</SelectItem>
                      <SelectItem value="Urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-priority">Priority</Label>
                  <Select value={editAnnouncement.priority} onValueChange={(value: 'low' | 'medium' | 'high') => setEditAnnouncement(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={editAnnouncement.isPinned}
                  onCheckedChange={(checked) => setEditAnnouncement(prev => ({ ...prev, isPinned: checked }))}
                />
                <Label htmlFor="edit-pin">Pin to top</Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateAnnouncement}>
                Update Announcement
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

interface AnnouncementCardProps {
  announcement: Announcement;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (announcement: Announcement) => void;
  onEdit: (announcement: Announcement) => void;
  getPriorityColor: (priority: string) => string;
}

function AnnouncementCard({ announcement, onTogglePin, onDelete, onView, onEdit, getPriorityColor }: AnnouncementCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className={`transition-all duration-300 hover:shadow-lg ${
      announcement.isPinned ? 'border-l-4 border-l-blue-500' : ''
    } ${!announcement.isViewed ? 'bg-blue-50 border-blue-200' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                {announcement.isPinned && <Pin className="w-4 h-4 text-blue-500 fill-current" />}
                {!announcement.isViewed && <Badge variant="secondary" className="bg-blue-100 text-blue-800">New</Badge>}
                {announcement.title}
              </CardTitle>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{announcement.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{announcement.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{announcement.time}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{announcement.views} views</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge className={getPriorityColor(announcement.priority)}>
                {announcement.priority.toUpperCase()}
              </Badge>
              <Badge variant="secondary">{announcement.category}</Badge>
              {!announcement.isViewed && (
                <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                  Unread
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTogglePin(announcement.id)}
              title={announcement.isPinned ? "Unpin" : "Pin"}
            >
              <Pin className={`w-4 h-4 ${announcement.isPinned ? 'text-blue-500 fill-current' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(announcement)}
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(announcement)}
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(announcement.id)}
              className="text-red-600 hover:text-red-700"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <CardDescription className={`text-gray-700 ${isExpanded ? '' : 'line-clamp-3'}`}>
          {announcement.content}
        </CardDescription>
        
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-700"
          >
            {isExpanded ? 'Show Less' : 'Read More'}
          </Button>
          
          {announcement.attachments.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Download className="w-4 h-4" />
              <span>{announcement.attachments.length} attachment(s)</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}