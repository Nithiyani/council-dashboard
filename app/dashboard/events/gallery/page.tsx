"use client";

import { useState, useRef, useEffect } from "react";
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
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  FolderPlus, 
  Search, 
  Trash2, 
  Edit, 
  X, 
  Image as ImageIcon,
  Video as VideoIcon,
  MoreVertical,
  Plus,
  ArrowLeft,
  Grid3X3,
  List,
  Download,
  Share,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Clock,
  FileText
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Album {
  id: number;
  name: string;
  description: string;
  coverImage: string;
  itemCount: number;
  createdAt: string;
}

interface MediaItem {
  id: number;
  title: string;
  url: string;
  type: 'image' | 'video';
  albumId: number;
  uploadDate: string;
  size?: string;
  duration?: string;
  dimensions?: string;
}

interface Gallery {
  albums: Album[];
  media: MediaItem[];
}

interface NavigationState {
  view: 'albums' | 'album-detail' | 'media-detail';
  albumId?: number;
  mediaId?: number;
  previousState?: NavigationState;
}

interface VideoControls {
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
}

const defaultCoverImages = [
  "https://images.unsplash.com/photo-1542736667-069246bdbc6d?w=300&h=200&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop",
  "https://images.unsplash.com/photo-1554629947-334ff61d85dc?w=300&h=200&fit=crop",
  "https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=300&h=200&fit=crop"
];

const galleryData: Gallery = {
  albums: [
    {
      id: 1,
      name: "Summer Vacation 2024",
      description: "Beautiful memories from our summer trip",
      coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=200&fit=crop",
      itemCount: 12,
      createdAt: "2024-06-15",
    },
    {
      id: 2,
      name: "Family Events",
      description: "All our family gatherings and celebrations",
      coverImage: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=300&h=200&fit=crop",
      itemCount: 8,
      createdAt: "2024-05-20",
    },
    {
      id: 3,
      name: "Work Projects",
      description: "Documentation of ongoing work projects",
      coverImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop",
      itemCount: 5,
      createdAt: "2024-07-10",
    },
  ],
  media: [
    {
      id: 1,
      title: "Beach Sunset",
      url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop",
      type: 'image',
      albumId: 1,
      uploadDate: "2024-06-15",
      size: "4.2 MB",
      dimensions: "1920x1080"
    },
    {
      id: 2,
      title: "Mountain Hike",
      url: "https://images.unsplash.com/photo-1464822759844-b28c9536c9b4?w=800&h=600&fit=crop",
      type: 'image',
      albumId: 1,
      uploadDate: "2024-06-16",
      size: "3.8 MB",
      dimensions: "1920x1080"
    },
    {
      id: 3,
      title: "Project Meeting Recording",
      url: "https://videos.pexels.com/video-files/3195393/3195393-uhd_2560_1440_25fps.mp4",
      type: 'video',
      albumId: 3,
      uploadDate: "2024-07-10",
      duration: "2:30",
      size: "15.7 MB",
      dimensions: "2560x1440"
    },
    {
      id: 4,
      title: "Birthday Party Celebration",
      url: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800&h=600&fit=crop",
      type: 'image',
      albumId: 2,
      uploadDate: "2024-05-20",
      size: "5.1 MB",
      dimensions: "1920x1080"
    },
    {
      id: 5,
      title: "Nature Documentary Clip",
      url: "https://videos.pexels.com/video-files/857139/857139-hd_1920_1080_30fps.mp4",
      type: 'video',
      albumId: 1,
      uploadDate: "2024-06-20",
      duration: "1:45",
      size: "12.3 MB",
      dimensions: "1920x1080"
    },
  ],
};

