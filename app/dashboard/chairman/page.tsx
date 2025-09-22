"use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Crown, Edit, Calendar, MapPin, Phone, Mail, Award } from 'lucide-react';

// ----------------- Types -----------------
interface ContactInfo {
  phone: string;
  email: string;
  address: string;
}

interface TenureInfo {
  startDate: string;
  currentTerm: string;
}

interface ChairmanData {
  name: string;
  position: string;
  photo: string;
  message: string;
  contact: ContactInfo;
  tenure: TenureInfo;
}

interface InfoCardItem {
  title: string;
  subtext?: string;
}

interface InfoCardProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  items: InfoCardItem[];
  setItems: React.Dispatch<React.SetStateAction<InfoCardItem[]>>;
}

// ----------------- InfoCard Component -----------------
function InfoCard({ title, description, icon: Icon, items, setItems }: InfoCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSubtext, setNewSubtext] = useState("");

  const handleAddItem = () => {
    if (newTitle.trim() !== "") {
      setItems([...items, { title: newTitle.trim(), subtext: newSubtext.trim() }]);
      setNewTitle("");
      setNewSubtext("");
      setIsDialogOpen(false);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5 text-yellow-600" />}
          {title}
        </CardTitle>
        <p className="text-sm text-gray-500">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">{item.title}</span>
              {item.subtext && <p className="text-xs text-gray-500 mt-1">{item.subtext}</p>}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Add {title}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New {title}</DialogTitle>
                <p className="text-sm text-gray-500 mt-1">{description}</p>
              </DialogHeader>
              <div className="py-4 space-y-2">
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={`Enter ${title} title...`}
                />
                <Input
                  value={newSubtext}
                  onChange={(e) => setNewSubtext(e.target.value)}
                  placeholder={`Enter ${title} details (e.g., University, Country)...`}
                />
              </div>
              <DialogFooter className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddItem}>Add</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}

// ----------------- Initial Data -----------------
const initialChairmanData: ChairmanData = {
  name: "Dr. Sarah Johnson",
  position: "Chairman",
  photo: "https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=300",
  message: "As Chairman, I am committed to serving our community with transparency, dedication, and progress. Together, we will build a stronger, more prosperous future for all residents.",
  contact: {
    phone: "+1 (555) 123-4567",
    email: "chairman@council.gov",
    address: "Municipal Building, Main Street"
  },
  tenure: {
    startDate: "January 2022",
    currentTerm: "2022-2026"
  }
};

// ----------------- ChairmanPage Component -----------------
export default function ChairmanPage() {
  const [chairmanData, setChairmanData] = useState<ChairmanData>(initialChairmanData);
  const [editData, setEditData] = useState<ChairmanData>(initialChairmanData);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);

  // Academics & Honours
  const [academics, setAcademics] = useState<InfoCardItem[]>([
    { title: "Master of Science (Mechanical Engineering, Production Technology)", subtext: "University of XYZ, Country" },
    { title: "Certificate in Senior Management", subtext: "ABC Institute, Country" },
    { title: "Certificate in Standardization & Quality Control", subtext: "DEF Organization, Country" },
    { title: "Certificate in Natural Product Standards (RBS Standards & Technology)", subtext: "GHI University, Country" }
  ]);

  const [honours, setHonours] = useState<InfoCardItem[]>([
    { title: "Master of Science (M.Sc.) in Mechanical Engineering (Production Technology)", subtext: "Tribhuvan University, Kathmandu, Nepal" },
    { title: "Bachelor of Engineering (B.E.) in Civil Engineering", subtext: "Institute of Engineering, Pulchowk Campus, Tribhuvan University, Nepal" },
    { title: "Certificate in Senior Management", subtext: "Nepal Engineering Council, Kathmandu, Nepal" },
    { title: "Certificate in Standardization & Quality Control", subtext: "Nepal Bureau of Standards and Metrology, Lalitpur, Nepal" }
  ]);

  // Save profile
  const handleSaveProfile = () => {
    setChairmanData(editData);
    setIsEditDialogOpen(false);
  }

  // Save message
  const handleSaveMessage = () => {
    setChairmanData({...chairmanData, message: editData.message});
    setIsMessageDialogOpen(false);
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chairman Management</h1>
          <p className="text-gray-600">Manage chairman profile and information</p>
        </div>
        <div className="flex space-x-2">
          {/* Edit Profile */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Edit Chairman Profile</DialogTitle>
                <p className="text-sm text-gray-500 mt-1">Update chairman information and details.</p>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input id="name" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="position" className="text-right">Position</Label>
                  <Input id="position" value={editData.position} onChange={(e) => setEditData({...editData, position: e.target.value})} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">Phone</Label>
                  <Input id="phone" value={editData.contact.phone} onChange={(e) => setEditData({...editData, contact: {...editData.contact, phone: e.target.value}})} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">Email</Label>
                  <Input id="email" value={editData.contact.email} onChange={(e) => setEditData({...editData, contact: {...editData.contact, email: e.target.value}})} className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveProfile}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Profile & Message */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile */}
        <Card className="lg:col-span-1 hover:shadow-lg transition-shadow">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-32 h-32 rounded-full overflow-hidden mb-4">
              <img src={chairmanData.photo} alt={chairmanData.name} className="w-full h-full object-cover" />
            </div>
            <CardTitle className="flex items-center justify-center gap-2"><Crown className="w-5 h-5 text-yellow-600" />{chairmanData.name}</CardTitle>
            <CardDescription className="text-lg font-medium">{chairmanData.position}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2 text-sm"><Calendar className="w-4 h-4 text-blue-600" /><span>Term: {chairmanData.tenure.currentTerm}</span></div>
            <div className="flex items-center space-x-2 text-sm"><Phone className="w-4 h-4 text-green-600" /><span>{chairmanData.contact.phone}</span></div>
            <div className="flex items-center space-x-2 text-sm"><Mail className="w-4 h-4 text-red-600" /><span>{chairmanData.contact.email}</span></div>
            <div className="flex items-center space-x-2 text-sm"><MapPin className="w-4 h-4 text-purple-600" /><span>{chairmanData.contact.address}</span></div>
          </CardContent>
        </Card>

        {/* Message */}
        <Card className="lg:col-span-2 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Chairman's Message</CardTitle>
              <CardDescription>Official message from the chairman</CardDescription>
            </div>
            <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm"><Edit className="w-4 h-4 mr-2" />Update Message</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                  <DialogTitle>Update Chairman's Message</DialogTitle>
                  <p className="text-sm text-gray-500 mt-1">Edit the official message from the chairman.</p>
                </DialogHeader>
                <div className="py-4">
                  <Textarea value={editData.message} onChange={(e) => setEditData({...editData, message: e.target.value})} className="min-h-[200px]" placeholder="Enter chairman's message..." />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsMessageDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleSaveMessage}>Update Message</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed text-lg">"{chairmanData.message}"</p>
          </CardContent>
        </Card>
      </div>

      {/* Academics & Honours */}
      <InfoCard title="Academics & Qualifications" description="Educational background and qualifications" icon={Award} items={academics} setItems={setAcademics} />
      <InfoCard title="Honours" description="Recognitions and honours received" icon={Award} items={honours} setItems={setHonours} />

    </div>
  );
}
