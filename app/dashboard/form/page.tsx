"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, MoreVertical, Download, Eye, ChevronDown } from "lucide-react";
import jsPDF from "jspdf";

interface FormSubmission {
  id: string;
  timestamp: string;
  name: string;
  address: string;
  phone: string;
  nic: string;
  gramaNiladhariDivision: string;
  divisionNumber: string;
  requestType: string;
  subCategory: string;
  details: string;
  status: "Verified" | "In Progress" | "Accepted" | "Rejected";
  comments: string[];
  lastUpdated: string;
  assignedTo?: string;
}

// Their needs options
const THEIR_NEEDS_OPTIONS = [
  "Submitting a complaint",
  "Request",
  "Recommendation",
  "Development-related request",
  "Requesting further information",
  "Other"
] as const;

// The right to options
const THE_RIGHT_TO_OPTIONS = [
  "Property title deed",
  "Property name change",
  "Land Subdivision / Land Consolidation",
  "Private land size allowed",
  "Building permit application",
  "Extension of time for building permit",
  "Occupancy Certificate / Establishment Certificate / Composition Certificate",
  "Road boundary certificate",
  "Certificate of Acceptance",
  "Permission to cut roads",
  "Other"
] as const;

export default function MunicipalDashboard() {
  const [view, setView] = useState<"table" | "cards">("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [divisionFilter, setDivisionFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Dummy data with new status flow
  const dummyData: FormSubmission[] = [
    {
      id: "MNC-001",
      timestamp: "2024-01-15 10:30:00",
      name: "Kamal Perera",
      address: "123 Main Street, Mannar",
      phone: "0771234567",
      nic: "851234567V",
      gramaNiladhariDivision: "Mannar Town",
      divisionNumber: "MN-01",
      requestType: "Request",
      subCategory: "Building permit application",
      details: "Request for building permit for new residential house construction",
      status: "In Progress",
      comments: ["Documents under review", "Site inspection scheduled"],
      lastUpdated: "2024-01-16 14:20:00",
      assignedTo: "John Doe"
    },
    {
      id: "MNC-002",
      timestamp: "2024-01-14 15:45:00",
      name: "Nimali Fernando",
      address: "456 Beach Road, Pesalai",
      phone: "0782345678",
      nic: "882345678V",
      gramaNiladhariDivision: "Pesalai",
      divisionNumber: "PS-01",
      requestType: "Submitting a complaint",
      subCategory: "Property title deed",
      details: "Request for new street light near the temple area - dark spot causing safety concerns",
      status: "Accepted",
      comments: ["Awaiting budget approval"],
      lastUpdated: "2024-01-14 15:45:00",
      assignedTo: "Jane Smith"
    },
    {
      id: "MNC-003",
      timestamp: "2024-01-13 09:15:00",
      name: "Samantha Rathnayake",
      address: "789 Temple Road, Mannar",
      phone: "0763456789",
      nic: "893456789V",
      gramaNiladhariDivision: "Mannar Town",
      divisionNumber: "MN-02",
      requestType: "Requesting further information",
      subCategory: "Property name change",
      details: "Need clarification on property tax calculation for commercial property",
      status: "Rejected",
      comments: ["Incomplete documentation provided", "Please resubmit with proper documents"],
      lastUpdated: "2024-01-15 11:30:00",
      assignedTo: "Robert Brown"
    },
    {
      id: "MNC-004",
      timestamp: "2024-01-16 11:20:00",
      name: "Rajesh Kumar",
      address: "321 Church Road, Mannar",
      phone: "0754567890",
      nic: "904567890V",
      gramaNiladhariDivision: "Mannar Town",
      divisionNumber: "MN-03",
      requestType: "Development-related request",
      subCategory: "Land Subdivision / Land Consolidation",
      details: "Application for new water connection for residential property at the above address",
      status: "Verified",
      comments: ["Application received and verified", "Technical inspection pending"],
      lastUpdated: "2024-01-16 11:20:00",
      assignedTo: "Sarah Johnson"
    },
    {
      id: "MNC-005",
      timestamp: "2024-01-12 14:15:00",
      name: "Priya Nageswaran",
      address: "654 Fishery Harbor Road, Pesalai",
      phone: "0745678901",
      nic: "915678901V",
      gramaNiladhariDivision: "Pesalai",
      divisionNumber: "PS-02",
      requestType: "Recommendation",
      subCategory: "Private land size allowed",
      details: "Regular garbage collection missed in our area for the past 3 weeks",
      status: "Accepted",
      comments: ["Collection schedule updated", "Additional truck assigned"],
      lastUpdated: "2024-01-14 09:45:00",
      assignedTo: "Mike Wilson"
    },
    {
      id: "MNC-006",
      timestamp: "2024-01-17 08:45:00",
      name: "Anura Silva",
      address: "789 Lake Road, Mannar",
      phone: "0723456789",
      nic: "905678901V",
      gramaNiladhariDivision: "Mannar Town",
      divisionNumber: "MN-04",
      requestType: "Request",
      subCategory: "Occupancy Certificate / Establishment Certificate / Composition Certificate",
      details: "Application for occupancy certificate for completed commercial building",
      status: "In Progress",
      comments: ["Final inspection required"],
      lastUpdated: "2024-01-17 08:45:00",
      assignedTo: "David Wilson"
    }
  ];

  const [submissions, setSubmissions] = useState<FormSubmission[]>(dummyData);

  // Filter and search logic
  const filteredSubmissions = useMemo(() => {
    return submissions.filter(submission => {
      const matchesSearch = 
        submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.nic.includes(searchTerm) ||
        submission.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || submission.status === statusFilter;
      const matchesDivision = divisionFilter === "all" || 
        submission.gramaNiladhariDivision === divisionFilter;

      return matchesSearch && matchesStatus && matchesDivision;
    });
  }, [submissions, searchTerm, statusFilter, divisionFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const paginatedSubmissions = filteredSubmissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Unique divisions for filter
  const divisions = useMemo(() => {
    return Array.from(new Set(submissions.map(s => s.gramaNiladhariDivision)));
  }, [submissions]);

  const getStatusBadge = (status: FormSubmission["status"]) => {
    const variants = {
      "Verified": "bg-blue-100 text-blue-800 border-blue-200",
      "In Progress": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Accepted": "bg-green-100 text-green-800 border-green-200",
      "Rejected": "bg-red-100 text-red-800 border-red-200"
    };
    return <Badge variant="outline" className={variants[status]}>{status}</Badge>;
  };

  const handleStatusUpdate = (id: string, newStatus: FormSubmission["status"]) => {
    setSubmissions(prev => 
      prev.map(sub => 
        sub.id === id 
          ? { 
              ...sub, 
              status: newStatus, 
              lastUpdated: new Date().toLocaleString(),
              comments: [...sub.comments, `Status changed to ${newStatus} on ${new Date().toLocaleString()}`]
            } 
          : sub
      )
    );
  };

  const handleAddComment = (id: string, comment: string) => {
    if (comment.trim()) {
      setSubmissions(prev =>
        prev.map(sub =>
          sub.id === id
            ? {
                ...sub,
                comments: [...sub.comments, `${new Date().toLocaleString()}: ${comment}`],
                lastUpdated: new Date().toLocaleString()
              }
            : sub
        )
      );
    }
  };

  const exportToPDF = (submission: FormSubmission) => {
    const doc = new jsPDF();
    
    // Set document properties
    doc.setProperties({
      title: `Request Details - ${submission.id}`,
      subject: 'Mannar Municipal Council Request',
      author: 'Mannar Municipal Council'
    });

    let yPosition = 20;
    const lineHeight = 7;
    const margin = 20;
    const pageWidth = doc.internal.pageSize.width;
    
    // Title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Mannar Municipal Council - Request Details", margin, yPosition);
    yPosition += lineHeight * 2;
    
    // Horizontal line
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += lineHeight * 1.5;
    
    // Basic Information
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Request Information:", margin, yPosition);
    yPosition += lineHeight;
    
    doc.setFont("helvetica", "normal");
    doc.text(`Request ID: ${submission.id}`, margin, yPosition);
    yPosition += lineHeight;
    doc.text(`Submission Date: ${submission.timestamp}`, margin, yPosition);
    yPosition += lineHeight;
    doc.text(`Status: ${submission.status}`, margin, yPosition);
    yPosition += lineHeight * 1.5;
    
    // Personal Information
    doc.setFont("helvetica", "bold");
    doc.text("Personal Information:", margin, yPosition);
    yPosition += lineHeight;
    
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${submission.name}`, margin, yPosition);
    yPosition += lineHeight;
    doc.text(`NIC: ${submission.nic}`, margin, yPosition);
    yPosition += lineHeight;
    
    // Handle address wrapping
    const addressLines = doc.splitTextToSize(`Address: ${submission.address}`, pageWidth - margin * 2);
    doc.text(addressLines, margin, yPosition);
    yPosition += lineHeight * addressLines.length;
    
    doc.text(`Phone: ${submission.phone}`, margin, yPosition);
    yPosition += lineHeight;
    doc.text(`GS Division: ${submission.gramaNiladhariDivision}`, margin, yPosition);
    yPosition += lineHeight;
    doc.text(`Division Number: ${submission.divisionNumber}`, margin, yPosition);
    yPosition += lineHeight * 1.5;
    
    // Request Details
    doc.setFont("helvetica", "bold");
    doc.text("Request Details:", margin, yPosition);
    yPosition += lineHeight;
    
    doc.setFont("helvetica", "normal");
    doc.text(`Their needs: ${submission.requestType}`, margin, yPosition);
    yPosition += lineHeight;
    doc.text(`The right to: ${submission.subCategory}`, margin, yPosition);
    yPosition += lineHeight;
    
    // Handle details wrapping
    const detailLines = doc.splitTextToSize(`Details: ${submission.details}`, pageWidth - margin * 2);
    doc.text(detailLines, margin, yPosition);
    yPosition += lineHeight * detailLines.length;
    yPosition += lineHeight;
    
    // Administrative Information
    doc.setFont("helvetica", "bold");
    doc.text("Administrative Information:", margin, yPosition);
    yPosition += lineHeight;
    
    doc.setFont("helvetica", "normal");
    doc.text(`Last Updated: ${submission.lastUpdated}`, margin, yPosition);
    yPosition += lineHeight;
    
    if (submission.assignedTo) {
      doc.text(`Assigned To: ${submission.assignedTo}`, margin, yPosition);
      yPosition += lineHeight;
    }
    
    // Comments (new page if needed)
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFont("helvetica", "bold");
    doc.text("Comments History:", margin, yPosition);
    yPosition += lineHeight;
    
    doc.setFont("helvetica", "normal");
    if (submission.comments.length === 0) {
      doc.text("No comments yet.", margin, yPosition);
    } else {
      submission.comments.forEach(comment => {
        const commentLines = doc.splitTextToSize(`• ${comment}`, pageWidth - margin * 2);
        
        // Check if we need a new page
        if (yPosition + (lineHeight * commentLines.length) > 280) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.text(commentLines, margin, yPosition);
        yPosition += lineHeight * commentLines.length;
      });
    }
    
    // Save the PDF
    doc.save(`request-${submission.id}.pdf`);
  };

  const exportAllToPDF = () => {
    const doc = new jsPDF();
    
    doc.setProperties({
      title: "All Requests - Mannar Municipal Council",
      subject: 'Mannar Municipal Council Requests Export',
      author: 'Mannar Municipal Council'
    });

    let yPosition = 20;
    const lineHeight = 7;
    const margin = 20;
    const pageWidth = doc.internal.pageSize.width;

    // Title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Mannar Municipal Council - All Requests", margin, yPosition);
    yPosition += lineHeight * 2;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, yPosition);
    yPosition += lineHeight * 2;

    // Table headers
    const headers = ["ID", "Name", "GS Division", "Div No.", "Status", "Last Updated"];
    const colWidths = [25, 35, 35, 20, 25, 30];
    let xPosition = margin;

    doc.setFont("helvetica", "bold");
    headers.forEach((header, index) => {
      doc.text(header, xPosition, yPosition);
      xPosition += colWidths[index];
    });
    
    yPosition += lineHeight;
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += lineHeight;

    // Table rows
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    
    filteredSubmissions.forEach((submission, index) => {
      // Check if we need a new page
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
        
        // Redraw headers on new page
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        xPosition = margin;
        headers.forEach((header, idx) => {
          doc.text(header, xPosition, yPosition);
          xPosition += colWidths[idx];
        });
        yPosition += lineHeight;
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += lineHeight;
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
      }

      const rowData = [
        submission.id,
        submission.name,
        submission.gramaNiladhariDivision,
        submission.divisionNumber,
        submission.status,
        new Date(submission.lastUpdated).toLocaleDateString()
      ];

      xPosition = margin;
      rowData.forEach((data, colIndex) => {
        const text = doc.splitTextToSize(data, colWidths[colIndex] - 2);
        doc.text(text, xPosition, yPosition);
        xPosition += colWidths[colIndex];
      });

      yPosition += lineHeight * 2;
    });

    doc.save(`all-requests-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Mannar Municipal Council</h1>
          <p className="text-gray-600 text-sm md:text-base">Public Requests & Complaints Dashboard</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            onClick={() => setView("table")} 
            variant={view === "table" ? "default" : "outline"}
            className="flex-1 sm:flex-none"
            size="sm"
          >
            Table View
          </Button>
          <Button 
            onClick={() => setView("cards")} 
            variant={view === "cards" ? "default" : "outline"}
            className="flex-1 sm:flex-none"
            size="sm"
          >
            Card View
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Search by Name, NIC or ID</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm">Status Filter</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Verified">Verified</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Accepted">Accepted</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">GS Division Filter</Label>
              <Select value={divisionFilter} onValueChange={setDivisionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Divisions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All GS Divisions</SelectItem>
                  {divisions.map(division => (
                    <SelectItem key={division} value={division}>
                      {division}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 flex items-end">
              <Button variant="outline" className="w-full" onClick={exportAllToPDF} size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count and Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <p className="text-sm text-gray-600">
          Showing {filteredSubmissions.length} results
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Previous
          </Button>
          <span className="flex items-center px-3 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Content */}
      {view === "table" ? (
        <TableCardView 
          submissions={paginatedSubmissions}
          onStatusUpdate={handleStatusUpdate}
          onAddComment={handleAddComment}
          onExportPDF={exportToPDF}
          getStatusBadge={getStatusBadge}
        />
      ) : (
        <GridCardView
          submissions={paginatedSubmissions}
          onStatusUpdate={handleStatusUpdate}
          onAddComment={handleAddComment}
          onExportPDF={exportToPDF}
          getStatusBadge={getStatusBadge}
        />
      )}
    </div>
  );
}

// Table View Component
function TableCardView({ 
  submissions, 
  onStatusUpdate, 
  onAddComment, 
  onExportPDF,
  getStatusBadge,
}: {
  submissions: FormSubmission[];
  onStatusUpdate: (id: string, status: FormSubmission["status"]) => void;
  onAddComment: (id: string, comment: string) => void;
  onExportPDF: (submission: FormSubmission) => void;
  getStatusBadge: (status: FormSubmission["status"]) => JSX.Element;
}) {
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [comment, setComment] = useState("");

  return (
    <>
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">ID</TableHead>
                <TableHead className="whitespace-nowrap">Name</TableHead>
                <TableHead className="whitespace-nowrap hidden sm:table-cell">GS Division</TableHead>
                <TableHead className="whitespace-nowrap hidden md:table-cell">Div No.</TableHead>
                <TableHead className="whitespace-nowrap">Status</TableHead>
                <TableHead className="whitespace-nowrap hidden lg:table-cell">Last Updated</TableHead>
                <TableHead className="whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No submissions found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                submissions.map((submission) => (
                  <TableRow key={submission.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium whitespace-nowrap">{submission.id}</TableCell>
                    <TableCell className="font-medium whitespace-nowrap">{submission.name}</TableCell>
                    <TableCell className="whitespace-nowrap hidden sm:table-cell">{submission.gramaNiladhariDivision}</TableCell>
                    <TableCell className="whitespace-nowrap hidden md:table-cell">{submission.divisionNumber}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            {getStatusBadge(submission.status)}
                            <ChevronDown className="h-3 w-3 ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem 
                            onClick={() => onStatusUpdate(submission.id, "Verified")}
                            className="flex items-center gap-2"
                          >
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            Verified
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => onStatusUpdate(submission.id, "In Progress")}
                            className="flex items-center gap-2"
                          >
                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            In Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => onStatusUpdate(submission.id, "Accepted")}
                            className="flex items-center gap-2"
                          >
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            Accepted
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => onStatusUpdate(submission.id, "Rejected")}
                            className="flex items-center gap-2"
                          >
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            Rejected
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell className="whitespace-nowrap hidden lg:table-cell">{new Date(submission.lastUpdated).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedSubmission(submission)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onExportPDF(submission)}>
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Detail Modal */}
      {selectedSubmission && (
        <SubmissionDetailModal
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          onStatusUpdate={onStatusUpdate}
          onAddComment={onAddComment}
          comment={comment}
          setComment={setComment}
          getStatusBadge={getStatusBadge}
        />
      )}
    </>
  );
}

// Grid Card View Component
function GridCardView({
  submissions,
  onStatusUpdate,
  onAddComment,
  onExportPDF,
  getStatusBadge,
}: {
  submissions: FormSubmission[];
  onStatusUpdate: (id: string, status: FormSubmission["status"]) => void;
  onAddComment: (id: string, comment: string) => void;
  onExportPDF: (submission: FormSubmission) => void;
  getStatusBadge: (status: FormSubmission["status"]) => JSX.Element;
}) {
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [comment, setComment] = useState("");

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {submissions.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No submissions found matching your filters.
          </div>
        ) : (
          submissions.map((submission) => (
            <Card key={submission.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base md:text-lg">{submission.name}</CardTitle>
                    <CardDescription className="text-xs md:text-sm">{submission.id}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 px-2">
                        {getStatusBadge(submission.status)}
                        <ChevronDown className="h-3 w-3 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => onStatusUpdate(submission.id, "Verified")}
                        className="flex items-center gap-2"
                      >
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        Verified
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onStatusUpdate(submission.id, "In Progress")}
                        className="flex items-center gap-2"
                      >
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        In Progress
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onStatusUpdate(submission.id, "Accepted")}
                        className="flex items-center gap-2"
                      >
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        Accepted
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onStatusUpdate(submission.id, "Rejected")}
                        className="flex items-center gap-2"
                      >
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        Rejected
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <Label className="text-xs font-semibold">GS Division</Label>
                    <p className="text-xs md:text-sm truncate">{submission.gramaNiladhariDivision}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">Division No.</Label>
                    <p className="text-xs md:text-sm">{submission.divisionNumber}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs font-semibold">NIC</Label>
                    <p className="text-xs md:text-sm">{submission.nic}</p>
                  </div>
                </div>
                
                <div>
                  <Label className="text-xs font-semibold">Details</Label>
                  <p className="text-xs md:text-sm line-clamp-2 text-gray-600">{submission.details}</p>
                </div>

                <div className="flex justify-between pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedSubmission(submission)}
                    className="text-xs"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onExportPDF(submission)}
                    className="text-xs"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {selectedSubmission && (
        <SubmissionDetailModal
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          onStatusUpdate={onStatusUpdate}
          onAddComment={onAddComment}
          comment={comment}
          setComment={setComment}
          getStatusBadge={getStatusBadge}
        />
      )}
    </>
  );
}

// Detail Modal Component
function SubmissionDetailModal({
  submission,
  onClose,
  onStatusUpdate,
  onAddComment,
  comment,
  setComment,
  getStatusBadge,
}: {
  submission: FormSubmission;
  onClose: () => void;
  onStatusUpdate: (id: string, status: FormSubmission["status"]) => void;
  onAddComment: (id: string, comment: string) => void;
  comment: string;
  setComment: (comment: string) => void;
  getStatusBadge: (status: FormSubmission["status"]) => JSX.Element;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg md:text-xl">{submission.name} - {submission.id}</CardTitle>
              <CardDescription className="text-sm">
                Submitted: {new Date(submission.timestamp).toLocaleString()}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="font-semibold text-sm">Address</Label>
              <p className="mt-1 text-sm">{submission.address}</p>
            </div>
            <div>
              <Label className="font-semibold text-sm">Phone Number</Label>
              <p className="mt-1 text-sm">{submission.phone}</p>
            </div>
            <div>
              <Label className="font-semibold text-sm">NIC Number</Label>
              <p className="mt-1 text-sm">{submission.nic}</p>
            </div>
            <div>
              <Label className="font-semibold text-sm">GS Division</Label>
              <p className="mt-1 text-sm">{submission.gramaNiladhariDivision}</p>
            </div>
            <div>
              <Label className="font-semibold text-sm">Division Number</Label>
              <p className="mt-1 text-sm">{submission.divisionNumber}</p>
            </div>
          </div>

          {/* Request Details */}
          <div>
            <Label className="font-semibold text-sm">Their needs</Label>
            <p className="mt-1 p-3 bg-gray-50 rounded-md border text-sm">{submission.requestType}</p>
          </div>

          <div>
            <Label className="font-semibold text-sm">The right to</Label>
            <p className="mt-1 p-3 bg-gray-50 rounded-md border text-sm">{submission.subCategory}</p>
          </div>

          <div>
            <Label className="font-semibold text-sm">Detailed Description</Label>
            <p className="mt-1 p-3 bg-gray-50 rounded-md text-sm">{submission.details}</p>
          </div>

          {/* Status Section */}
          <div className="border-t pt-4">
            <div className="flex items-center gap-4 mb-4">
              <Label className="font-semibold text-sm md:text-base">Current Status:</Label>
              {getStatusBadge(submission.status)}
            </div>
          </div>

          {/* Comments Section */}
          <div className="border-t pt-4">
            <Label className="font-semibold text-sm md:text-base">Comments & History</Label>
            <div className="space-y-3 mt-3 max-h-48 overflow-y-auto p-2 border rounded-md">
              {submission.comments.length === 0 ? (
                <p className="text-gray-500 text-sm">No comments yet.</p>
              ) : (
                submission.comments.map((cmt, index) => (
                  <div key={index} className="text-sm p-3 bg-gray-50 rounded-md border">
                    {cmt}
                  </div>
                ))
              )}
            </div>
            
            <div className="flex gap-2 mt-3">
              <Textarea
                placeholder="Add a comment or remark..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="flex-1 text-sm"
                rows={3}
              />
            </div>
            <Button 
              onClick={() => {
                onAddComment(submission.id, comment);
                setComment("");
              }}
              className="mt-2"
              disabled={!comment.trim()}
              size="sm"
            >
              Add Comment
            </Button>
          </div>

          {/* Administrative Information */}
          <div className="border-t pt-4">
            <Label className="font-semibold text-sm md:text-base">Administrative Information</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <Label className="text-sm">Last Updated</Label>
                <p className="text-sm">{new Date(submission.lastUpdated).toLocaleString()}</p>
              </div>
              {submission.assignedTo && (
                <div>
                  <Label className="text-sm">Assigned To</Label>
                  <p className="text-sm">{submission.assignedTo}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}