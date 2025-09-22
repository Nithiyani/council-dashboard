"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Building2, Plus, Edit, Trash2, Search, Upload, FileText, Users, Phone, Mail } from 'lucide-react';

// ---------------- TypeScript Types ----------------
interface Department {
  id: number;
  name: string;
  head: string;
  contact: string;
  email: string;
  description: string;
  services: string[];
  staff: number;
  documents: number;
}

// ---------------- Initial Data ----------------
const departmentsData: Department[] = [
  {
    id: 1,
    name: "Health Department",
    head: "Dr. Sarah Wilson",
    contact: "+1 (555) 123-4567",
    email: "health@council.gov",
    description: "Responsible for public health services, disease prevention, and health education programs.",
    services: ["Health Inspections", "Vaccination Programs", "Health Education", "Emergency Response"],
    staff: 12,
    documents: 8
  },
  {
    id: 2,
    name: "Education Department",
    head: "Prof. Michael Chen",
    contact: "+1 (555) 234-5678",
    email: "education@council.gov",
    description: "Manages educational programs, school facilities, and community learning initiatives.",
    services: ["School Management", "Adult Education", "Library Services", "Educational Grants"],
    staff: 25,
    documents: 15
  },
  {
    id: 3,
    name: "Infrastructure Department",
    head: "Eng. David Rodriguez",
    contact: "+1 (555) 345-6789",
    email: "infrastructure@council.gov",
    description: "Handles road maintenance, public works, utilities, and infrastructure development.",
    services: ["Road Maintenance", "Water Supply", "Waste Management", "Public Works"],
    staff: 18,
    documents: 22
  },
  {
    id: 4,
    name: "Social Services",
    head: "Ms. Emma Thompson",
    contact: "+1 (555) 456-7890",
    email: "social@council.gov",
    description: "Provides social welfare programs, community support, and assistance to vulnerable populations.",
    services: ["Welfare Programs", "Community Support", "Senior Services", "Youth Programs"],
    staff: 8,
    documents: 12
  }
];

// ---------------- Main Component ----------------
export default function DepartmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [departments, setDepartments] = useState<Department[]>(departmentsData);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [newDepartment, setNewDepartment] = useState<Omit<Department, "id" | "staff" | "documents">>({
    name: '',
    head: '',
    contact: '',
    email: '',
    description: '',
    services: []
  });

  // ---------------- Filter ----------------
  const filteredDepartments = departments.filter(dept => 
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.head.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ---------------- Handlers ----------------
  const handleAddDepartment = () => {
    const department: Department = {
      id: departments.length + 1,
      ...newDepartment,
      staff: 0,
      documents: 0
    };
    setDepartments([...departments, department]);
    setNewDepartment({ name: '', head: '', contact: '', email: '', description: '', services: [] });
    setIsAddDialogOpen(false);
  };

  const handleEditDepartment = (dept: Department) => {
    setSelectedDepartment(dept);
    setIsEditDialogOpen(true);
  };

  const handleDeleteDepartment = (id: number) => {
    setDepartments(departments.filter(dept => dept.id !== id));
  };

  const handleUploadDocument = (dept: Department) => {
    setSelectedDepartment(dept);
    setIsDocumentDialogOpen(true);
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Departments & Services</h1>
          <p className="text-gray-600">Manage municipal departments and their services</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Department
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Departments</p>
                <p className="text-2xl font-bold">{departments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold">{departments.reduce((sum, d) => sum + d.staff, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Documents</p>
                <p className="text-2xl font-bold">{departments.reduce((sum, d) => sum + d.documents, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Building2 className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Services</p>
                <p className="text-2xl font-bold">{departments.reduce((sum, d) => sum + d.services.length, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDepartments.map((department) => (
          <Card key={department.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  {department.name}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEditDepartment(department)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleUploadDocument(department)}>
                    <Upload className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDeleteDepartment(department.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>{department.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">Head:</span>
                  <span>{department.head}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="w-4 h-4 text-green-600" />
                  <span>{department.contact}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="w-4 h-4 text-red-600" />
                  <span>{department.email}</span>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2">Services:</h4>
                <div className="flex flex-wrap gap-1">
                  {department.services.map((service, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>Staff: {department.staff}</span>
                <span>Documents: {department.documents}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Department Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Department</DialogTitle>
            <DialogDescription>Create a new department with services and contact information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-name" className="text-right">Name</Label>
              <Input 
                id="add-name" 
                className="col-span-3" 
                placeholder="Department name"
                value={newDepartment.name}
                onChange={(e) => setNewDepartment({...newDepartment, name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-head" className="text-right">Department Head</Label>
              <Input 
                id="add-head" 
                className="col-span-3" 
                placeholder="Head of department"
                value={newDepartment.head}
                onChange={(e) => setNewDepartment({...newDepartment, head: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-contact" className="text-right">Contact</Label>
              <Input 
                id="add-contact" 
                className="col-span-3" 
                placeholder="Phone number"
                value={newDepartment.contact}
                onChange={(e) => setNewDepartment({...newDepartment, contact: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-email" className="text-right">Email</Label>
              <Input 
                id="add-email" 
                type="email" 
                className="col-span-3" 
                placeholder="Email address"
                value={newDepartment.email}
                onChange={(e) => setNewDepartment({...newDepartment, email: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-description" className="text-right">Description</Label>
              <Textarea 
                id="add-description" 
                className="col-span-3" 
                placeholder="Department description"
                value={newDepartment.description}
                onChange={(e) => setNewDepartment({...newDepartment, description: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddDepartment}>Add Department</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Document Dialog */}
      <Dialog open={isDocumentDialogOpen} onOpenChange={setIsDocumentDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>Upload a document for {selectedDepartment?.name}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="doc-title" className="text-right">Title</Label>
              <Input id="doc-title" className="col-span-3" placeholder="Document title" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="doc-file" className="text-right">File</Label>
              <Input id="doc-file" type="file" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="doc-description" className="text-right">Description</Label>
              <Textarea id="doc-description" className="col-span-3" placeholder="Document description" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDocumentDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsDocumentDialogOpen(false)}>Upload Document</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}