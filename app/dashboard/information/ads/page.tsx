"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Pin,
  Calendar,
  User,
  Phone,
  Download,
  Image as ImageIcon,
  X,
} from "lucide-react";

// ---------------- Types ----------------
interface Advertisement {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  status: "active" | "expired" | "draft";
  views: number;
  attachments: number;
  startDate: string;
  endDate: string;
  contactPerson: string;
  contactPhone: string;
  isPinned: boolean;
  isViewed?: boolean;
  images: string[]; // Array of image URLs or base64 strings
}

// ---------------- Advertisement Card ----------------
interface AdvertisementCardProps {
  advertisement: Advertisement;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
  getStatusColor: (status: string) => string;
  formatDate: (dateString: string) => string;
}

const AdvertisementCard = ({
  advertisement,
  onView,
  onEdit,
  onDelete,
  onTogglePin,
  getStatusColor,
  formatDate,
}: AdvertisementCardProps) => (
  <Card className="hover:shadow-lg transition-shadow duration-300 relative overflow-hidden bg-white">
    <div className="absolute top-2 right-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={onTogglePin}
        aria-label="Pin/Unpin"
      >
        <Pin
          className={`h-5 w-5 ${
            advertisement.isPinned ? "text-blue-500 fill-blue-500" : "text-gray-400"
          }`}
        />
      </Button>
    </div>
    <CardContent className="flex flex-col md:flex-row p-6 items-start md:items-center">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <CardTitle
            className="text-lg font-semibold truncate hover:text-blue-600 cursor-pointer"
            onClick={onView}
          >
            {advertisement.title}
          </CardTitle>
          {!advertisement.isViewed && (
            <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
              New
            </Badge>
          )}
        </div>
        <CardDescription className="text-sm text-gray-600 mb-3 line-clamp-2">
          {advertisement.description}
        </CardDescription>
        
        {/* Image preview */}
        {advertisement.images && advertisement.images.length > 0 && (
          <div className="flex gap-2 mb-3">
            {advertisement.images.slice(0, 3).map((image, index) => (
              <div key={index} className="relative w-16 h-16 rounded-md overflow-hidden border">
                <img 
                  src={image} 
                  alt={`Advertisement ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {index === 2 && advertisement.images.length > 3 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">+{advertisement.images.length - 3}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Published: {formatDate(advertisement.date)}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>{advertisement.contactPerson || "No Contact"}</span>
          </div>
          {advertisement.images && advertisement.images.length > 0 && (
            <div className="flex items-center gap-1">
              <ImageIcon className="w-3 h-3" />
              <span>{advertisement.images.length} image(s)</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 mt-4">
          <Badge className={getStatusColor(advertisement.status)}>
            {advertisement.status.toUpperCase()}
          </Badge>
          <Badge variant="secondary">{advertisement.category}</Badge>
        </div>
      </div>
      <div className="flex-shrink-0 flex items-center gap-3 mt-4 md:mt-0 md:ml-6">
        <Button variant="outline" size="icon" onClick={onView}>
          <Eye className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onEdit}>
          <Edit className="w-4 h-4" />
        </Button>
        <Button variant="destructive" size="icon" onClick={onDelete}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </CardContent>
  </Card>
);

// ---------------- Image Upload Component ----------------
interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

const ImageUpload = ({ images, onImagesChange }: ImageUploadProps) => {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: string[] = [];
    
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newImages.push(e.target.result as string);
            if (newImages.length === files.length) {
              onImagesChange([...images, ...newImages]);
            }
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="images">Upload Images</Label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <Input
          id="images"
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <Label
          htmlFor="images"
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          <ImageIcon className="w-8 h-8 text-gray-400" />
          <span className="text-sm text-gray-600">
            Click to upload images or drag and drop
          </span>
          <span className="text-xs text-gray-500">
            PNG, JPG, GIF up to 10MB each
          </span>
        </Label>
      </div>
      
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Upload ${index + 1}`}
                className="w-full h-24 object-cover rounded-md border"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ---------------- Main Page ----------------
export default function PublicAdvertisementsPage() {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([
    {
      id: "1",
      title: "Water Supply Maintenance - Area 3 & 4",
      description:
        "Scheduled water supply maintenance will affect Area 3 and Area 4 from Jan 17, 6:00 AM to 4:00 PM.",
      date: "2024-01-16",
      category: "Utility",
      status: "active",
      views: 1245,
      attachments: 3,
      startDate: "2024-01-17",
      endDate: "2024-01-17",
      contactPerson: "Mr. John Smith",
      contactPhone: "+94 77 123 4567",
      isPinned: true,
      isViewed: true,
      images: [
        "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=150&h=150&fit=crop",
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=150&h=150&fit=crop"
      ],
    },
    {
      id: "2",
      title: "Road Closure - Main Street Repair",
      description:
        "Main Street closed for repairs from Jan 18-20. Use alternate routes via Church Rd & Market St.",
      date: "2024-01-15",
      category: "Infrastructure",
      status: "active",
      views: 892,
      attachments: 2,
      startDate: "2024-01-18",
      endDate: "2024-01-20",
      contactPerson: "Ms. Sarah Johnson",
      contactPhone: "+94 76 234 5678",
      isPinned: true,
      isViewed: false,
      images: [
        "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=150&h=150&fit=crop"
      ],
    },
    {
      id: "3",
      title: "Community Health Camp",
      description:
        "Free health checkup camp organized for all residents. Blood pressure, sugar tests, and general consultation available.",
      date: "2024-01-14",
      category: "Health",
      status: "active",
      views: 567,
      attachments: 1,
      startDate: "2024-01-25",
      endDate: "2024-01-25",
      contactPerson: "Dr. Robert Brown",
      contactPhone: "+94 75 345 6789",
      isPinned: false,
      isViewed: true,
      images: [],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAdvertisement, setSelectedAdvertisement] = useState<Advertisement | null>(
    null
  );

  const [newAdvertisement, setNewAdvertisement] = useState<Omit<Advertisement, "id" | "date" | "views" | "attachments">>({
    title: "",
    description: "",
    category: "",
    status: "active",
    startDate: "",
    endDate: "",
    contactPerson: "",
    contactPhone: "",
    isPinned: false,
    images: [],
  });

  // ---------------- Helpers ----------------
  const handleCreateAdvertisement = () => {
    if (!newAdvertisement.title || !newAdvertisement.description || !newAdvertisement.category) {
      alert("Please fill all required fields!");
      return;
    }
    const newAd: Advertisement = {
      id: (advertisements.length + 1).toString(),
      ...newAdvertisement,
      date: new Date().toISOString().split("T")[0],
      views: 0,
      attachments: newAdvertisement.images.length,
      isViewed: false,
    };
    setAdvertisements([newAd, ...advertisements]);
    setIsCreateDialogOpen(false);
    setNewAdvertisement({
      title: "",
      description: "",
      category: "",
      status: "active",
      startDate: "",
      endDate: "",
      contactPerson: "",
      contactPhone: "",
      isPinned: false,
      images: [],
    });
  };

  const handleEditAdvertisement = () => {
    if (!selectedAdvertisement) return;
    const updatedAd = {
      ...selectedAdvertisement,
      attachments: selectedAdvertisement.images.length
    };
    setAdvertisements((prev) =>
      prev.map((ad) => (ad.id === selectedAdvertisement.id ? updatedAd : ad))
    );
    setIsEditDialogOpen(false);
  };

  const handleDeleteAdvertisement = () => {
    if (!selectedAdvertisement) return;
    setAdvertisements((prev) => prev.filter((ad) => ad.id !== selectedAdvertisement.id));
    setIsDeleteDialogOpen(false);
  };

  const handleTogglePin = (id: string) => {
    setAdvertisements((prev) =>
      prev.map((ad) => (ad.id === id ? { ...ad, isPinned: !ad.isPinned } : ad))
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200";
      case "expired":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "draft":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Sort pinned & new first
  const sortedAds = [...advertisements].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    if (!a.isViewed && b.isViewed) return -1;
    if (a.isViewed && !b.isViewed) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const filteredAds = sortedAds.filter((ad) => {
    const matchesSearch =
      ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || ad.status === filterStatus;
    const matchesCategory = filterCategory === "all" || ad.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Get unique categories for filter dropdown
  const categories = Array.from(new Set(advertisements.map((a) => a.category)));

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header & Create */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Public Advertisements</h1>
          <p className="text-gray-600 mt-1">Manage and view all public announcements</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" /> Create Advertisement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Advertisement</DialogTitle>
              <DialogDescription>Fill all required fields</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 sm:grid-cols-1 md:grid-cols-2">
              <div className="md:col-span-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={newAdvertisement.title}
                  onChange={(e) => setNewAdvertisement({ ...newAdvertisement, title: e.target.value })}
                  placeholder="Enter advertisement title"
                />
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={newAdvertisement.category}
                  onChange={(e) =>
                    setNewAdvertisement({ ...newAdvertisement, category: e.target.value })
                  }
                  placeholder="e.g., Utility, Health"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={newAdvertisement.description}
                  onChange={(e) =>
                    setNewAdvertisement({ ...newAdvertisement, description: e.target.value })
                  }
                  placeholder="Enter detailed description"
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input
                  id="contactPerson"
                  value={newAdvertisement.contactPerson}
                  onChange={(e) =>
                    setNewAdvertisement({ ...newAdvertisement, contactPerson: e.target.value })
                  }
                  placeholder="Enter contact person name"
                />
              </div>
              <div>
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  value={newAdvertisement.contactPhone}
                  onChange={(e) =>
                    setNewAdvertisement({ ...newAdvertisement, contactPhone: e.target.value })
                  }
                  placeholder="+94 77 123 4567"
                />
              </div>
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newAdvertisement.startDate}
                  onChange={(e) =>
                    setNewAdvertisement({ ...newAdvertisement, startDate: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={newAdvertisement.endDate}
                  onChange={(e) =>
                    setNewAdvertisement({ ...newAdvertisement, endDate: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newAdvertisement.status}
                  onValueChange={(val) =>
                    setNewAdvertisement({ ...newAdvertisement, status: val as any })
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Image Upload Section */}
              <div className="md:col-span-2">
                <ImageUpload
                  images={newAdvertisement.images}
                  onImagesChange={(images) => setNewAdvertisement({ ...newAdvertisement, images })}
                />
              </div>
              
              <div className="flex items-center gap-2 md:col-span-2 pt-2">
                <Switch
                  id="pin-advertisement"
                  checked={newAdvertisement.isPinned}
                  onCheckedChange={(val) => setNewAdvertisement({ ...newAdvertisement, isPinned: val })}
                />
                <Label htmlFor="pin-advertisement" className="cursor-pointer">
                  Pin Advertisement
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateAdvertisement}>Create Advertisement</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search advertisements by title, description, or contact person..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Filter by Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setFilterStatus("all");
                setFilterCategory("all");
              }}
              className="w-full md:w-auto"
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Showing {filteredAds.length} of {advertisements.length} advertisements
        </p>
      </div>

      {/* Advertisement Cards */}
      <div className="grid gap-4">
        {filteredAds.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No advertisements found matching your criteria.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("all");
                  setFilterCategory("all");
                }}
              >
                Clear filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredAds.map((ad) => (
            <AdvertisementCard
              key={ad.id}
              advertisement={ad}
              onView={() => {
                setSelectedAdvertisement(ad);
                setIsViewDialogOpen(true);
                setAdvertisements((prev) =>
                  prev.map((a) => (a.id === ad.id ? { ...a, isViewed: true, views: a.views + 1 } : a))
                );
              }}
              onEdit={() => {
                setSelectedAdvertisement(ad);
                setIsEditDialogOpen(true);
              }}
              onDelete={() => {
                setSelectedAdvertisement(ad);
                setIsDeleteDialogOpen(true);
              }}
              onTogglePin={() => handleTogglePin(ad.id)}
              getStatusColor={getStatusColor}
              formatDate={formatDate}
            />
          ))
        )}
      </div>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedAdvertisement?.title}
              {selectedAdvertisement?.isPinned && (
                <Pin className="w-4 h-4 text-blue-500 fill-blue-500" />
              )}
            </DialogTitle>
            <DialogDescription>
              Published on {selectedAdvertisement && formatDate(selectedAdvertisement.date)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Image Gallery */}
            {selectedAdvertisement?.images && selectedAdvertisement.images.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Images</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedAdvertisement.images.map((image, index) => (
                    <div key={index} className="rounded-md overflow-hidden border">
                      <img
                        src={image}
                        alt={`Advertisement image ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-gray-700">{selectedAdvertisement?.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span>{selectedAdvertisement?.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge className={getStatusColor(selectedAdvertisement?.status || "active")}>
                      {selectedAdvertisement?.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Date Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Date:</span>
                    <span>{selectedAdvertisement && formatDate(selectedAdvertisement.startDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">End Date:</span>
                    <span>{selectedAdvertisement && formatDate(selectedAdvertisement.endDate)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Contact Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span>{selectedAdvertisement?.contactPerson || "Not specified"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{selectedAdvertisement?.contactPhone || "Not specified"}</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-gray-500">
                {selectedAdvertisement?.views} views • {selectedAdvertisement?.attachments} attachments
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download Details
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Advertisement</DialogTitle>
            <DialogDescription>Update the advertisement details</DialogDescription>
          </DialogHeader>
          {selectedAdvertisement && (
            <div className="grid gap-4 py-4 sm:grid-cols-1 md:grid-cols-2">
              <div className="md:col-span-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={selectedAdvertisement.title}
                  onChange={(e) => setSelectedAdvertisement({ ...selectedAdvertisement, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Input
                  id="edit-category"
                  value={selectedAdvertisement.category}
                  onChange={(e) => setSelectedAdvertisement({ ...selectedAdvertisement, category: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={selectedAdvertisement.description}
                  onChange={(e) => setSelectedAdvertisement({ ...selectedAdvertisement, description: e.target.value })}
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="edit-contactPerson">Contact Person</Label>
                <Input
                  id="edit-contactPerson"
                  value={selectedAdvertisement.contactPerson}
                  onChange={(e) => setSelectedAdvertisement({ ...selectedAdvertisement, contactPerson: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-contactPhone">Contact Phone</Label>
                <Input
                  id="edit-contactPhone"
                  value={selectedAdvertisement.contactPhone}
                  onChange={(e) => setSelectedAdvertisement({ ...selectedAdvertisement, contactPhone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-startDate">Start Date</Label>
                <Input
                  id="edit-startDate"
                  type="date"
                  value={selectedAdvertisement.startDate}
                  onChange={(e) => setSelectedAdvertisement({ ...selectedAdvertisement, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-endDate">End Date</Label>
                <Input
                  id="edit-endDate"
                  type="date"
                  value={selectedAdvertisement.endDate}
                  onChange={(e) => setSelectedAdvertisement({ ...selectedAdvertisement, endDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={selectedAdvertisement.status}
                  onValueChange={(val) => setSelectedAdvertisement({ ...selectedAdvertisement, status: val as any })}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Image Upload Section for Edit */}
              <div className="md:col-span-2">
                <ImageUpload
                  images={selectedAdvertisement.images}
                  onImagesChange={(images) => setSelectedAdvertisement({ ...selectedAdvertisement, images })}
                />
              </div>
              
              <div className="flex items-center gap-2 md:col-span-2 pt-2">
                <Switch
                  id="edit-pin-advertisement"
                  checked={selectedAdvertisement.isPinned}
                  onCheckedChange={(val) => setSelectedAdvertisement({ ...selectedAdvertisement, isPinned: val })}
                />
                <Label htmlFor="edit-pin-advertisement" className="cursor-pointer">
                  Pin Advertisement
                </Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditAdvertisement}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedAdvertisement?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAdvertisement}>
              Delete Advertisement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}