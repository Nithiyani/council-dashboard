"use client";

import { useState, ChangeEvent } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Plus, 
  Trash2, 
  Edit, 
  Search,
  Calendar,
  User,
  Eye,
  Download,
  Star,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface TourismItem {
  id: number;
  title: {
    en: string;
    ta: string;
    si: string;
  };
  description: {
    en: string;
    ta: string;
    si: string;
  };
  category: "Attraction" | "Event" | "Accommodation" | "Restaurant" | "Adventure";
  status: "active" | "inactive" | "draft";
  imageUrl: string;
  date: string;
  views: number;
  priceRange: "$" | "$$" | "$$$" | "$$$$";
  rating: number;
  features: string[];
}

type Language = "en" | "ta" | "si";

const LANGUAGES: { value: Language; label: string }[] = [
  { value: "en", label: "English" },
  { value: "ta", label: "Tamil" },
  { value: "si", label: "Sinhala" }
];

const initialTourismItems: TourismItem[] = [
  {
    id: 1,
    title: {
      en: "Mannar Fort Historical Site",
      ta: "மன்னார் கோட்டை வரலாற்றுத் தளம்",
      si: "මන්නාරම් කොටුව ඓතිහාසික ස්ථානය"
    },
    description: {
      en: "A beautiful historical fort with Portuguese architecture offering stunning views of the ocean. Perfect for history enthusiasts and photography.",
      ta: "போர்த்துகீசிய கட்டிடக்கலை கொண்ட அழகான வரலாற்று கோட்டை, கடலின் அற்புதமான காட்சிகளை வழங்குகிறது. வரலாற்று ஆர்வலர்கள் மற்றும் புகைப்படம் எடுப்பவர்களுக்கு சிறந்தது.",
      si: "පෘතුගීසි ගෘහ නිර්මාණ ශිල්පයෙන් යුත් අලංකාර ඓතිහාසික කොටුවක්, සාගරයේ අතිශයින්ම අලංකාර දර්ශන ලබා දෙයි. ඉතිහාසයට ඇති උනන්දුවක් දක්වන අයට හා ඡායාරූප ශිල්පයට යොදාගන්නන්ට ඉතාමත් සුදුසු."
    },
    category: "Attraction",
    status: "active",
    imageUrl: "https://images.pexels.com/photos/163236/travel-man-person-look-163236.jpeg?w=400",
    date: "2024-01-16",
    views: 1245,
    priceRange: "$$",
    rating: 4.5,
    features: ["Guided Tours", "Photography", "Historical", "Family Friendly"]
  },
  {
    id: 2,
    title: {
      en: "Adam's Bridge View Point",
      ta: "ஆதாம் பாலம் காட்சி மையம்",
      si: "ආදම්ගේ පාලම දර්ශන ලක්ෂ්යය"
    },
    description: {
      en: "Experience the magnificent view of Adam's Bridge, a natural chain of limestone shoals between India and Sri Lanka.",
      ta: "இந்தியா மற்றும் இலங்கைக்கு இடையே உள்ள சுண்ணாம்புக் கரைக் கூட்டங்களின் இயற்கை சங்கிலியான ஆதாம் பாலத்தின் அற்புதமான காட்சியை அனுபவிக்கவும்.",
      si: "ඉන්දියාවට හා ශ්‍රී ලංකාවට අතර පවතින සුදු මැටි පර්වත වලින් සෑදුණු ආදම්ගේ පාලමේ අතිශයින්ම අලංකාර දර්ශනය අනුභව කරන්න."
    },
    category: "Attraction",
    status: "active",
    imageUrl: "https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?w=400",
    date: "2024-01-15",
    views: 892,
    priceRange: "$",
    rating: 4.2,
    features: ["Sunset View", "Photography", "Natural Wonder", "Free Entry"]
  }
];

