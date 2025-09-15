"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Plus, Edit, Trash2, Search, Download, Upload, Calendar, Tag } from 'lucide-react';

const documentsData = [
  {
    id: 1,
    title: "Municipal Budget Report 2025",
    description: "Comprehensive budget analysis and allocation for fiscal year 2025",
    category: "Financial",
    fileType: "PDF",
    fileSize: "2.4 MB",
    uploadDate: "2024-12-20",
    downloadCount: 156,
    status: "Published"
  },
  {
    id: 2,
    title: "Building Permit Application Form",
    description: "Standard form for building permit applications",
    category: "Forms",
    fileType: "PDF",
    fileSize: "0.8 MB",
    uploadDate: "2024-12-18",
    downloadCount: 89,
    status: "Published"
  },
  {
    id: 3,
    title: "Community Development Plan",
    description: "5-year strategic plan for community development initiatives",
    category: "Planning",
    fileType: "PDF",
    fileSize: "5.2 MB",
    uploadDate: "2024-12-15",
    downloadCount: 234,
    status: "Published"
  },
  {
    id: 4,
    title: "Water Service Application",
    description: "Application form for new water service connections",
    category: "Forms",
    fileType: "PDF",
    fileSize: "0.6 MB",
    uploadDate: "2024-12-12",
    downloadCount: 67,
    status: "Published"
  },
  {
    id: 5,
    title: "Annual Activity Report 2024",
    description: "Summary of municipal activities and achievements for 2024",
    category: "Reports",
    fileType: "PDF",
    fileSize: "3.1 MB",
    uploadDate: "2024-12-10",
    downloadCount: 45,
    status: "Draft"
  }
];

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all'); // changed to "all"
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documents, setDocuments] = useState(documentsData);
  const [newDocument, setNewDocument] = useState({
    title: '',
    description: '',
    category: '',
    fileType: 'PDF'
  });

  const categories = ['Financial', 'Forms', 'Planning', 'Reports', 'Legal', 'Policies'];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory; // updated logic
    return matchesSearch && matchesCategory;
  });

  const handleUploadDocument = () => {
    const document = {
      id: documents.length + 1,
      ...newDocument,
      fileSize: "1.2 MB",
      uploadDate: new Date().toISOString().split('T')[0],
      downloadCount: 0,
      status: "Draft"
    };
    setDocuments([...documents, document]);
    setNewDocument({ title: '', description: '', category: '', fileType: 'PDF' });
    setIsUploadDialogOpen(false);
  };

  const handleEditDocument = (doc) => {
    setSelectedDocument(doc);
    setIsEditDialogOpen(true);
  };

  const handleDeleteDocument = (id) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const handleSetCategory = (doc) => {
    setSelectedDocument(doc);
    setIsCategoryDialogOpen(true);
  };

  const handleUpdateCategory = (newCategory) => {
    setDocuments(documents.map(doc => 
      doc.id === selectedDocument.id 
        ? { ...doc, category: newCategory }
        : doc
    ));
    setIsCategoryDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Downloads & Documents</h1>
          <p className="text-gray-600">Manage forms, reports, and downloadable documents</p>
        </div>
        <Button onClick={() => setIsUploadDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Documents</p>
                <p className="text-2xl font-bold">{documents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Download className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Downloads</p>
                <p className="text-2xl font-bold">{documents.reduce((sum, d) => sum + d.downloadCount, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Tag className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold">{categories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold">{documents.filter(d => d.status === 'Published').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents Management */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Documents Library</CardTitle>
          <CardDescription>Manage all downloadable documents and forms</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search documents..."
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
                <SelectItem value="all">All Categories</SelectItem> {/* Fixed */}
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>File Info</TableHead>
                  <TableHead>Downloads</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((document) => (
                  <TableRow key={document.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <p className="font-medium">{document.title}</p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">{document.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{document.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{document.fileType}</p>
                        <p className="text-gray-500">{document.fileSize}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1 text-sm">
                        <Download className="w-3 h-3" />
                        <span>{document.downloadCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={document.status === 'Published' ? 'default' : 'secondary'}>
                        {document.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1 text-sm">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(document.uploadDate).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditDocument(document)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleSetCategory(document)}>
                          <Tag className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDeleteDocument(document.id)}
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

      {/* Upload Document Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>Upload a new document to the library.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="upload-title" className="text-right">Title</Label>
              <Input 
                id="upload-title" 
                className="col-span-3" 
                placeholder="Document title"
                value={newDocument.title}
                onChange={(e) => setNewDocument({...newDocument, title: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="upload-description" className="text-right">Description</Label>
              <Textarea 
                id="upload-description" 
                className="col-span-3" 
                placeholder="Document description"
                value={newDocument.description}
                onChange={(e) => setNewDocument({...newDocument, description: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="upload-category" className="text-right">Category</Label>
              <Select value={newDocument.category} onValueChange={(value) => setNewDocument({...newDocument, category: value})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="upload-file" className="text-right">File</Label>
              <Input id="upload-file" type="file" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUploadDocument}>Upload Document</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Set Category Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Set Category</DialogTitle>
            <DialogDescription>Change the category for "{selectedDocument?.title}"</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category-select" className="text-right">Category</Label>
              <Select defaultValue={selectedDocument?.category} onValueChange={handleUpdateCategory}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