export default function GalleryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateAlbumOpen, setIsCreateAlbumOpen] = useState(false);
  const [isUploadMediaOpen, setIsUploadMediaOpen] = useState(false);
  const [isEditAlbumOpen, setIsEditAlbumOpen] = useState(false);
  const [isDeleteAlbumOpen, setIsDeleteAlbumOpen] = useState(false);
  const [isDeleteMediaOpen, setIsDeleteMediaOpen] = useState(false);
  const [isMediaViewerOpen, setIsMediaViewerOpen] = useState(false);
  const [gallery, setGallery] = useState<Gallery>(galleryData);
  const [newAlbum, setNewAlbum] = useState({ name: "", description: "" });
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [albumToDelete, setAlbumToDelete] = useState<Album | null>(null);
  const [mediaToDelete, setMediaToDelete] = useState<MediaItem | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [navigationStack, setNavigationStack] = useState<NavigationState[]>([
    { view: 'albums' }
  ]);
  
  // Video controls state
  const [videoControls, setVideoControls] = useState<VideoControls>({
    isPlaying: false,
    volume: 1,
    isMuted: false,
    isFullscreen: false,
    currentTime: 0,
    duration: 0,
    playbackRate: 1
  });

  const [showVideoControls, setShowVideoControls] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaViewerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Get current navigation state
  const currentState = navigationStack[navigationStack.length - 1];
  const canGoBack = navigationStack.length > 1;

  // Navigation functions
  const navigateTo = (newState: NavigationState) => {
    setNavigationStack(prev => [...prev, newState]);
  };

  const navigateBack = () => {
    if (canGoBack) {
      setNavigationStack(prev => prev.slice(0, -1));
    }
  };

  const navigateToAlbums = () => {
    setNavigationStack([{ view: 'albums' }]);
  };

  const navigateToAlbum = (album: Album) => {
    navigateTo({
      view: 'album-detail',
      albumId: album.id
    });
  };

  const navigateToMedia = (media: MediaItem) => {
    navigateTo({
      view: 'media-detail',
      albumId: media.albumId,
      mediaId: media.id
    });
    setSelectedMedia(media);
    setIsMediaViewerOpen(true);
    
    // Reset video controls when opening new media
    if (media.type === 'video') {
      setVideoControls({
        isPlaying: false,
        volume: 1,
        isMuted: false,
        isFullscreen: false,
        currentTime: 0,
        duration: 0,
        playbackRate: 1
      });
    }
  };

  // Video control functions
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setVideoControls(prev => ({ ...prev, isPlaying: true }));
      } else {
        videoRef.current.pause();
        setVideoControls(prev => ({ ...prev, isPlaying: false }));
      }
    }
  };

  const handleVolumeChange = (volume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      setVideoControls(prev => ({ 
        ...prev, 
        volume,
        isMuted: volume === 0 
      }));
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setVideoControls(prev => ({ 
        ...prev, 
        isMuted: !prev.isMuted 
      }));
    }
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setVideoControls(prev => ({ ...prev, currentTime: time }));
    }
  };

  const toggleFullscreen = () => {
    if (mediaViewerRef.current) {
      if (!document.fullscreenElement) {
        mediaViewerRef.current.requestFullscreen();
        setVideoControls(prev => ({ ...prev, isFullscreen: true }));
      } else {
        document.exitFullscreen();
        setVideoControls(prev => ({ ...prev, isFullscreen: false }));
      }
    }
  };

  const changePlaybackRate = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setVideoControls(prev => ({ ...prev, playbackRate: rate }));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Auto-hide controls for video
  const showControlsTemporarily = () => {
    setShowVideoControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (videoControls.isPlaying) {
        setShowVideoControls(false);
      }
    }, 3000);
  };

  // Video event handlers
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      setVideoControls(prev => ({ 
        ...prev, 
        currentTime,
        duration 
      }));
      setVideoProgress((currentTime / duration) * 100);
    }
  };

  const handleVideoEnd = () => {
    setVideoControls(prev => ({ ...prev, isPlaying: false }));
    setShowVideoControls(true);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  // Get current album and media based on navigation state
  const currentAlbum = currentState.view === 'album-detail' || currentState.view === 'media-detail'
    ? gallery.albums.find(album => album.id === currentState.albumId) || null
    : null;

  const currentAlbumMedia = currentAlbum
    ? gallery.media.filter(media => media.albumId === currentAlbum.id)
    : [];

  const filteredAlbums = gallery.albums.filter(
    (album) =>
      album.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      album.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRandomCoverImage = () => {
    return defaultCoverImages[Math.floor(Math.random() * defaultCoverImages.length)];
  };

  const handleCreateAlbum = () => {
    if (!newAlbum.name.trim()) return;

    const album: Album = {
      id: Math.max(...gallery.albums.map(a => a.id), 0) + 1,
      ...newAlbum,
      coverImage: getRandomCoverImage(),
      itemCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    setGallery({ ...gallery, albums: [...gallery.albums, album] });
    setNewAlbum({ name: "", description: "" });
    setIsCreateAlbumOpen(false);
    navigateToAlbum(album);
  };

  const handleEditAlbum = () => {
    if (!editingAlbum || !editingAlbum.name.trim()) return;

    setGallery({
      ...gallery,
      albums: gallery.albums.map(album => 
        album.id === editingAlbum.id ? editingAlbum : album
      )
    });
    
    setIsEditAlbumOpen(false);
    setEditingAlbum(null);
  };

  const handleDeleteAlbum = () => {
    if (!albumToDelete) return;

    setGallery({
      albums: gallery.albums.filter(album => album.id !== albumToDelete.id),
      media: gallery.media.filter(media => media.albumId !== albumToDelete.id)
    });

    setIsDeleteAlbumOpen(false);
    setAlbumToDelete(null);
    navigateToAlbums();
  };

  const handleDeleteMedia = () => {
    if (!mediaToDelete) return;

    const updatedMedia = gallery.media.filter(media => media.id !== mediaToDelete.id);
    setGallery({ 
      ...gallery, 
      media: updatedMedia,
      albums: gallery.albums.map(album =>
        album.id === mediaToDelete.albumId
          ? { ...album, itemCount: updatedMedia.filter(m => m.albumId === mediaToDelete.albumId).length }
          : album
      )
    });

    setIsDeleteMediaOpen(false);
    setMediaToDelete(null);
    
    // Close media viewer if the deleted media is currently open
    if (selectedMedia?.id === mediaToDelete.id) {
      setIsMediaViewerOpen(false);
    }
  };

  const simulateUploadProgress = (fileName: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[fileName];
            return newProgress;
          });
        }, 500);
      }
      setUploadProgress(prev => ({ ...prev, [fileName]: progress }));
    }, 200);
  };

  const handleUploadFiles = (files: FileList | null) => {
    if (!currentAlbum || !files) return;

    const newMediaItems: MediaItem[] = [];
    
    Array.from(files).forEach((file, index) => {
      const fileType = file.type.startsWith('video/') ? 'video' : 'image';
      const baseId = Math.max(...gallery.media.map(m => m.id), 0);
      
      const newItem: MediaItem = {
        id: baseId + index + 1,
        title: file.name.replace(/\.[^/.]+$/, ""),
        url: URL.createObjectURL(file),
        type: fileType,
        albumId: currentAlbum.id,
        uploadDate: new Date().toISOString().split('T')[0],
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        duration: fileType === 'video' ? '0:30' : undefined,
        dimensions: fileType === 'image' ? '1920x1080' : '1280x720'
      };
      
      newMediaItems.push(newItem);
      simulateUploadProgress(file.name);
    });

    const updatedMedia = [...gallery.media, ...newMediaItems];
    setGallery({ 
      ...gallery, 
      media: updatedMedia,
      albums: gallery.albums.map(album =>
        album.id === currentAlbum.id
          ? { ...album, itemCount: updatedMedia.filter(m => m.albumId === currentAlbum.id).length }
          : album
      )
    });
    
    setIsUploadMediaOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openEditAlbum = (album: Album) => {
    setEditingAlbum({ ...album });
    setIsEditAlbumOpen(true);
  };

  const openDeleteAlbum = (album: Album) => {
    setAlbumToDelete(album);
    setIsDeleteAlbumOpen(true);
  };

  const openDeleteMedia = (media: MediaItem) => {
    setMediaToDelete(media);
    setIsDeleteMediaOpen(true);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const downloadMedia = (media: MediaItem) => {
    const link = document.createElement('a');
    link.href = media.url;
    link.download = media.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareMedia = async (media: MediaItem) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: media.title,
          text: `Check out this ${media.type} from my gallery`,
          url: media.url,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(media.url);
      alert('Media URL copied to clipboard!');
    }
  };

  // Render based on current navigation state
  const renderContent = () => {
    switch (currentState.view) {
      case 'albums':
        return renderAlbumsView();
      case 'album-detail':
        return renderAlbumDetailView();
      default:
        return renderAlbumsView();
    }
  };

  const renderAlbumsView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAlbums.map((album) => (
          <Card 
            key={album.id} 
            className="group cursor-pointer bg-white/80 backdrop-blur-sm border-2 border-gray-100/50 hover:border-blue-200/50 hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden"
            onClick={() => navigateToAlbum(album)}
          >
            <div className="aspect-square relative overflow-hidden">
              <img
                src={album.coverImage}
                alt={album.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="sm" className="rounded-full w-8 h-8 bg-white/90 backdrop-blur-sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openEditAlbum(album); }}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => { e.stopPropagation(); openDeleteAlbum(album); }}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 mb-2">
                  {album.itemCount} items
                </Badge>
                <CardTitle className="text-lg font-semibold line-clamp-1">{album.name}</CardTitle>
                <CardDescription className="text-white/80 line-clamp-2 text-sm">
                  {album.description}
                </CardDescription>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredAlbums.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <FolderPlus className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No albums found</h3>
          <p className="text-gray-500 mb-6">Create your first album to get started</p>
          <Button 
            onClick={() => setIsCreateAlbumOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full"
          >
            Create Album
          </Button>
        </div>
      )}
    </div>
  );

  const renderAlbumDetailView = () => (
    <div className="space-y-6">
      {/* Album Header */}
      <Card className="bg-white/80 backdrop-blur-sm border-2 border-gray-100/50 rounded-3xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <Button 
                  variant="ghost" 
                  onClick={navigateBack}
                  className="rounded-full w-10 h-10 p-0 hover:bg-gray-100"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 truncate">
                    {currentAlbum?.name}
                  </h2>
                  <p className="text-gray-600 mt-1">{currentAlbum?.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{currentAlbum?.itemCount} items</span>
                <span>•</span>
                <span>Created {currentAlbum?.createdAt}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                onClick={() => currentAlbum && openEditAlbum(currentAlbum)}
                className="rounded-full border-gray-300"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button 
                onClick={() => setIsUploadMediaOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Media
              </Button>
              <Button 
                variant="destructive"
                onClick={() => currentAlbum && openDeleteAlbum(currentAlbum)}
                className="rounded-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Mode Toggle */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Media ({currentAlbumMedia.length})
        </h3>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="rounded-lg"
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="rounded-lg"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Media Grid/List */}
      {currentAlbumMedia.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {currentAlbumMedia.map((media) => (
              <Card 
                key={media.id} 
                className="group bg-white/80 backdrop-blur-sm border-2 border-gray-100/50 hover:border-blue-200/50 hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => navigateToMedia(media)}
              >
                <div className="aspect-square relative overflow-hidden">
                  {media.type === 'image' ? (
                    <img
                      src={media.url}
                      alt={media.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <>
                      <video
                        src={media.url}
                        className="w-full h-full object-cover"
                        muted
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-black/50 rounded-full p-3 backdrop-blur-sm">
                          <Play className="w-6 h-6 text-white fill-white" />
                        </div>
                      </div>
                    </>
                  )}
                  
                  <div className="absolute top-2 left-2">
                    <Badge className={`${
                      media.type === 'image' 
                        ? 'bg-blue-500/90 text-white' 
                        : 'bg-purple-500/90 text-white'
                    } backdrop-blur-sm border-0`}>
                      {media.type === 'image' ? <ImageIcon className="w-3 h-3 mr-1" /> : <VideoIcon className="w-3 h-3 mr-1" />}
                      {media.type}
                    </Badge>
                  </div>

                  {media.type === 'video' && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="bg-black/50 text-white border-0 backdrop-blur-sm">
                        <Clock className="w-3 h-3 mr-1" />
                        {media.duration}
                      </Badge>
                    </div>
                  )}

                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full w-8 h-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteMedia(media);
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="text-white">
                      <p className="font-semibold text-sm line-clamp-1">{media.title}</p>
                      <div className="flex items-center gap-2 text-xs text-white/80 mt-1">
                        <span>{media.uploadDate}</span>
                        {media.size && (
                          <>
                            <span>•</span>
                            <span>{media.size}</span>
                          </>
                        )}
                        {media.duration && (
                          <>
                            <span>•</span>
                            <span>{media.duration}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {currentAlbumMedia.map((media) => (
              <Card 
                key={media.id}
                className="group bg-white/80 backdrop-blur-sm border-2 border-gray-100/50 hover:border-blue-200/50 hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => navigateToMedia(media)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 relative">
                      {media.type === 'image' ? (
                        <img
                          src={media.url}
                          alt={media.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <>
                          <video
                            src={media.url}
                            className="w-full h-full object-cover"
                            muted
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <Play className="w-4 h-4 text-white fill-white" />
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900 truncate">{media.title}</p>
                        <Badge variant="outline" className="text-xs">
                          {media.type}
                        </Badge>
                        {media.type === 'video' && (
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {media.duration}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span>{media.uploadDate}</span>
                        {media.size && <span>• {media.size}</span>}
                        {media.dimensions && <span>• {media.dimensions}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadMedia(media);
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteMedia(media);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      ) : (
        <Card className="bg-white/80 backdrop-blur-sm border-2 border-gray-100/50 rounded-3xl text-center py-16">
          <CardContent>
            <div className="w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <Upload className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No media yet</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              Start by uploading photos and videos to your album
            </p>
            <Button 
              onClick={() => setIsUploadMediaOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full shadow-lg"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Media
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              {/* {canGoBack && (
                <Button 
                  variant="ghost" 
                  onClick={navigateBack}
                  className="rounded-full w-10 h-10 p-0 hover:bg-gray-100"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              )} */}
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {currentState.view === 'albums' ? 'Gallery' : currentAlbum?.name}
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              {currentState.view === 'albums' 
                ? 'Organize your memories and media collections' 
                : currentAlbum?.description}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {currentState.view === 'album-detail' && (
              <Button 
                onClick={() => setIsUploadMediaOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Media
              </Button>
            )}
            {currentState.view === 'albums' && (
              <Button 
                onClick={() => setIsCreateAlbumOpen(true)}
                className="bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <FolderPlus className="w-4 h-4 mr-2" />
                New Album
              </Button>
            )}
          </div>
        </div>

        {/* Search Bar - Only show in albums view */}
        {currentState.view === 'albums' && (
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search albums..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-0 bg-white/80 backdrop-blur-sm"
            />
          </div>
        )}

        {/* Main Content */}
        {renderContent()}

        {/* Media Viewer Dialog */}
        <Dialog open={isMediaViewerOpen} onOpenChange={setIsMediaViewerOpen}>
          <DialogContent className="max-w-7xl rounded-2xl p-0 overflow-hidden bg-black">
            <div 
              ref={mediaViewerRef}
              className="relative w-full h-[80vh] bg-black flex items-center justify-center"
              onMouseMove={showControlsTemporarily}
              onMouseLeave={() => {
                if (videoControls.isPlaying) {
                  setShowVideoControls(false);
                }
              }}
            >
              {selectedMedia?.type === 'image' ? (
                <>
                  <img
                    src={selectedMedia.url}
                    alt={selectedMedia.title}
                    className="max-w-full max-h-full object-contain"
                  />
                  {/* Image Controls */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => selectedMedia && downloadMedia(selectedMedia)}
                      className="bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => selectedMedia && shareMedia(selectedMedia)}
                      className="bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm"
                    >
                      <Share className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsMediaViewerOpen(false)}
                      className="bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* Video Player */}
                  <video
                    ref={videoRef}
                    src={selectedMedia?.url}
                    className="w-full h-full object-contain cursor-pointer"
                    onClick={togglePlayPause}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={handleVideoEnd}
                    onLoadedMetadata={() => {
                      if (videoRef.current) {
                        setVideoControls(prev => ({
                          ...prev,
                          duration: videoRef.current?.duration || 0
                        }));
                      }
                    }}
                  />
                  
                  {/* Video Overlay Controls */}
                  <div 
                    className={`absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent transition-opacity duration-300 ${
                      showVideoControls ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    {/* Top Bar */}
                    <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsMediaViewerOpen(false)}
                          className="text-white hover:bg-white/20 rounded-full"
                        >
                          <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div className="text-white">
                          <h3 className="font-semibold">{selectedMedia?.title}</h3>
                          <p className="text-sm text-gray-300">
                            {formatTime(videoControls.currentTime)} / {formatTime(videoControls.duration)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-white hover:bg-white/20 rounded-full"
                            >
                              {videoControls.playbackRate}x
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                              <DropdownMenuItem
                                key={rate}
                                onClick={() => changePlaybackRate(rate)}
                                className={videoControls.playbackRate === rate ? 'bg-blue-50' : ''}
                              >
                                {rate}x
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => selectedMedia && downloadMedia(selectedMedia)}
                          className="text-white hover:bg-white/20 rounded-full"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => selectedMedia && shareMedia(selectedMedia)}
                          className="text-white hover:bg-white/20 rounded-full"
                        >
                          <Share className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={toggleFullscreen}
                          className="text-white hover:bg-white/20 rounded-full"
                        >
                          {videoControls.isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>

                    {/* Center Play Button */}
                    {!videoControls.isPlaying && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button
                          onClick={togglePlayPause}
                          className="bg-black/50 hover:bg-black/70 text-white rounded-full w-16 h-16 backdrop-blur-sm"
                        >
                          <Play className="w-8 h-8 fill-white" />
                        </Button>
                      </div>
                    )}

                    {/* Bottom Controls */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
                      {/* Progress Bar */}
                      <div 
                        className="w-full bg-white/30 rounded-full h-1 cursor-pointer"
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const percent = (e.clientX - rect.left) / rect.width;
                          const newTime = percent * videoControls.duration;
                          handleSeek(newTime);
                        }}
                      >
                        <div 
                          className="bg-blue-500 h-1 rounded-full relative transition-all duration-100"
                          style={{ width: `${videoProgress}%` }}
                        >
                          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full shadow-lg opacity-0 hover:opacity-100 transition-opacity" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {/* Play/Pause */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={togglePlayPause}
                            className="text-white hover:bg-white/20 rounded-full"
                          >
                            {videoControls.isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
                          </Button>

                          {/* Volume Control */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={toggleMute}
                              className="text-white hover:bg-white/20 rounded-full"
                            >
                              {videoControls.isMuted || videoControls.volume === 0 ? (
                                <VolumeX className="w-4 h-4" />
                              ) : (
                                <Volume2 className="w-4 h-4" />
                              )}
                            </Button>
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={videoControls.volume}
                              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                              className="w-20 accent-white"
                            />
                          </div>

                          {/* Time Display */}
                          <span className="text-white text-sm font-mono">
                            {formatTime(videoControls.currentTime)} / {formatTime(videoControls.duration)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-white text-sm">
                          <FileText className="w-4 h-4" />
                          <span>{selectedMedia?.dimensions}</span>
                          <span>•</span>
                          <span>{selectedMedia?.size}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Other Dialogs (Create Album, Edit Album, Upload Media, Delete Confirmations) */}
        {/* Create Album Dialog */}
        <Dialog open={isCreateAlbumOpen} onOpenChange={setIsCreateAlbumOpen}>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl">Create New Album</DialogTitle>
              <DialogDescription>
                Create a new album to organize your photos and videos
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="album-name" className="text-sm font-medium">Album Name</Label>
                <Input
                  id="album-name"
                  placeholder="Enter album name"
                  value={newAlbum.name}
                  onChange={(e) => setNewAlbum({ ...newAlbum, name: e.target.value })}
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="album-description" className="text-sm font-medium">Description (Optional)</Label>
                <Input
                  id="album-description"
                  placeholder="Add a description"
                  value={newAlbum.description}
                  onChange={(e) => setNewAlbum({ ...newAlbum, description: e.target.value })}
                  className="rounded-lg"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsCreateAlbumOpen(false)}
                className="rounded-lg"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateAlbum} 
                disabled={!newAlbum.name.trim()}
                className="rounded-lg bg-blue-600 hover:bg-blue-700"
              >
                Create Album
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Album Dialog */}
        <Dialog open={isEditAlbumOpen} onOpenChange={setIsEditAlbumOpen}>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl">Edit Album</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-album-name" className="text-sm font-medium">Album Name</Label>
                <Input
                  id="edit-album-name"
                  value={editingAlbum?.name || ""}
                  onChange={(e) => setEditingAlbum(prev => prev ? { ...prev, name: e.target.value } : null)}
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-album-description" className="text-sm font-medium">Description</Label>
                <Input
                  id="edit-album-description"
                  value={editingAlbum?.description || ""}
                  onChange={(e) => setEditingAlbum(prev => prev ? { ...prev, description: e.target.value } : null)}
                  className="rounded-lg"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsEditAlbumOpen(false)}
                className="rounded-lg"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleEditAlbum} 
                disabled={!editingAlbum?.name.trim()}
                className="rounded-lg bg-blue-600 hover:bg-blue-700"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Upload Media Dialog */}
        <Dialog open={isUploadMediaOpen} onOpenChange={setIsUploadMediaOpen}>
          <DialogContent className="sm:max-w-lg rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl">Add Media to Album</DialogTitle>
              <DialogDescription>
                Upload photos and videos to "{currentAlbum?.name}"
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div 
                className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors duration-200 cursor-pointer bg-gray-50/50"
                onClick={triggerFileInput}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">Drop files here or click to upload</p>
                <p className="text-sm text-gray-500">Supports images and videos</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={(e) => handleUploadFiles(e.target.files)}
                  className="hidden"
                />
              </div>

              {/* Upload Progress */}
              {Object.keys(uploadProgress).length > 0 && (
                <div className="space-y-2">
                  {Object.entries(uploadProgress).map(([fileName, progress]) => (
                    <div key={fileName} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700 truncate">{fileName}</span>
                        <span className="text-gray-500">{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsUploadMediaOpen(false)}
                className="rounded-lg"
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Album Confirmation */}
        <Dialog open={isDeleteAlbumOpen} onOpenChange={setIsDeleteAlbumOpen}>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl">Delete Album</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{albumToDelete?.name}"? This will also remove all {albumToDelete?.itemCount} items in this album.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsDeleteAlbumOpen(false)}
                className="rounded-lg"
              >
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={handleDeleteAlbum}
                className="rounded-lg"
              >
                Delete Album
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Media Confirmation */}
        <Dialog open={isDeleteMediaOpen} onOpenChange={setIsDeleteMediaOpen}>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl">
                Delete {mediaToDelete?.type === 'image' ? 'Photo' : 'Video'}
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{mediaToDelete?.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsDeleteMediaOpen(false)}
                className="rounded-lg"
              >
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={handleDeleteMedia}
                className="rounded-lg"
              >
                Delete {mediaToDelete?.type === 'image' ? 'Photo' : 'Video'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}