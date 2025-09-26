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
import { Plus, Trash2, Edit } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TourismItem {
  id: number;
  title: string;
  description: string;
  category: "Attraction" | "Event" | "Accommodation";
  imageUrl: string;
}

const initialItems: TourismItem[] = [
  {
    id: 1,
    title: "Mannar Fort",
    description: "A historic fort with scenic views.",
    category: "Attraction",
    imageUrl:
      "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?w=400",
  },
];

export default function TourismAdmin() {
  const [items, setItems] = useState<TourismItem[]>(initialItems);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TourismItem | null>(null);
  const [newItem, setNewItem] = useState<Omit<TourismItem, "id">>({
    title: "",
    description: "",
    category: "Attraction",
    imageUrl: "",
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
    const item: TourismItem = { id: items.length + 1, ...newItem };
    setItems([...items, item]);
    setNewItem({ title: "", description: "", category: "Attraction", imageUrl: "" });
    setIsDialogOpen(false);
  };

  const handleEditItem = () => {
    if (editingItem) {
      setItems(items.map((i) => (i.id === editingItem.id ? editingItem : i)));
      setEditingItem(null);
      setIsDialogOpen(false);
    }
  };

  const handleDeleteItem = (id: number) => {
    setItems(items.filter((i) => i.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Tourism Admin Dashboard</h1>

      <Button
        variant="outline"
        className="flex items-center"
        onClick={() => setIsDialogOpen(true)}
      >
        <Plus className="w-4 h-4 mr-2" /> Add New Tourism Item
      </Button>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="attractions">Attractions</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="accommodations">Accommodations</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-40 object-cover"
                />
                <CardContent>
                  <CardDescription>{item.description}</CardDescription>
                  <p className="mt-2 font-medium">{item.category}</p>
                  <div className="flex space-x-2 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingItem(item);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {["attractions", "events", "accommodations"].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items
                .filter((i) =>
                  tab === "attractions"
                    ? i.category === "Attraction"
                    : tab === "events"
                    ? i.category === "Event"
                    : i.category === "Accommodation"
                )
                .map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <CardTitle>{item.title}</CardTitle>
                    </CardHeader>
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-40 object-cover"
                    />
                    <CardContent>
                      <CardDescription>{item.description}</CardDescription>
                      <p className="mt-2 font-medium">{item.category}</p>
                      <div className="flex space-x-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingItem(item);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-1" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Dialog for Add / Edit */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit Tourism Item" : "Add Tourism Item"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Image</Label>
              <Input
                type="file"
                className="col-span-3"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Title</Label>
              <Input
                className="col-span-3"
                value={editingItem?.title || newItem.title}
                onChange={(e) =>
                  editingItem
                    ? setEditingItem({ ...editingItem, title: e.target.value })
                    : setNewItem({ ...newItem, title: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Description</Label>
              <Textarea
                className="col-span-3"
                value={editingItem?.description || newItem.description}
                onChange={(e) =>
                  editingItem
                    ? setEditingItem({ ...editingItem, description: e.target.value })
                    : setNewItem({ ...newItem, description: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Category</Label>
              <Select
                value={editingItem?.category || newItem.category}
                onValueChange={(value) =>
                  editingItem
                    ? setEditingItem({ ...editingItem, category: value as any })
                    : setNewItem({ ...newItem, category: value as any })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Attraction">Attraction</SelectItem>
                  <SelectItem value="Event">Event</SelectItem>
                  <SelectItem value="Accommodation">Accommodation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={editingItem ? handleEditItem : handleAddItem}>
              {editingItem ? "Save Changes" : "Add Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
