"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  FileText,
  AlertCircle,
  CheckCircle,
  Languages,
  Eye
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

// Types
type Language = 'en' | 'ta' | 'si';
type MediaType = 'image' | 'video';
type ViewMode = 'grid' | 'list';

interface LocalizedText {
  en: string;
  ta: string;
  si: string;
}

interface Album {
  id: number;
  name: LocalizedText;
  description: LocalizedText;
  coverImage: string;
  itemCount: number;
  createdAt: string;
}

interface MediaItem {
  id: number;
  title: LocalizedText;
  url: string;
  type: MediaType;
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

interface AlbumFormData {
  name: LocalizedText;
  description: LocalizedText;
}

interface MediaFormData {
  title: LocalizedText;
  description: LocalizedText;
}

interface MessageState {
  type: 'error' | 'success';
  title: string;
  message: string;
}

// Constants
const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'ta', label: 'Tamil' },
  { value: 'si', label: 'Sinhala' }
];

const DEFAULT_COVER_IMAGES = [
  "https://images.unsplash.com/photo-1542736667-069246bdbc6d?w=300&h=200&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop",
  "https://images.unsplash.com/photo-1554629947-334ff61d85dc?w=300&h=200&fit=crop",
  "https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=300&h=200&fit=crop"
];

const INITIAL_GALLERY_DATA: Gallery = {
  albums: [
    {
      id: 1,
      name: {
        en: "Summer Vacation 2024",
        ta: "கோடை விடுமுறை 2024",
        si: "2024 ගිම්හාන නිවාඩු"
      },
      description: {
        en: "Beautiful memories from our summer trip",
        ta: "எங்கள் கோடை பயணத்திலிருந்து அழகான நினைவுகள்",
        si: "අපගේ ගිම්හාන චාරිකාවෙන් ලස්සන මතකයන්"
      },
      coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=200&fit=crop",
      itemCount: 3,
      createdAt: "2024-06-15",
    },
    {
      id: 2,
      name: {
        en: "Family Events",
        ta: "குடும்ப நிகழ்வுகள்",
        si: "පවුල් ඉසව්"
      },
      description: {
        en: "All our family gatherings and celebrations",
        ta: "எங்கள் குடும்பக் கூட்டங்கள் மற்றும் கொண்டாட்டங்கள் அனைத்தும்",
        si: "අපගේ පවුල් රැස්වීම් සහ උත්සව සියල්ල"
      },
      coverImage: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=300&h=200&fit=crop",
      itemCount: 2,
      createdAt: "2024-05-20",
    }
  ],
  media: [
    {
      id: 1,
      title: {
        en: "Beach Sunset",
        ta: "கடற்கரை சூரிய அஸ்தமனம்",
        si: "වෙරළ සූර්යාස්තමයන්"
      },
      url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop",
      type: 'image',
      albumId: 1,
      uploadDate: "2024-06-15",
      size: "4.2 MB",
      dimensions: "1920x1080"
    },
    {
      id: 2,
      title: {
        en: "Mountain Hike",
        ta: "மலை ஹைக்கிங்",
        si: "පර්වත ගමන්"
      },
      url: "https://images.unsplash.com/photo-1464822759844-b28c9536c9b4?w=800&h=600&fit=crop",
      type: 'image',
      albumId: 1,
      uploadDate: "2024-06-16",
      size: "3.8 MB",
      dimensions: "1920x1080"
    },
    {
      id: 3,
      title: {
        en: "Forest Adventure",
        ta: "காட்டு சாகசம்",
        si: "වන සාරය"
      },
      url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
      type: 'image',
      albumId: 1,
      uploadDate: "2024-06-17",
      size: "5.1 MB",
      dimensions: "1920x1080"
    },
    {
      id: 4,
      title: {
        en: "Birthday Celebration",
        ta: "பிறந்தநாள் கொண்டாட்டம்",
        si: "උපන්දින උත්සවය"
      },
      url: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800&h=600&fit=crop",
      type: 'image',
      albumId: 2,
      uploadDate: "2024-05-20",
      size: "4.5 MB",
      dimensions: "1920x1080"
    },
    {
      id: 5,
      title: {
        en: "Family Gathering",
        ta: "குடும்ப கூட்டம்",
        si: "පවුල් රැස්වීම"
      },
      url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=600&fit=crop",
      type: 'image',
      albumId: 2,
      uploadDate: "2024-05-21",
      size: "4.8 MB",
      dimensions: "1920x1080"
    }
  ],
};

