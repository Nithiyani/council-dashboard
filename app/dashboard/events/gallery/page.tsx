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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Upload, Video, FolderPlus, Search } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface Album {
  id: number;
  name: string;
  description: string;
  coverImage: string;
  itemCount: number;
  type: "photos" | "videos";
}

interface Photo {
  id: number;
  title: string;
  url: string;
  albumId: number;
  uploadDate: string;
}

interface VideoType {
  id: number;
  title: string;
  url: string; // Added url for uploaded videos
  duration: string;
  albumId: number;
  uploadDate: string;
}

interface Gallery {
  albums: Album[];
  photos: Photo[];
  videos: VideoType[];
}

const galleryData: Gallery = {
  albums: [
    {
      id: 1,
      name: "Community Events 2024",
      description: "Photos from various community events throughout 2024",
      coverImage:
        "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=300",
      itemCount: 2,
      type: "photos",
    },
    {
      id: 2,
      name: "Infrastructure Projects",
      description: "Documentation of ongoing infrastructure development",
      coverImage:
        "https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=300",
      itemCount: 1,
      type: "photos",
    },
    {
      id: 3,
      name: "Council Meetings",
      description: "Video recordings of council meetings and sessions",
      coverImage:
        "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=300",
      itemCount: 1,
      type: "videos",
    },
  ],
  photos: [
    {
      id: 1,
      title: "Town Hall Meeting",
      url: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400",
      albumId: 1,
      uploadDate: "2024-12-15",
    },
    {
      id: 2,
      title: "Community Festival",
      url: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400",
      albumId: 1,
      uploadDate: "2024-12-10",
    },
    {
      id: 3,
      title: "Road Construction",
      url: "https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=400",
      albumId: 2,
      uploadDate: "2024-12-08",
    },
  ],
  videos: [
    {
      id: 1,
      title: "December Council Meeting",
      url: "https://www.w3schools.com/html/mov_bbb.mp4", // example video url
      duration: "1:45:30",
      albumId: 3,
      uploadDate: "2024-12-20",
    },
  ],
};

