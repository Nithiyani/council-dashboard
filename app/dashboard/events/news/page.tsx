"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Images, Plus, Upload, Trash2, Search, Video, FolderPlus, Eye, Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Album {
  id: number;
  name: string;
  description: string;
  coverImage: string;
  itemCount: number;
  type: 'photos' | 'videos';
}

interface Photo {
  id: number;
  title: string;
  url: string;
  albumId: number;
  uploadDate: string;
}

interface Video {
  id: number;
  title: string;
  thumbnail: string;
  duration: string;
  albumId: number;
  uploadDate: string;
}

interface Gallery {
  albums: Album[];
  photos: Photo[];
  videos: Video[];
}

const galleryData: Gallery = {
  albums: [
    {
      id: 1,
      name: "Community Events 2024",
      description: "Photos from various community events throughout 2024",
      coverImage: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=300",
      itemCount: 24,
      type: "photos"
    },
    {
      id: 2,
      name: "Infrastructure Projects",
      description: "Documentation of ongoing infrastructure development",
      coverImage: "https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=300",
      itemCount: 18,
      type: "photos"
    },
    {
      id: 3,
      name: "Council Meetings",
      description: "Video recordings of council meetings and sessions",
      coverImage: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=300",
      itemCount: 12,
      type: "videos"
    }
  ],
  photos: [
    {
      id: 1,
      title: "Town Hall Meeting",
      url: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400",
      albumId: 1,
      uploadDate: "2024-12-15"
    },
    {
      id: 2,
      title: "Community Festival",
      url: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400",
      albumId: 1,
      uploadDate: "2024-12-10"
    },
    {
      id: 3,
      title: "Road Construction",
      url: "https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=400",
      albumId: 2,
      uploadDate: "2024-12-08"
    },
    {
      id: 4,
      title: "Park Development",
      url: "https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=400",
      albumId: 2,
      uploadDate: "2024-12-05"
    }
  ],
  videos: [
    {
      id: 1,
      title: "December Council Meeting",
      thumbnail: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400",
      duration: "1:45:30",
      albumId: 3,
      uploadDate: "2024-12-20"
    },
    {
      id: 2,
      title: "Budget Discussion Session",
      thumbnail: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400",
      duration: "2:15:45",
      albumId: 3,
      uploadDate: "2024-12-18"
    }
  ]
};

export default function GalleryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateAlbumOpen, setIsCreateAlbumOpen] = useState(false);
  const [isUploadPhotoOpen, setIsUploadPhotoOpen] = useState(false);
  const [isUploadVideoOpen, setIsUploadVideoOpen] = useState(false);
  const [gallery, setGallery] = useState<Gallery>(galleryData);
  const [newAlbum, setNewAlbum] = useState<{ name: string; description: string; type: 'photos' | 'videos' }>({ name: '', description: '', type: 'photos' });

  const filteredAlbums = gallery.albums.filter(album =>
    album.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    album.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateAlbum = () => {
    const album: Album = {
      id: gallery.albums.length + 1,
      ...newAlbum,
      coverImage: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=300",
      itemCount: 0
    };
    setGallery({
      ...gallery,
      albums: [...gallery.albums, album]
    });
    setNewAlbum({ name: '', description: '', type: 'photos' });
    setIsCreateAlbumOpen(false);
  };

  const handleDeleteAlbum = (id: number) => {
    setGallery({
      ...gallery,
      albums: gallery.albums.filter(album => album.id !== id)
    });
  };

  const handleUploadPhoto = () => {
    // TODO: Implement photo upload logic
    setIsUploadPhotoOpen(false);
  };

  const handleUploadVideo = () => {
    // TODO: Implement video upload logic
    setIsUploadVideoOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900"> news Management</h1>
          <p className="text-gray-600">Manage photos, videos, and media albums</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setIsUploadPhotoOpen(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Photo
          </Button>
          <Button variant="outline" onClick={() => setIsUploadVideoOpen(true)}>
            <Video className="w-4 h-4 mr-2" />
            Upload Video
          </Button>
          <Button variant="outline" onClick={() => setIsCreateAlbumOpen(true)}>
            <FolderPlus className="w-4 h-4 mr-2" />
            Create Album
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-2 bg-blue-100 rounded-lg"><Images className="w-6 h-6 text-blue-600" /></div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Albums</p>
              <p className="text-2xl font-bold">{gallery.albums.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-2 bg-green-100 rounded-lg"><Images className="w-6 h-6 text-green-600" /></div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Photos</p>
              <p className="text-2xl font-bold">{gallery.photos.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-2 bg-orange-100 rounded-lg"><Video className="w-6 h-6 text-orange-600" /></div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Videos</p>
              <p className="text-2xl font-bold">{gallery.videos.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-2 bg-purple-100 rounded-lg"><Upload className="w-6 h-6 text-purple-600" /></div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Media</p>
              <p className="text-2xl font-bold">{gallery.photos.length + gallery.videos.length}</p>
            </div>
          </CardContent>
        </Card>
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

      {/* Gallery Tabs */}
      <Tabs defaultValue="albums" className="space-y-4">
        <TabsList>
          <TabsTrigger value="albums">Albums</TabsTrigger>
          <TabsTrigger value="photos">All Photos</TabsTrigger>
          <TabsTrigger value="videos">All Videos</TabsTrigger>
        </TabsList>

        {/* Albums */}
        <TabsContent value="albums" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlbums.map(album => (
              <Card key={album.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                <div className="aspect-video relative">
                  <img src={album.coverImage} alt={album.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2">
                    <Badge variant={album.type === 'photos' ? 'default' : 'secondary'}>
                      {album.type === 'photos' ? <Images className="w-3 h-3 mr-1" /> : <Video className="w-3 h-3 mr-1" />}
                      {album.itemCount}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{album.name}</CardTitle>
                  <CardDescription>{album.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{album.itemCount} items</span>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDeleteAlbum(album.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Photos */}
        <TabsContent value="photos" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery.photos.map(photo => (
              <Card key={photo.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                <div className="aspect-square relative">
                  <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" />
                </div>
                <CardContent className="p-3">
                  <p className="font-medium text-sm truncate">{photo.title}</p>
                  <p className="text-xs text-gray-500">{new Date(photo.uploadDate).toLocaleDateString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Videos */}
        <TabsContent value="videos" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.videos.map(video => (
              <Card key={video.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                <div className="aspect-video relative">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
                      <Video className="w-8 h-8 text-gray-800" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2">
                    <Badge variant="secondary">{video.duration}</Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{video.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{new Date(video.uploadDate).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      {/* Create Album Dialog */}
      <Dialog open={isCreateAlbumOpen} onOpenChange={setIsCreateAlbumOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Album</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="album-name" className="text-right">Name</Label>
              <Input id="album-name" className="col-span-3" value={newAlbum.name} onChange={(e) => setNewAlbum({...newAlbum, name: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="album-description" className="text-right">Description</Label>
              <Input id="album-description" className="col-span-3" value={newAlbum.description} onChange={(e) => setNewAlbum({...newAlbum, description: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="album-type" className="text-right">Type</Label>
              <select
                id="album-type"
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={newAlbum.type}
                onChange={(e) => setNewAlbum({...newAlbum, type: e.target.value as 'photos' | 'videos'})}
              >
                <option value="photos">Photos</option>
                <option value="videos">Videos</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateAlbumOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateAlbum}>Create Album</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
