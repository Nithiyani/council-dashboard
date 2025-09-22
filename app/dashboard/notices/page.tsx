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
import { Bell, Plus, Edit, Trash2, Search, Calendar, Eye, EyeOff, Clock } from 'lucide-react';

// Step 1: Define Notice type
interface Notice {
  id: number;
  title: string;
  content: string;
  category: string;
  priority: string;
  status: string;
  publishDate: string;
  scheduledDate: string;
  author: string;
}

// Step 2: Initial Data
const noticesData: Notice[] = [
  {
    id: 1,
    title: "Road Closure Notice - Main Street",
    content: "Main Street will be closed for maintenance from January 15-20, 2025. Alternative routes are available via Oak Avenue.",
    category: "Infrastructure",
    priority: "High",
    status: "Published",
    publishDate: "2025-01-10",
    scheduledDate: "2025-01-15",
    author: "Admin"
  },
  {
    id: 2,
    title: "Community Meeting - Budget Discussion",
    content: "Join us for the annual budget discussion meeting on February 5th at the Municipal Building.",
    category: "Meeting",
    priority: "Medium",
    status: "Scheduled",
    publishDate: "2025-01-25",
    scheduledDate: "2025-02-05",
    author: "Secretary"
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
  const [newNotice, setNewNotice] = useState<Omit<Notice, 'id' | 'status' | 'publishDate' | 'author'>>({
    title: '',
    content: '',
    category: 'Infrastructure',
    priority: 'Medium',
    scheduledDate: ''
  });

  const categories = ['Infrastructure', 'Meeting', 'Utilities', 'Environment', 'General'];
  const priorities = ['Low', 'Medium', 'High', 'Urgent'];

  const filteredNotices = notices.filter((notice) => {
    const matchesSearch =
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || notice.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Step 3: Typed functions
  const handleAddNotice = () => {
    const notice: Notice = {
      id: notices.length + 1,
      ...newNotice,
      status: 'Draft',
      publishDate: '',
      author: 'Admin'
    };
    setNotices([...notices, notice]);
    setNewNotice({ title: '', content: '', category: 'Infrastructure', priority: 'Medium', scheduledDate: '' });
    setIsAddDialogOpen(false);
  };

  const handleEditNotice = (notice: Notice) => {
    setSelectedNotice(notice);
    setIsEditDialogOpen(true);
  };

  const handleDeleteNotice = (id: number) => {
    setNotices(notices.filter(notice => notice.id !== id));
  };

  const handlePublishToggle = (id: number) => {
    setNotices(notices.map(notice =>
      notice.id === id
        ? { ...notice, status: notice.status === 'Published' ? 'Draft' : 'Published', publishDate: notice.status === 'Draft' ? new Date().toISOString().split('T')[0] : '' }
        : notice
    ));
  };

  const handleScheduleNotice = (id: number, date: string) => {
    setNotices(notices.map(notice =>
      notice.id === id
        ? { ...notice, status: 'Scheduled', scheduledDate: date }
        : notice
    ));
    setIsScheduleDialogOpen(false);
  };

  return (
    <div className="space-y-6">
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
                  <TableHead>Notice</TableHead>
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
                        <p className="font-medium">{notice.title}</p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">{notice.content}</p>
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
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Notice</DialogTitle>
            <DialogDescription>Create a new public notice or announcement.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Title, Content, Category, Priority, Scheduled Date Inputs */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-title" className="text-right">Title</Label>
              <Input
                id="add-title"
                className="col-span-3"
                placeholder="Notice title"
                value={newNotice.title}
                onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-content" className="text-right">Content</Label>
              <Textarea
                id="add-content"
                className="col-span-3"
                placeholder="Notice content"
                value={newNotice.content}
                onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-category" className="text-right">Category</Label>
              <Select value={newNotice.category} onValueChange={(value) => setNewNotice({ ...newNotice, category: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-priority" className="text-right">Priority</Label>
              <Select value={newNotice.priority} onValueChange={(value) => setNewNotice({ ...newNotice, priority: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-scheduled" className="text-right">Scheduled Date</Label>
              <Input
                id="add-scheduled"
                type="date"
                className="col-span-3"
                value={newNotice.scheduledDate}
                onChange={(e) => setNewNotice({ ...newNotice, scheduledDate: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddNotice}>Add Notice</Button>
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