// Alert Message Component
const AlertMessage: React.FC<{
  type: 'error' | 'success';
  title: string;
  message: string;
}> = ({ type, title, message }) => {
  const styles = {
    error: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-green-50 border-green-200 text-green-800'
  };
  
  return (
    <div className={`border rounded-md p-4 ${styles[type]}`}>
      <div className="flex items-center">
        {type === 'error' ? 
          <AlertCircle className="w-5 h-5 mr-2" /> : 
          <CheckCircle className="w-5 h-5 mr-2" />
        }
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
};

// Validation function
const validateForm = (formData: Omit<TourismItem, "id">): string | null => {
  const missingFields: string[] = [];

  LANGUAGES.forEach(({ value, label }) => {
    if (!formData.title?.[value]?.trim()) {
      missingFields.push(`${label} title`);
    }
    if (!formData.description?.[value]?.trim()) {
      missingFields.push(`${label} description`);
    }
  });

  if (!formData.imageUrl.trim()) {
    missingFields.push('image');
  }

  if (missingFields.length > 0) {
    return `Please fill in: ${missingFields.join(', ')}`;
  }

  return null;
};

export default function TourismAdminPage() {
  const [tourismItems, setTourismItems] = useState<TourismItem[]>(initialTourismItems);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TourismItem | null>(null);
  const [viewingItem, setViewingItem] = useState<TourismItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en");
  const [alertMessage, setAlertMessage] = useState<{ type: 'error' | 'success'; title: string; message: string } | null>(null);

  const [newItem, setNewItem] = useState<Omit<TourismItem, "id">>({
    title: { en: "", ta: "", si: "" },
    description: { en: "", ta: "", si: "" },
    category: "Attraction",
    status: "active",
    imageUrl: "",
    date: new Date().toISOString().split('T')[0],
    views: 0,
    priceRange: "$",
    rating: 4.0,
    features: []
  });

  // Handle file upload
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (editingItem) {
          setEditingItem({ ...editingItem, imageUrl: reader.result as string });
        } else {
          setNewItem({ ...newItem, imageUrl: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddItem = () => {
    const validationError = validateForm(newItem);
    if (validationError) {
      setAlertMessage({
        type: "error",
        title: "Validation Error",
        message: validationError
      });
      setTimeout(() => setAlertMessage(null), 5000);
      return;
    }

    const item: TourismItem = { 
      id: tourismItems.length + 1, 
      ...newItem,
      date: new Date().toISOString().split('T')[0]
    };
    setTourismItems([...tourismItems, item]);
    setNewItem({
      title: { en: "", ta: "", si: "" },
      description: { en: "", ta: "", si: "" },
      category: "Attraction",
      status: "active",
      imageUrl: "",
      date: new Date().toISOString().split('T')[0],
      views: 0,
      priceRange: "$",
      rating: 4.0,
      features: []
    });
    setIsDialogOpen(false);
    setCurrentLanguage("en");
    
    setAlertMessage({
      type: "success",
      title: "Success",
      message: "Tourism item created successfully!"
    });
    setTimeout(() => setAlertMessage(null), 3000);
  };

  const handleEditItem = () => {
    if (!editingItem) return;

    const validationError = validateForm(editingItem);
    if (validationError) {
      setAlertMessage({
        type: "error",
        title: "Validation Error",
        message: validationError
      });
      setTimeout(() => setAlertMessage(null), 5000);
      return;
    }

    setTourismItems(tourismItems.map((item) => 
      item.id === editingItem.id ? editingItem : item
    ));
    setEditingItem(null);
    setIsDialogOpen(false);
    setCurrentLanguage("en");
    
    setAlertMessage({
      type: "success",
      title: "Success",
      message: "Tourism item updated successfully!"
    });
    setTimeout(() => setAlertMessage(null), 3000);
  };

  const handleDeleteItem = (id: number) => {
    setTourismItems(tourismItems.filter((item) => item.id !== id));
    
    setAlertMessage({
      type: "success",
      title: "Success",
      message: "Tourism item deleted successfully!"
    });
    setTimeout(() => setAlertMessage(null), 3000);
  };

  const handleViewItem = (item: TourismItem) => {
    setViewingItem(item);
    setIsViewDialogOpen(true);
    // Increment views
    setTourismItems(tourismItems.map(i => 
      i.id === item.id ? { ...i, views: i.views + 1 } : i
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "draft":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriceRangeColor = (priceRange: string) => {
    switch (priceRange) {
      case "$":
        return "bg-green-100 text-green-700 border-green-200";
      case "$$":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "$$$":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "$$$$":
        return "bg-purple-100 text-purple-700 border-purple-200";
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

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating})</span>
      </div>
    );
  };

  // Filter tourism items based on search term
  const filteredItems = tourismItems.filter(item =>
    item.title.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.title.ta.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.title.si.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.en.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Alert Message Display */}
      {/* {alertMessage && (
        <AlertMessage
          type={alertMessage.type}
          title={alertMessage.title}
          message={alertMessage.message}
        />
      )} */}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tourism Management</h1>
          <p className="text-gray-600 mt-1">Manage tourism attractions, events, and accommodations in Mannar</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Language Selector */}
          <Select value={currentLanguage} onValueChange={(value: Language) => setCurrentLanguage(value)}>
            <SelectTrigger className="w-full md:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ta">Tamil</SelectItem>
              <SelectItem value="si">Sinhala</SelectItem>
            </SelectContent>
          </Select>

          {/* Search Bar */}
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search tourism items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Button
            className="bg-blue-600 hover:bg-blue-700 flex items-center whitespace-nowrap"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" /> Add Tourism Item
          </Button>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Items</TabsTrigger>
          <TabsTrigger value="attractions">Attractions</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="accommodations">Accommodations</TabsTrigger>
          <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
        </TabsList>

        {/* All Items Tab */}
        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow duration-300 group">
                <div className="relative">
                  <img
                    src={item.imageUrl}
                    alt={item.title.en}
                    className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-3 left-3">
                    <Badge className={getStatusColor(item.status)}>
                      {item.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg leading-6">{item.title[currentLanguage]}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary">{item.category}</Badge>
                    <Badge className={getPriceRangeColor(item.priceRange)}>
                      {item.priceRange}
                    </Badge>
                    {renderStars(item.rating)}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <CardDescription className="line-clamp-2">
                    {item.description[currentLanguage]}
                  </CardDescription>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-between text-xs">
                      <span>{item.views} views</span>
                      <span>{item.features.length} features</span>
                    </div>
                  </div>

                  {/* Features Tags */}
                  {item.features.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.features.slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {item.features.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{item.features.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleViewItem(item)}
                    >
                      <Eye className="w-4 h-4 mr-1" /> View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingItem(item);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Category Tabs */}
        {[
          { value: "attractions", filter: (item: TourismItem) => item.category === "Attraction" },
          { value: "events", filter: (item: TourismItem) => item.category === "Event" },
          { value: "accommodations", filter: (item: TourismItem) => item.category === "Accommodation" },
          { value: "restaurants", filter: (item: TourismItem) => item.category === "Restaurant" }
        ].map(({ value, filter }) => (
          <TabsContent key={value} value={value}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.filter(filter).map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow duration-300">
                  <img
                    src={item.imageUrl}
                    alt={item.title.en}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <CardHeader>
                    <CardTitle className="text-lg">{item.title[currentLanguage]}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{item.category}</Badge>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status.toUpperCase()}
                      </Badge>
                      {renderStars(item.rating)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="line-clamp-2">
                      {item.description[currentLanguage]}
                    </CardDescription>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleViewItem(item)}
                      >
                        <Eye className="w-4 h-4 mr-1" /> View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingItem(item);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          setEditingItem(null);
          setCurrentLanguage("en");
        }
      }}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit Tourism Item" : "Add New Tourism Item"}
            </DialogTitle>
          </DialogHeader>
          {alertMessage && (
        <AlertMessage
          type={alertMessage.type}
          title={alertMessage.title}
          message={alertMessage.message}
        />
      )}

          <div className="space-y-6 py-4">
            {/* Language Tabs */}
            <Tabs value={currentLanguage} onValueChange={(value) => setCurrentLanguage(value as Language)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="ta">Tamil</TabsTrigger>
                <TabsTrigger value="si">Sinhala</TabsTrigger>
              
              </TabsList>

              {LANGUAGES.map((lang) => (
                <TabsContent key={lang.value} value={lang.value} className="space-y-4">
                  {/* Title */}
                  <div className="space-y-3">
                    <Label htmlFor={`title-${lang.value}`}>
                      Title in {lang.label} *
                    </Label>
                    <Input
                      id={`title-${lang.value}`}
                      value={editingItem?.title[lang.value] || newItem.title[lang.value]}
                      onChange={(e) =>
                        editingItem
                          ? setEditingItem({ 
                              ...editingItem, 
                              title: { ...editingItem.title, [lang.value]: e.target.value } 
                            })
                          : setNewItem({ 
                              ...newItem, 
                              title: { ...newItem.title, [lang.value]: e.target.value } 
                            })
                      }
                      placeholder={`Enter title in ${lang.label}`}
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-3">
                    <Label htmlFor={`description-${lang.value}`}>
                      Description in {lang.label} *
                    </Label>
                    <Textarea
                      id={`description-${lang.value}`}
                      value={editingItem?.description[lang.value] || newItem.description[lang.value]}
                      onChange={(e) =>
                        editingItem
                          ? setEditingItem({ 
                              ...editingItem, 
                              description: { ...editingItem.description, [lang.value]: e.target.value } 
                            })
                          : setNewItem({ 
                              ...newItem, 
                              description: { ...newItem.description, [lang.value]: e.target.value } 
                            })
                      }
                      placeholder={`Enter description in ${lang.label}`}
                      rows={4}
                    />
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            {/* Image Upload */}
            <div className="space-y-3">
              <Label htmlFor="imageUrl">
                Tourism Item Image *
              </Label>
              <Input
                id="imageUrl"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {(editingItem?.imageUrl || newItem.imageUrl) && (
                <div className="mt-2">
                  <img
                    src={editingItem?.imageUrl || newItem.imageUrl}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>

            {/* Category and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label>Category *</Label>
                <Select
                  value={editingItem?.category || newItem.category}
                  onValueChange={(value) =>
                    editingItem
                      ? setEditingItem({ ...editingItem, category: value as any })
                      : setNewItem({ ...newItem, category: value as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Attraction">Attraction</SelectItem>
                    <SelectItem value="Event">Event</SelectItem>
                    <SelectItem value="Accommodation">Accommodation</SelectItem>
                    <SelectItem value="Restaurant">Restaurant</SelectItem>
                    <SelectItem value="Adventure">Adventure</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Status *</Label>
                <Select
                  value={editingItem?.status || newItem.status}
                  onValueChange={(value) =>
                    editingItem
                      ? setEditingItem({ ...editingItem, status: value as any })
                      : setNewItem({ ...newItem, status: value as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Price Range and Rating */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label>Price Range</Label>
                <Select
                  value={editingItem?.priceRange || newItem.priceRange}
                  onValueChange={(value) =>
                    editingItem
                      ? setEditingItem({ ...editingItem, priceRange: value as any })
                      : setNewItem({ ...newItem, priceRange: value as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="$">$ - Budget</SelectItem>
                    <SelectItem value="$$">$$ - Moderate</SelectItem>
                    <SelectItem value="$$$">$$$ - Expensive</SelectItem>
                    <SelectItem value="$$$$">$$$$ - Luxury</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Rating</Label>
                <Select
                  value={(editingItem?.rating || newItem.rating).toString()}
                  onValueChange={(value) =>
                    editingItem
                      ? setEditingItem({ ...editingItem, rating: parseFloat(value) })
                      : setNewItem({ ...newItem, rating: parseFloat(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((rating) => (
                      <SelectItem key={rating} value={rating.toString()}>
                        {rating} Stars
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <Label htmlFor="features">
                Features (comma separated)
              </Label>
              <Input
                id="features"
                value={(editingItem?.features || newItem.features).join(", ")}
                onChange={(e) => {
                  const features = e.target.value.split(",").map(f => f.trim()).filter(f => f);
                  editingItem
                    ? setEditingItem({ ...editingItem, features })
                    : setNewItem({ ...newItem, features })
                }}
                placeholder="e.g., Swimming Pool, WiFi, Parking, Guided Tours"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsDialogOpen(false);
              setEditingItem(null);
              setCurrentLanguage("en");
            }}>
              Cancel
            </Button>
            <Button onClick={editingItem ? handleEditItem : handleAddItem}>
              {editingItem ? "Save Changes" : "Add Tourism Item"}
            </Button>
          </DialogFooter>
            {alertMessage && (
        <AlertMessage
          type={alertMessage.type}
          title={alertMessage.title}
          message={alertMessage.message}
        />
      )}
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {viewingItem?.title[currentLanguage]}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {viewingItem?.imageUrl && (
              <img
                src={viewingItem.imageUrl}
                alt={viewingItem.title.en}
                className="w-full h-64 object-cover rounded-lg"
              />
            )}
            
            <div className="space-y-4">
              {/* Language Selector for View */}
              <Tabs value={currentLanguage} onValueChange={(value) => setCurrentLanguage(value as Language)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="ta">Tamil</TabsTrigger>
                  <TabsTrigger value="si">Sinhala</TabsTrigger>
                </TabsList>

                <TabsContent value={currentLanguage} className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-gray-700">{viewingItem?.description[currentLanguage]}</p>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold">Tourism Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <Badge variant="secondary">{viewingItem?.category}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge className={viewingItem ? getStatusColor(viewingItem.status) : ""}>
                        {viewingItem?.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price Range:</span>
                      <Badge className={viewingItem ? getPriceRangeColor(viewingItem.priceRange) : ""}>
                        {viewingItem?.priceRange}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating:</span>
                      {viewingItem && renderStars(viewingItem.rating)}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">Published Date</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{viewingItem && formatDate(viewingItem.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-gray-500" />
                      <span>{viewingItem?.views} views</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Features */}
              {viewingItem?.features && viewingItem.features.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold">Features & Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {viewingItem.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-50">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
            </div>
             
          </div>
         

          <DialogFooter>
          
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Download Details
            </Button>
          
          </DialogFooter>
        
        </DialogContent>
       
     
      </Dialog>
    </div>
  );
}