export default function GalleryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateAlbumOpen, setIsCreateAlbumOpen] = useState(false);
  const [isUploadPhotoOpen, setIsUploadPhotoOpen] = useState(false);
  const [isUploadVideoOpen, setIsUploadVideoOpen] = useState(false);
  const [gallery, setGallery] = useState<Gallery>(galleryData);
  const [newAlbum, setNewAlbum] = useState<{
    name: string;
    description: string;
    type: "photos" | "videos";
  }>({ name: "", description: "", type: "photos" });
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  const filteredAlbums = gallery.albums.filter(
    (album) =>
      album.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      album.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateAlbum = () => {
    const album: Album = {
      id: gallery.albums.length + 1,
      ...newAlbum,
      coverImage:
        "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=300",
      itemCount: 0,
    };
    setGallery({
      ...gallery,
      albums: [...gallery.albums, album],
    });
    setNewAlbum({ name: "", description: "", type: "photos" });
    setIsCreateAlbumOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gallery Management</h1>
          <p className="text-gray-600">
            Manage photos, videos, and media albums
          </p>
        </div>
      </div>

      {/* Search */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search albums..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="albums" className="space-y-4">
        <TabsList>
          <TabsTrigger value="albums">Albums</TabsTrigger>
          <TabsTrigger value="photos">All Photos</TabsTrigger>
          <TabsTrigger value="videos">All Videos</TabsTrigger>
        </TabsList>

        {/* Albums */}
        <TabsContent value="albums" className="space-y-4">
          {!selectedAlbum ? (
            <>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateAlbumOpen(true)}
                >
                  <FolderPlus className="w-4 h-4 mr-2" /> Create Album
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAlbums.map((album) => (
                  <Card
                    key={album.id}
                    className="hover:shadow-lg transition-shadow overflow-hidden cursor-pointer"
                    onClick={() => setSelectedAlbum(album)}
                  >
                    <div className="aspect-video relative">
                      <img
                        src={album.coverImage}
                        alt={album.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge>
                          {album.itemCount} {album.type}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{album.name}</CardTitle>
                      <CardDescription>{album.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Album details */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{selectedAlbum.name}</h2>
                <div className="flex space-x-2">
                  <Button onClick={() => setIsUploadPhotoOpen(true)}>
                    <Upload className="w-4 h-4 mr-2" /> Upload Photo
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsUploadVideoOpen(true)}
                  >
                    <Video className="w-4 h-4 mr-2" /> Upload Video
                  </Button>
                  <Button variant="ghost" onClick={() => setSelectedAlbum(null)}>
                    Back
                  </Button>
                </div>
              </div>
              <p className="text-gray-600">{selectedAlbum.description}</p>

              {/* Items */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedAlbum.type === "photos"
                  ? gallery.photos
                      .filter((p) => p.albumId === selectedAlbum.id)
                      .map((photo) => (
                        <Card key={photo.id}>
                          <img
                            src={photo.url}
                            alt={photo.title}
                            className="w-full h-40 object-cover"
                          />
                          <CardContent>
                            <p className="text-sm">{photo.title}</p>
                          </CardContent>
                        </Card>
                      ))
                  : gallery.videos
                      .filter((v) => v.albumId === selectedAlbum.id)
                      .map((video) => (
                        <Card key={video.id}>
                          <video
                            src={video.url}
                            controls
                            className="w-full h-40 object-cover"
                          />
                          <CardContent>
                            <p className="text-sm">{video.title}</p>
                            <p className="text-xs text-gray-500">{video.duration}</p>
                          </CardContent>
                        </Card>
                      ))}
              </div>
            </>
          )}
        </TabsContent>

        {/* All Photos Tab */}
        <TabsContent value="photos">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {gallery.photos.map((photo) => (
              <Card key={photo.id}>
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-40 object-cover"
                />
                <CardContent>
                  <p className="text-sm">{photo.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* All Videos Tab */}
        <TabsContent value="videos">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {gallery.videos.map((video) => (
              <Card key={video.id}>
                <video
                  src={video.url}
                  controls
                  className="w-full h-40 object-cover"
                />
                <CardContent>
                  <p className="text-sm">{video.title}</p>
                  <p className="text-xs text-gray-500">{video.duration}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Album Dialog */}
      <Dialog open={isCreateAlbumOpen} onOpenChange={setIsCreateAlbumOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Album</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Name</Label>
              <Input
                value={newAlbum.name}
                onChange={(e) =>
                  setNewAlbum({ ...newAlbum, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Description</Label>
              <Input
                value={newAlbum.description}
                onChange={(e) =>
                  setNewAlbum({ ...newAlbum, description: e.target.value })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateAlbumOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAlbum}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Photo Dialog */}
      <Dialog open={isUploadPhotoOpen} onOpenChange={setIsUploadPhotoOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Photo</DialogTitle>
          </DialogHeader>
          <p>Choose photo(s) to upload to album: {selectedAlbum?.name}</p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              if (!selectedAlbum) return;
              const files = e.target.files;
              if (!files || files.length === 0) return;

              const newPhotos = Array.from(files).map((file, index) => ({
                id: gallery.photos.length + index + 1,
                title: file.name,
                url: URL.createObjectURL(file),
                albumId: selectedAlbum.id,
                uploadDate: new Date().toISOString(),
              }));

              setGallery({
                ...gallery,
                photos: [...gallery.photos, ...newPhotos],
              });
              setIsUploadPhotoOpen(false);
            }}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadPhotoOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Video Dialog */}
      <Dialog open={isUploadVideoOpen} onOpenChange={setIsUploadVideoOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Video</DialogTitle>
          </DialogHeader>
          <p>Choose video(s) to upload to album: {selectedAlbum?.name}</p>
          <input
            type="file"
            multiple
            accept="video/*"
            onChange={(e) => {
              if (!selectedAlbum) return;
              const files = e.target.files;
              if (!files || files.length === 0) return;

              const newVideos = Array.from(files).map((file, index) => ({
                id: gallery.videos.length + index + 1,
                title: file.name,
                url: URL.createObjectURL(file),
                duration: "00:05:00",
                albumId: selectedAlbum.id,
                uploadDate: new Date().toISOString(),
              }));

              setGallery({
                ...gallery,
                videos: [...gallery.videos, ...newVideos],
              });
              setIsUploadVideoOpen(false);
            }}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadVideoOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