// Custom Hooks
const useGallery = () => {
  const [gallery, setGallery] = useState<Gallery>(INITIAL_GALLERY_DATA);
  
  const addAlbum = useCallback((album: Omit<Album, 'id' | 'coverImage' | 'itemCount' | 'createdAt'>) => {
    const newAlbum: Album = {
      ...album,
      id: Math.max(0, ...gallery.albums.map(a => a.id)) + 1,
      coverImage: DEFAULT_COVER_IMAGES[Math.floor(Math.random() * DEFAULT_COVER_IMAGES.length)],
      itemCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setGallery(prev => ({ ...prev, albums: [...prev.albums, newAlbum] }));
    return newAlbum;
  }, [gallery.albums]);

  const updateAlbum = useCallback((id: number, updates: Partial<Album>) => {
    setGallery(prev => ({
      ...prev,
      albums: prev.albums.map(album => 
        album.id === id ? { ...album, ...updates } : album
      )
    }));
  }, []);

  const deleteAlbum = useCallback((id: number) => {
    setGallery(prev => ({
      albums: prev.albums.filter(album => album.id !== id),
      media: prev.media.filter(media => media.albumId !== id)
    }));
  }, []);

  const addMedia = useCallback((mediaItems: Omit<MediaItem, 'id'>[]) => {
    const baseId = Math.max(0, ...gallery.media.map(m => m.id));
    const newMediaItems: MediaItem[] = mediaItems.map((item, index) => ({
      ...item,
      id: baseId + index + 1
    }));

    setGallery(prev => {
      const updatedMedia = [...prev.media, ...newMediaItems];
      const albumItemCounts = updatedMedia.reduce((acc, media) => {
        acc[media.albumId] = (acc[media.albumId] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

      return {
        ...prev,
        media: updatedMedia,
        albums: prev.albums.map(album => ({
          ...album,
          itemCount: albumItemCounts[album.id] || 0
        }))
      };
    });

    return newMediaItems;
  }, [gallery.media]);

  const updateMedia = useCallback((id: number, updates: Partial<MediaItem>) => {
    setGallery(prev => ({
      ...prev,
      media: prev.media.map(media => 
        media.id === id ? { ...media, ...updates } : media
      )
    }));
  }, []);

  const deleteMedia = useCallback((id: number) => {
    setGallery(prev => {
      const mediaToDelete = prev.media.find(media => media.id === id);
      const updatedMedia = prev.media.filter(media => media.id !== id);
      
      return {
        ...prev,
        media: updatedMedia,
        albums: prev.albums.map(album => ({
          ...album,
          itemCount: updatedMedia.filter(m => m.albumId === album.id).length
        }))
      };
    });
  }, []);

  return { gallery, addAlbum, updateAlbum, deleteAlbum, addMedia, updateMedia, deleteMedia };
};

const useAlbumForm = (initialState: AlbumFormData) => {
  const [form, setForm] = useState<AlbumFormData>(initialState);

  const updateField = useCallback((
    field: 'name' | 'description',
    language: Language,
    value: string
  ) => {
    setForm(prev => ({
      ...prev,
      [field]: { ...prev[field], [language]: value }
    }));
  }, []);

  const setFormData = useCallback((data: AlbumFormData) => {
    setForm(data);
  }, []);

  const reset = useCallback(() => setForm(initialState), [initialState]);

  return { form, updateField, setFormData, reset };
};

const useMediaForm = (initialState: MediaFormData) => {
  const [form, setForm] = useState<MediaFormData>(initialState);

  const updateField = useCallback((
    field: 'title' | 'description',
    language: Language,
    value: string
  ) => {
    setForm(prev => ({
      ...prev,
      [field]: { ...prev[field], [language]: value }
    }));
  }, []);

  const setFormData = useCallback((data: MediaFormData) => {
    setForm(data);
  }, []);

  const reset = useCallback(() => setForm(initialState), [initialState]);

  return { form, updateField, setFormData, reset };
};

// Utility Functions
const getLanguageLabel = (lang: Language): string => {
  return LANGUAGES.find(l => l.value === lang)?.label || lang;
};

const getRandomCoverImage = (): string => {
  return DEFAULT_COVER_IMAGES[Math.floor(Math.random() * DEFAULT_COVER_IMAGES.length)];
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const validateForm = (form: AlbumFormData | MediaFormData, type: 'album' | 'media'): string | null => {
  const missingFields: string[] = [];

  LANGUAGES.forEach(({ value, label }) => {
    if (type === 'album') {
      if (!(form as AlbumFormData).name?.[value]?.trim()) {
        missingFields.push(`${label} name`);
      }
      if (!(form as AlbumFormData).description?.[value]?.trim()) {
        missingFields.push(`${label} description`);
      }
    } else {
      if (!(form as MediaFormData).title?.[value]?.trim()) {
        missingFields.push(`${label} title`);
      }
      if (!(form as MediaFormData).description?.[value]?.trim()) {
        missingFields.push(`${label} description`);
      }
    }
  });

  if (missingFields.length > 0) {
    return `Please fill in: ${missingFields.join(', ')}`;
  }

  return null;
};

const getFileType = (file: File): MediaType => {
  return file.type.startsWith('video/') ? 'video' : 'image';
};

const formatFileSize = (bytes: number): string => {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
};

// Components
const LanguageTabs: React.FC<{
  value: Language;
  onChange: (value: Language) => void;
}> = ({ value, onChange }) => (
  <Tabs value={value} onValueChange={(val) => onChange(val as Language)}>
    <TabsList className="grid w-full grid-cols-3">
      {LANGUAGES.map(lang => (
        <TabsTrigger key={lang.value} value={lang.value}>
          {lang.label}
        </TabsTrigger>
      ))}
    </TabsList>
  </Tabs>
);

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

const StatsCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}> = ({ icon, label, value, color }) => (
  <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
    <CardContent className="p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const AlbumCard: React.FC<{
  album: Album;
  currentLanguage: Language;
  onView: (album: Album) => void;
  onEdit: (album: Album) => void;
  onDelete: (album: Album) => void;
}> = ({ album, currentLanguage, onView, onEdit, onDelete }) => (
  <Card 
    key={album.id} 
    className="group cursor-pointer bg-white/80 backdrop-blur-sm border-2 border-gray-100/50 hover:border-blue-200/50 hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden"
    onClick={() => onView(album)}
  >
    <div className="aspect-square relative overflow-hidden">
      <img
        src={album.coverImage}
        alt={album.name[currentLanguage]}
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
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(album); }}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e) => { e.stopPropagation(); onDelete(album); }}
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
        <CardTitle className="text-lg font-semibold line-clamp-1">
          {album.name[currentLanguage]}
        </CardTitle>
        <CardDescription className="text-white/80 line-clamp-2 text-sm">
          {album.description[currentLanguage]}
        </CardDescription>
      </div>
    </div>
  </Card>
);

