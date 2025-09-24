"use client";

import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Trash2, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Service {
  id: number;
  title: string;
  description: string;
}

const initialServices: Service[] = [
  {
    id: 1,
    title: "Garbage Collection",
    description:
      "Schedules, guidelines, and contacts for waste collection across all wards and zones.",
  },
  {
    id: 2,
    title: "Certificates & Permits",
    description:
      "Guidance on applying for birth, marriage, death certificates, and business permits.",
  },
  {
    id: 3,
    title: "Public Notices",
    description:
      "Official announcements, tenders, council meetings, budget reports, and consultations.",
  },
];

export default function ServicesAdmin() {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [newService, setNewService] = useState({ title: "", description: "" });

  const handleAddService = () => {
    const service: Service = {
      id: services.length + 1,
      title: newService.title,
      description: newService.description,
    };
    setServices([...services, service]);
    setNewService({ title: "", description: "" });
    setIsDialogOpen(false);
  };

  const handleEditService = () => {
    if (editingService) {
      setServices(
        services.map((s) => (s.id === editingService.id ? editingService : s))
      );
      setEditingService(null);
      setIsDialogOpen(false);
    }
  };

  const handleDeleteService = (id: number) => {
    setServices(services.filter((s) => s.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Admin - Services</h1>

      <Button
        variant="outline"
        className="flex items-center mb-4"
        onClick={() => setIsDialogOpen(true)}
      >
        <Plus className="w-4 h-4 mr-2" /> Add New Service
      </Button>

      <Tabs defaultValue="services" className="space-y-4">
        <TabsList>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>

        <TabsContent value="services">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id}>
                <CardHeader>
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{service.description}</CardDescription>
                  <div className="flex space-x-2 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingService(service);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteService(service.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog for Add / Edit */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingService ? "Edit Service" : "Add New Service"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Title</Label>
              <Input
                className="col-span-3"
                value={editingService?.title || newService.title}
                onChange={(e) =>
                  editingService
                    ? setEditingService({ ...editingService, title: e.target.value })
                    : setNewService({ ...newService, title: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Description</Label>
              <Input
                className="col-span-3"
                value={editingService?.description || newService.description}
                onChange={(e) =>
                  editingService
                    ? setEditingService({ ...editingService, description: e.target.value })
                    : setNewService({ ...newService, description: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={editingService ? handleEditService : handleAddService}>
              {editingService ? "Save" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