const MediaCard: React.FC<{
  media: MediaItem;
  currentLanguage: Language;
  viewMode: ViewMode;
  onView: (media: MediaItem) => void;
  onEdit: (media: MediaItem) => void;
  onDelete: (media: MediaItem) => void;
  onDownload: (media: MediaItem) => void;
}> = ({ media, currentLanguage, viewMode, onView, onEdit, onDelete, onDownload }) => {
  if (viewMode === 'grid') {
    return (
      <Card 
        className="group bg-white/80 backdrop-blur-sm border-2 border-gray-100/50 hover:border-blue-200/50 hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden cursor-pointer"
        onClick={() => onView(media)}
      >
        <div className="aspect-square relative overflow-hidden">
          <img
            src={media.url}
            alt={media.title[currentLanguage]}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          <div className="absolute top-2 left-2">
            <Badge className="bg-blue-500/90 text-white backdrop-blur-sm border-0">
              <ImageIcon className="w-3 h-3 mr-1" />
              {media.type}
            </Badge>
          </div>

          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-1">
            <Button
              size="sm"
              variant="secondary"
              className="rounded-full w-8 h-8 p-0 bg-white/90 backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation();
                onDownload(media);
              }}
            >
              <Download className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="rounded-full w-8 h-8 p-0 bg-white/90 backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(media);
              }}
            >
              <Edit className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="rounded-full w-8 h-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(media);
              }}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <div className="text-white">
              <p className="font-semibold text-sm line-clamp-1">{media.title[currentLanguage]}</p>
              <div className="flex items-center gap-2 text-xs text-white/80 mt-1">
                <span>{media.uploadDate}</span>
                <span>•</span>
                <span>{media.size}</span>
                <span>•</span>
                <span>{media.dimensions}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className="group bg-white/80 backdrop-blur-sm border-2 border-gray-100/50 hover:border-blue-200/50 hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden cursor-pointer"
      onClick={() => onView(media)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={media.url}
              alt={media.title[currentLanguage]}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold text-gray-900 truncate">{media.title[currentLanguage]}</p>
              <Badge variant="outline" className="text-xs">
                {media.type}
              </Badge>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span>{media.uploadDate}</span>
              <span>•</span>
              <span>{media.size}</span>
              <span>•</span>
              <span>{media.dimensions}</span>
            </div>
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onDownload(media);
              }}
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(media);
              }}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(media);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Component
export default function GalleryPage() {
  // State Management
  const { gallery, addAlbum, updateAlbum, deleteAlbum, addMedia, updateMedia, deleteMedia } = useGallery();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [message, setMessage] = useState<MessageState | null>(null);
  
  // Unified Dialog State
  const [dialogState, setDialogState] = useState({
    createAlbum: false,
    editAlbum: false,
    uploadMedia: false,
    editMedia: false,
    deleteAlbum: false,
    deleteMedia: false,
    mediaViewer: false
  });

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
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaViewerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Navigation state
  const [navigationStack, setNavigationStack] = useState<NavigationState[]>([
    { view: 'albums' }
  ]);
  const currentState = navigationStack[navigationStack.length - 1];
  const canGoBack = navigationStack.length > 1;

  // Form states
  const albumForm = useAlbumForm({
    name: { en: '', ta: '', si: '' },
    description: { en: '', ta: '', si: '' }
  });

  const mediaForm = useMediaForm({
    title: { en: '', ta: '', si: '' },
    description: { en: '', ta: '', si: '' }
  });

  // Selected items state
  const [selectedItems, setSelectedItems] = useState<{
    album: Album | null;
    media: MediaItem | null;
  }>({
    album: null,
    media: null
  });

  // Computed values
  const currentAlbum = currentState.view === 'album-detail' || currentState.view === 'media-detail'
    ? gallery.albums.find(album => album.id === currentState.albumId) || null
    : null;

  const currentAlbumMedia = currentAlbum
    ? gallery.media.filter(media => media.albumId === currentAlbum.id)
    : [];

  const filteredAlbums = useMemo(() => {
    return gallery.albums.filter(album =>
      Object.values(album.name).some(name =>
        name.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      Object.values(album.description).some(desc =>
        desc.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [gallery.albums, searchTerm]);

  const stats = useMemo(() => ({
    totalAlbums: gallery.albums.length,
    totalMedia: gallery.media.length,
    totalImages: gallery.media.filter(m => m.type === 'image').length,
    totalVideos: gallery.media.filter(m => m.type === 'video').length
  }), [gallery]);

  // Navigation functions
  const navigateTo = useCallback((newState: NavigationState) => {
    setNavigationStack(prev => [...prev, newState]);
  }, []);

  const navigateBack = useCallback(() => {
    if (canGoBack) {
      setNavigationStack(prev => prev.slice(0, -1));
    }
  }, [canGoBack]);

  const navigateToAlbums = useCallback(() => {
    setNavigationStack([{ view: 'albums' }]);
  }, []);

  const navigateToAlbum = useCallback((album: Album) => {
    navigateTo({
      view: 'album-detail',
      albumId: album.id
    });
  }, [navigateTo]);

  const navigateToMedia = useCallback((media: MediaItem) => {
    navigateTo({
      view: 'media-detail',
      albumId: media.albumId,
      mediaId: media.id
    });
    setSelectedMedia(media);
    setDialogState(prev => ({ ...prev, mediaViewer: true }));
  }, [navigateTo]);

  // Dialog management
  const openDialog = useCallback((dialog: keyof typeof dialogState, item?: Album | MediaItem) => {
    if (item) {
      if ('type' in item) {
        setSelectedItems(prev => ({ ...prev, media: item }));
        if (dialog === 'editMedia') {
          mediaForm.setFormData({
            title: item.title,
            description: { en: '', ta: '', si: '' } // Add description field if needed
          });
        }
      } else {
        setSelectedItems(prev => ({ ...prev, album: item }));
        if (dialog === 'editAlbum') {
          albumForm.setFormData({
            name: item.name,
            description: item.description
          });
        }
      }
    }
    setDialogState(prev => ({ ...prev, [dialog]: true }));
    setMessage(null);
  }, [albumForm, mediaForm]);

  const closeDialog = useCallback((dialog: keyof typeof dialogState) => {
    setDialogState(prev => ({ ...prev, [dialog]: false }));
    setMessage(null);
    albumForm.reset();
    mediaForm.reset();
    setSelectedItems({ album: null, media: null });
  }, [albumForm, mediaForm]);

  // Album operations
  const handleCreateAlbum = useCallback(() => {
    const error = validateForm(albumForm.form, 'album');
    if (error) {
      setMessage({ type: 'error', title: 'Validation Error', message: error });
      return;
    }

    const newAlbum = addAlbum(albumForm.form);
    albumForm.reset();
    setMessage({ type: 'success', title: 'Success!', message: 'Album created successfully!' });
    
    setTimeout(() => {
      setMessage(null);
      closeDialog('createAlbum');
      navigateToAlbum(newAlbum);
    }, 2000);
  }, [addAlbum, albumForm, closeDialog, navigateToAlbum]);

  const handleEditAlbum = useCallback(() => {
    if (!selectedItems.album) return;

    const error = validateForm(albumForm.form, 'album');
    if (error) {
      setMessage({ type: 'error', title: 'Validation Error', message: error });
      return;
    }

    updateAlbum(selectedItems.album.id, albumForm.form);
    setMessage({ type: 'success', title: 'Success!', message: 'Album updated successfully!' });
    
    setTimeout(() => {
      setMessage(null);
      closeDialog('editAlbum');
    }, 2000);
  }, [selectedItems.album, albumForm.form, updateAlbum, closeDialog]);

  const handleDeleteAlbum = useCallback(() => {
    if (!selectedItems.album) return;
    deleteAlbum(selectedItems.album.id);
    closeDialog('deleteAlbum');
    navigateToAlbums();
  }, [selectedItems.album, deleteAlbum, closeDialog, navigateToAlbums]);

  // Media operations
  const handleEditMedia = useCallback(() => {
    if (!selectedItems.media) return;

    const error = validateForm(mediaForm.form, 'media');
    if (error) {
      setMessage({ type: 'error', title: 'Validation Error', message: error });
      return;
    }

    updateMedia(selectedItems.media.id, {
      title: mediaForm.form.title
    });
    setMessage({ type: 'success', title: 'Success!', message: 'Media updated successfully!' });
    
    setTimeout(() => {
      setMessage(null);
      closeDialog('editMedia');
    }, 2000);
  }, [selectedItems.media, mediaForm.form, updateMedia, closeDialog]);

  const handleDeleteMedia = useCallback(() => {
    if (!selectedItems.media) return;
    deleteMedia(selectedItems.media.id);
    closeDialog('deleteMedia');
    
    // Close media viewer if the deleted media is currently open
    if (selectedMedia?.id === selectedItems.media.id) {
      setDialogState(prev => ({ ...prev, mediaViewer: false }));
    }
  }, [selectedItems.media, selectedMedia, deleteMedia, closeDialog]);

  // Upload operations
  const simulateUploadProgress = useCallback((fileName: string) => {
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
  }, []);

  const handleUploadFiles = useCallback((files: FileList | null) => {
    if (!currentAlbum || !files) return;

    const newMediaItems: Omit<MediaItem, 'id'>[] = [];
    
    Array.from(files).forEach((file) => {
      const fileType = getFileType(file);
      const fileName = file.name.replace(/\.[^/.]+$/, "");
      
      const newItem: Omit<MediaItem, 'id'> = {
        title: {
          en: fileName,
          ta: fileName,
          si: fileName
        },
        url: URL.createObjectURL(file),
        type: fileType,
        albumId: currentAlbum.id,
        uploadDate: new Date().toISOString().split('T')[0],
        size: formatFileSize(file.size),
        dimensions: fileType === 'image' ? '1920x1080' : '1280x720'
      };
      
      newMediaItems.push(newItem);
      simulateUploadProgress(file.name);
    });

    addMedia(newMediaItems);
    closeDialog('uploadMedia');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [currentAlbum, simulateUploadProgress, addMedia, closeDialog]);

  // Video control functions
  const togglePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setVideoControls(prev => ({ ...prev, isPlaying: true }));
      } else {
        videoRef.current.pause();
        setVideoControls(prev => ({ ...prev, isPlaying: false }));
      }
    }
  }, []);

  const handleVolumeChange = useCallback((volume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      setVideoControls(prev => ({ 
        ...prev, 
        volume,
        isMuted: volume === 0 
      }));
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setVideoControls(prev => ({ 
        ...prev, 
        isMuted: !prev.isMuted 
      }));
    }
  }, []);

  const handleSeek = useCallback((time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setVideoControls(prev => ({ ...prev, currentTime: time }));
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (mediaViewerRef.current) {
      if (!document.fullscreenElement) {
        mediaViewerRef.current.requestFullscreen();
        setVideoControls(prev => ({ ...prev, isFullscreen: true }));
      } else {
        document.exitFullscreen();
        setVideoControls(prev => ({ ...prev, isFullscreen: false }));
      }
    }
  }, []);

  const changePlaybackRate = useCallback((rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setVideoControls(prev => ({ ...prev, playbackRate: rate }));
    }
  }, []);

  // Auto-hide controls for video
  const showControlsTemporarily = useCallback(() => {
    setShowVideoControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (videoControls.isPlaying) {
        setShowVideoControls(false);
      }
    }, 3000);
  }, [videoControls.isPlaying]);

  // Video event handlers
  const handleTimeUpdate = useCallback(() => {
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
  }, []);

  const handleVideoEnd = useCallback(() => {
    setVideoControls(prev => ({ ...prev, isPlaying: false }));
    setShowVideoControls(true);
  }, []);

  // Utility functions
  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const downloadMedia = useCallback((media: MediaItem) => {
    const link = document.createElement('a');
    link.href = media.url;
    link.download = media.title[currentLanguage];
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [currentLanguage]);

  const shareMedia = useCallback(async (media: MediaItem) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: media.title[currentLanguage],
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
  }, [currentLanguage]);

  const resetFilters = useCallback(() => {
    setSearchTerm('');
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

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
          <AlbumCard
            key={album.id}
            album={album}
            currentLanguage={currentLanguage}
            onView={navigateToAlbum}
            onEdit={(album) => openDialog('editAlbum', album)}
            onDelete={(album) => openDialog('deleteAlbum', album)}
          />
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
            onClick={() => openDialog('createAlbum')}
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
                    {currentAlbum?.name[currentLanguage]}
                  </h2>
                  <p className="text-gray-600 mt-1">{currentAlbum?.description[currentLanguage]}</p>
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
                onClick={() => currentAlbum && openDialog('editAlbum', currentAlbum)}
                className="rounded-full border-gray-300"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button 
                onClick={() => openDialog('uploadMedia')}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Media
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
              <MediaCard
                key={media.id}
                media={media}
                currentLanguage={currentLanguage}
                viewMode={viewMode}
                onView={navigateToMedia}
                onEdit={(media) => openDialog('editMedia', media)}
                onDelete={(media) => openDialog('deleteMedia', media)}
                onDownload={downloadMedia}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {currentAlbumMedia.map((media) => (
              <MediaCard
                key={media.id}
                media={media}
                currentLanguage={currentLanguage}
                viewMode={viewMode}
                onView={navigateToMedia}
                onEdit={(media) => openDialog('editMedia', media)}
                onDelete={(media) => openDialog('deleteMedia', media)}
                onDownload={downloadMedia}
              />
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
              onClick={() => openDialog('uploadMedia')}
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {currentState.view === 'albums' ? 'Gallery' : currentAlbum?.name[currentLanguage]}
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              {currentState.view === 'albums' 
                ? 'Organize your memories and media collections' 
                : currentAlbum?.description[currentLanguage]}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {/* Language Switcher */}
            <Select value={currentLanguage} onValueChange={(val: Language) => setCurrentLanguage(val)}>
              <SelectTrigger className="w-32">
                <Languages className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map(lang => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {currentState.view === 'album-detail' && (
              <Button 
                onClick={() => openDialog('uploadMedia')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Media
              </Button>
            )}
            {currentState.view === 'albums' && (
              <Button 
                onClick={() => openDialog('createAlbum')}
                className="bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <FolderPlus className="w-4 h-4 mr-2" />
                New Album
              </Button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard 
            icon={<FolderPlus className="w-6 h-6 text-blue-600" />}
            label="Total Albums"
            value={stats.totalAlbums}
            color="bg-blue-100"
          />
          <StatsCard 
            icon={<ImageIcon className="w-6 h-6 text-green-600" />}
            label="Total Media"
            value={stats.totalMedia}
            color="bg-green-100"
          />
          <StatsCard 
            icon={<FileText className="w-6 h-6 text-yellow-600" />}
            label="Images"
            value={stats.totalImages}
            color="bg-yellow-100"
          />
          <StatsCard 
            icon={<VideoIcon className="w-6 h-6 text-purple-600" />}
            label="Videos"
            value={stats.totalVideos}
            color="bg-purple-100"
          />
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

        {/* Create/Edit Album Dialog */}
        <Dialog open={dialogState.createAlbum || dialogState.editAlbum} onOpenChange={(open) => {
          if (!open) closeDialog(dialogState.createAlbum ? 'createAlbum' : 'editAlbum');
        }}>
          <DialogContent className="sm:max-w-2xl rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {dialogState.createAlbum ? 'Create New Album' : 'Edit Album'}
              </DialogTitle>
              <DialogDescription>
                {dialogState.createAlbum 
                  ? 'Create a new album to organize your photos and videos in multiple languages' 
                  : 'Update the album details in all languages'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {/* Language Tabs */}
              <LanguageTabs value={selectedLanguage} onChange={setSelectedLanguage} />

              {/* Album Name */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Album Name ({getLanguageLabel(selectedLanguage)}) *
                </Label>
                <Input
                  value={albumForm.form.name[selectedLanguage]}
                  onChange={(e) => albumForm.updateField('name', selectedLanguage, e.target.value)}
                  placeholder={`Enter album name in ${getLanguageLabel(selectedLanguage)}`}
                  className="rounded-lg"
                />
              </div>

              {/* Album Description */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Description ({getLanguageLabel(selectedLanguage)}) *
                </Label>
                <Textarea
                  value={albumForm.form.description[selectedLanguage]}
                  onChange={(e) => albumForm.updateField('description', selectedLanguage, e.target.value)}
                  placeholder={`Enter description in ${getLanguageLabel(selectedLanguage)}`}
                  rows={3}
                  className="rounded-lg"
                />
              </div>
            </div>

            {/* Alert Messages */}
            {message && (
              <AlertMessage 
                type={message.type} 
                title={message.title} 
                message={message.message} 
              />
            )}

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => closeDialog(dialogState.createAlbum ? 'createAlbum' : 'editAlbum')}
                className="rounded-lg"
              >
                Cancel
              </Button>
              <Button 
                onClick={dialogState.createAlbum ? handleCreateAlbum : handleEditAlbum}
                className="rounded-lg bg-blue-600 hover:bg-blue-700"
              >
                {dialogState.createAlbum ? 'Create Album' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Media Dialog */}
        <Dialog open={dialogState.editMedia} onOpenChange={(open) => !open && closeDialog('editMedia')}>
          <DialogContent className="sm:max-w-2xl rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl">Edit Media</DialogTitle>
              <DialogDescription>
                Update the media details in all languages
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {/* Language Tabs */}
              <LanguageTabs value={selectedLanguage} onChange={setSelectedLanguage} />

              {/* Media Title */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Title ({getLanguageLabel(selectedLanguage)}) *
                </Label>
                <Input
                  value={mediaForm.form.title[selectedLanguage]}
                  onChange={(e) => mediaForm.updateField('title', selectedLanguage, e.target.value)}
                  placeholder={`Enter title in ${getLanguageLabel(selectedLanguage)}`}
                  className="rounded-lg"
                />
              </div>

              {/* Media Preview */}
              {selectedItems.media && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Preview</Label>
                  <div className="w-32 h-32 rounded-lg overflow-hidden border">
                    <img
                      src={selectedItems.media.url}
                      alt={selectedItems.media.title[currentLanguage]}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Alert Messages */}
            {message && (
              <AlertMessage 
                type={message.type} 
                title={message.title} 
                message={message.message} 
              />
            )}

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => closeDialog('editMedia')}
                className="rounded-lg"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleEditMedia}
                className="rounded-lg bg-blue-600 hover:bg-blue-700"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Upload Media Dialog */}
        <Dialog open={dialogState.uploadMedia} onOpenChange={(open) => !open && closeDialog('uploadMedia')}>
          <DialogContent className="sm:max-w-lg rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl">Add Media to Album</DialogTitle>
              <DialogDescription>
                Upload photos and videos to "{currentAlbum?.name[currentLanguage]}"
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div 
                className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors duration-200 cursor-pointer bg-gray-50/50"
                onClick={triggerFileInput}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">Drop files here or click to upload</p>
                <p className="text-sm text-gray-500">Supports images and videos (Max: 10 files, 50MB each)</p>
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
                  <Label className="text-sm font-medium">Upload Progress</Label>
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
                onClick={() => closeDialog('uploadMedia')}
                className="rounded-lg"
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Album Confirmation */}
        <Dialog open={dialogState.deleteAlbum} onOpenChange={(open) => !open && closeDialog('deleteAlbum')}>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl">Delete Album</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedItems.album?.name[currentLanguage]}"? 
                This will also remove all {selectedItems.album?.itemCount} items in this album.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => closeDialog('deleteAlbum')}
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
        <Dialog open={dialogState.deleteMedia} onOpenChange={(open) => !open && closeDialog('deleteMedia')}>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl">
                Delete Media
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedItems.media?.title[currentLanguage]}"? 
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => closeDialog('deleteMedia')}
                className="rounded-lg"
              >
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={handleDeleteMedia}
                className="rounded-lg"
              >
                Delete Media
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Media Viewer Dialog */}
        <Dialog open={dialogState.mediaViewer} onOpenChange={(open) => !open && closeDialog('mediaViewer')}>
          <DialogContent className="max-w-7xl rounded-2xl p-0 overflow-hidden bg-black">
            <div 
              ref={mediaViewerRef}
              className="relative w-full h-[80vh] bg-black flex items-center justify-center"
            >
              {selectedMedia && (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={selectedMedia.url}
                    alt={selectedMedia.title[currentLanguage]}
                    className="max-w-full max-h-full object-contain"
                  />
                  
                  {/* Media Info Overlay */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <div className="text-white">
                      <h3 className="text-xl font-semibold">{selectedMedia.title[currentLanguage]}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-300 mt-1">
                        <span>{selectedMedia.type}</span>
                        <span>•</span>
                        <span>{selectedMedia.size}</span>
                        <span>•</span>
                        <span>{selectedMedia.dimensions}</span>
                        <span>•</span>
                        <span>{selectedMedia.uploadDate}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => downloadMedia(selectedMedia)}
                        className="bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => openDialog('editMedia', selectedMedia)}
                        className="bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => closeDialog('mediaViewer')}
                        className="bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}