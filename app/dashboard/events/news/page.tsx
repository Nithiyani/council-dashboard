"use client";

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Search, Eye, Edit, Calendar, Clock, User, Download, Pin, BarChart3, FileText, Archive, TrendingUp, AlertCircle, CheckCircle, Droplets, Building, Users, Heart, Image, Tag, Mail } from 'lucide-react';

// Types
type Language = 'en' | 'ta' | 'si';
type ArticleStatus = 'published' | 'draft' | 'archived';
type Priority = 'low' | 'medium' | 'high';

interface LocalizedContent {
  en: string;
  ta: string;
  si: string;
}

interface LocalizedObject {
  en: any;
  ta: any;
  si: any;
}

interface ArticleStats {
  residents_served: number;
  satisfaction_rate: number;
  service_available: string;
  disease_reduction: number;
}

interface ProblemStatement {
  description: LocalizedContent;
  points: LocalizedContent[];
}

interface InnovativeSolution {
  description: LocalizedContent;
  points: LocalizedContent[];
}

interface TransformationStats {
  quality_compliance_before: number;
  quality_compliance_after: number;
  coverage_before: number;
  coverage_after: number;
  complaint_response_before_hours: number;
  complaint_response_after_hours: number;
}

interface TransformationJourney {
  description: LocalizedContent;
  stats: TransformationStats;
}

interface CommunityImpact {
  description: LocalizedContent;
  points: LocalizedContent[];
}

interface ArticleContent {
  introduction: LocalizedContent;
  stats: ArticleStats;
  problem_statement: ProblemStatement;
  innovative_solution: InnovativeSolution;
  transformation_journey: TransformationJourney;
  community_impact: CommunityImpact;
}

interface ArticleActions {
  share_count: number;
  saved: boolean;
  printable: boolean;
}

interface NewsArticle {
  id: string;
  title: LocalizedContent;
  slug: string;
  content: ArticleContent;
  excerpt: LocalizedContent;
  author: string;
  date: string;
  time: string;
  publishDate: string;
  status: ArticleStatus;
  category: string;
  readTime: number;
  views: number;
  isPinned?: boolean;
  priority?: Priority;
  coverImage?: string;
  tags?: string[];
  contactDepartment?: string;
  lastUpdated?: string;
  actions?: ArticleActions;
}

interface ArticleFormData {
  title: LocalizedContent;
  slug: string;
  content: ArticleContent;
  excerpt: LocalizedContent;
  author: string;
  date: string;
  time: string;
  category: string;
  status: ArticleStatus;
  priority: Priority;
  isPinned: boolean;
  coverImage: string;
  tags: string[];
  contactDepartment: string;
}

interface Statistics {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  archivedArticles: number;
  totalViews: number;
  averageReadTime: number;
  pinnedArticles: number;
}

// Constants
const CATEGORIES = ['Infrastructure', 'Announcements', 'Events', 'Maintenance', 'Updates', 'Community', 'Technology', 'Health', 'Education'] as const;
const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'ta', label: 'Tamil' },
  { value: 'si', label: 'Sinhala' }
];

const PRIORITIES: Priority[] = ['low', 'medium', 'high'];
const STATUSES: ArticleStatus[] = ['published', 'draft', 'archived'];

const DEFAULT_CONTENT: ArticleContent = {
  introduction: { en: '', ta: '', si: '' },
  stats: {
    residents_served: 0,
    satisfaction_rate: 0,
    service_available: '',
    disease_reduction: 0
  },
  problem_statement: {
    description: { en: '', ta: '', si: '' },
    points: [{ en: '', ta: '', si: '' }]
  },
  innovative_solution: {
    description: { en: '', ta: '', si: '' },
    points: [{ en: '', ta: '', si: '' }]
  },
  transformation_journey: {
    description: { en: '', ta: '', si: '' },
    stats: {
      quality_compliance_before: 0,
      quality_compliance_after: 0,
      coverage_before: 0,
      coverage_after: 0,
      complaint_response_before_hours: 0,
      complaint_response_after_hours: 0
    }
  },
  community_impact: {
    description: { en: '', ta: '', si: '' },
    points: [{ en: '', ta: '', si: '' }]
  }
};

const WATER_TREATMENT_ARTICLE: NewsArticle = {
  id: 'water-treatment-plant',
  title: {
    en: 'New Water Treatment Plant Inaugurated',
    ta: 'புதிய நீர் சுத்திகரிப்பு ஆலை தொடங்கப்பட்டது',
    si: 'නව ජල පිරිස්සුම් කර්මාන්ත ශාලාව විවෘත කරන ලදී'
  },
  slug: 'new-water-treatment-plant-inaugurated',
  content: {
    introduction: {
      en: 'In a significant milestone for public health infrastructure, the Mannar Urban Council inaugurated its new water treatment plant yesterday. The facility, built with a budget of Rs. 45 million, incorporates advanced filtration and purification technologies...',
      ta: 'பொது சுகாதார உள்கட்டமைப்புக்கான முக்கிய மைல்கல்லாக, நேற்று மன்னார் நகராட்சி அவையின் புதிய நீர் சுத்திகரிப்பு ஆலை தொடங்கப்பட்டது. ரூ. 45 மில்லியன் பட்ஜெட்டில் கட்டப்பட்ட இந்த வசதி, மேம்பட்ட வடிப்பு மற்றும் சுத்திகரிப்பு தொழில்நுட்பங்களை உள்ளடக்கியது...',
      si: 'පොදු සෞඛ්ය යටිතල පහසුකම් සඳහා වැදගත් මිල්ලක් ලෙස, මන්නාරම් නගර සභාව ඊයේ නව ජල පිරිස්සුම් කර්මාන්ත ශාලාව විවෘත කළේය. මිලියන 45 ක අයවැයක් සහිතව ඉදිකරන ලද මෙම පහසුකම, උසස් පෙරීමේ හා පිරිසිදු කිරීමේ තාක්ෂණයන් ඇතුළත් කරයි...'
    },
    stats: {
      residents_served: 15000,
      satisfaction_rate: 95,
      service_available: '24/7',
      disease_reduction: 60
    },
    problem_statement: {
      description: {
        en: 'Before this initiative, residents faced long queues, limited access to clean water, and delays in municipal services, causing public dissatisfaction.',
        ta: 'இந்த முன்முயற்சிக்கு முன்பு, குடிமக்கள் நீண்ட வரிசைகள், சுத்தமான நீருக்கு வரம்பான அணுகல் மற்றும் நகராட்சி சேவைகளில் தாமதங்களை எதிர்கொண்டனர், இது பொது அதிருப்திக்கு காரணமாக இருந்தது.',
        si: 'මෙම මුලපිරීමට පෙර, පුරවැසියන් දිගු පෝලිම්, පිරිසිදු ජලයට සීමිත ප්‍රවේශය සහ නගර සභා සේවාවන්හි ප්‍රමාදයන්ට මුහුණ දුන් අතර, එය පොදු අතෘප්තියට හේතු විය.'
      },
      points: [
        {
          en: 'Average wait time of 3+ hours for water collection',
          ta: 'நீர் சேகரிப்புக்கு 3+ மணிநேரம் சராசரி காத்திருக்கும் நேரம்',
          si: 'ජලය එකතු කිරීම සඳහා පැය 3+ ක සාමාන්‍ය රැඳී සිටීමේ කාලය'
        },
        {
          en: 'Frequent water-borne disease outbreaks',
          ta: 'அடிக்கடி நீர் பரவும் நோய்த்தொற்றுகள்',
          si: 'නිතර ජලය මගින් පැතිරෙන රෝග'
        },
        {
          en: 'Limited service coverage in remote areas',
          ta: 'தொலைதூர பகுதிகளில் வரம்பான சேவை பரவல்',
          si: 'දුරස්ථ ප්‍රදේශවල සීමිත සේවා ව්‍යාප්තිය'
        },
        {
          en: 'Aging infrastructure requiring constant repairs',
          ta: 'நிலையான பழுதுபார்ப்புகள் தேவைப்படும் பழைய உள்கட்டமைப்பு',
          si: 'නිරන්තර අලුත්වැඩියා අවශ්‍ය පැරණි යටිතල පහසුකම්'
        }
      ]
    },
    innovative_solution: {
      description: {
        en: 'The council introduced a modern water treatment facility, leveraging advanced purification technologies and efficient service systems.',
        ta: 'மன்றம் ஒரு நவீன நீர் சுத்திகரிப்பு வசதியை அறிமுகப்படுத்தியது, இது மேம்பட்ட சுத்திகரிப்பு தொழில்நுட்பங்கள் மற்றும் திறமையான சேவை அமைப்புகளை பயன்படுத்துகிறது.',
        si: 'සභාව නවීන ජල පිරිස්සුම් පහසුකමක් හඳුන්වා දුන් අතර, එය උසස් පිරිසිදු කිරීමේ තාක්ෂණයන් සහ කාර්යක්ෂම සේවා පද්ධති භාවිතා කරයි.'
      },
      points: [
        {
          en: 'State-of-the-art reverse osmosis technology',
          ta: 'நவீன தலைமுறை தலைகீழ் சவ்வூடுபரவல் தொழில்நுட்பம்',
          si: 'අති නවීන ප්‍රතිලෝම ද්‍රවාංක තාක්ෂණය'
        },
        {
          en: 'Automated monitoring and quality control',
          ta: 'தானியங்கி கண்காணிப்பு மற்றும் தரக் கட்டுப்பாடு',
          si: 'ස්වයංක්‍රීය නිරීක්ෂණය සහ ගුණාත්මකභාවය පාලනය'
        },
        {
          en: 'Expanded distribution network coverage',
          ta: 'விரிவுபடுத்தப்பட்ட விநியோக பிணைய பரவல்',
          si: 'විස්තීර්ණ බෙදාහැරීමේ ජාල ව්‍යාප්තිය'
        },
        {
          en: 'Trained technical staff for maintenance',
          ta: 'பராமரிப்புக்கு பயிற்சி பெற்ற தொழில்நுட்ப ஊழியர்கள்',
          si: 'නඩත්තුව සඳහා පුහුණුව ලබා ඇති තාක්ෂණික කාර්ය මණ්ඩලය'
        }
      ]
    },
    transformation_journey: {
      description: {
        en: 'Previously, water quality was inconsistent. Now, residents enjoy safe, reliable water supply, improving public health drastically.',
        ta: 'முன்பு, நீரின் தரம் சீரற்றதாக இருந்தது. இப்போது, குடிமக்கள் பாதுகாப்பான, நம்பகமான நீர் விநியோகத்தை அனுபவிக்கிறார்கள், இது பொது சுகாதாரத்தை கணிசமாக மேம்படுத்துகிறது.',
        si: 'පෙර, ජලයේ ගුණාත්මකභාවය අස්ථාවර විය. දැන්, පුරවැසියන් ආරක්ෂිත, විශ්වසනීය ජල සැපයුම් භුක්ති විඳින අතර, එය පොදු සෞඛ්යය නාටකාකාර ලෙස වැඩිදියුණු කරයි.'
      },
      stats: {
        quality_compliance_before: 65,
        quality_compliance_after: 98,
        coverage_before: 45,
        coverage_after: 92,
        complaint_response_before_hours: 48,
        complaint_response_after_hours: 6
      }
    },
    community_impact: {
      description: {
        en: 'Over 15,000 residents benefit daily from clean water. Community satisfaction has increased, and municipal operations are more efficient.',
        ta: '15,000 க்கும் மேற்பட்ட குடிமக்கள் தினமும் சுத்தமான நீரில் இருந்து பயனடைகின்றனர். சமூக திருப்தி அதிகரித்துள்ளது, மற்றும் நகராட்சி செயல்பாடுகள் மிகவும் திறமையானவை.',
        si: 'පුරවැසියන් 15,000 කට වැඩි ගණනක් දිනපතා පිරිසිදු ජලයෙන් ප්‍රයෝජන ලබයි. ප්‍රජා තෘප්තිය වැඩි වී ඇති අතර, නගර සභා ක්‍රියාකාරකම් වඩාත් කාර්යක්ෂම වේ.'
      },
      points: [
        {
          en: '15,000+ residents served daily',
          ta: 'தினசரி 15,000+ குடிமக்கள் பயனடைகின்றனர்',
          si: 'දිනපතා පුරවැසියන් 15,000+ කට සේවය'
        },
        {
          en: '40% reduction in water-related complaints',
          ta: 'நீர் தொடர்பான புகார்களில் 40% குறைப்பு',
          si: 'ජලය සම්බන්ධ පැමිණිලි 40% කින් අඩුවීම'
        },
        {
          en: '95% resident satisfaction rate',
          ta: '95% குடிப்பதிருப்தி விகிதம்',
          si: 'පුරවැසි තෘප්ති අනුපාතය 95%'
        },
        {
          en: '50% improvement in operational efficiency',
          ta: 'செயல்பாட்டு திறனில் 50% மேம்பாடு',
          si: 'මෙහෙයුම් කාර්යක්ෂමතාවයේ 50% වැඩිදියුණුව'
        }
      ]
    }
  },
  excerpt: {
    en: 'The Mannar Urban Council officially opened a state-of-the-art water treatment facility to serve 15,000 residents with clean, safe drinking water.',
    ta: 'மன்னார் நகராட்சி அவை 15,000 குடிமக்களுக்கு சுத்தமான, பாதுகாப்பான குடிநீரை வழங்கும் நவீன நீர் சுத்திகரிப்பு வசதியை அதிகாரப்பூர்வமாகத் திறந்தது.',
    si: 'මන්නාරම් නගර සභාව පුරවැසියන් 15,000 කට පිරිසිදු, ආරක්ෂිත පානීය ජලය සපයනු පිණිස අති නවීන ජල පිරිස්සුම් පහසුකමක් විවෘත කළේය.'
  },
  author: 'Municipal Communications',
  date: '2024-01-15',
  time: '20:00',
  publishDate: '2024-01-15',
  status: 'published',
  category: 'Infrastructure',
  readTime: 8,
  views: 2150,
  isPinned: true,
  priority: 'high',
  coverImage: 'https://example.com/images/water-plant.jpg',
  tags: ['water', 'infrastructure', 'public health', 'mannar'],
  contactDepartment: 'Mannar Urban Council',
  lastUpdated: '2025-10-13T00:00:00Z',
  actions: {
    share_count: 156,
    saved: true,
    printable: true
  }
};

const SAMPLE_NEWS: NewsArticle[] = [
  WATER_TREATMENT_ARTICLE,
  {
    id: '1',
    title: {
      en: 'New Event Management System Launched',
      ta: 'புதிய நிகழ்வு மேலாண்மை அமைப்பு தொடக்கம்',
      si: 'නව ඉසව් කළමනාකරණ පද්ධතියක් අරඹන ලදී'
    },
    slug: 'new-event-management-system-launched',
    content: DEFAULT_CONTENT,
    excerpt: {
      en: 'Learn about our new event management system features and improvements.',
      ta: 'எங்கள் புதிய நிகழ்வு மேலாண்மை அமைப்பு அம்சங்கள் மற்றும் மேம்பாடுகளைப் பற்றி அறிக.',
      si: 'අපගේ නව ඉසව් කළමනාකරණ පද්ධතියේ විශේෂාංග සහ වැඩිදියුණු කිරීම් පිළිබඳව ඉගෙන ගන්න.'
    },
    author: 'John Doe',
    date: '2024-01-15',
    time: '10:00',
    publishDate: '2024-01-15',
    status: 'published',
    category: 'Technology',
    readTime: 5,
    views: 1245,
    isPinned: false,
    priority: 'medium'
  }
];

// Hooks
const useNews = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);

  useEffect(() => {
    const savedNews = localStorage.getItem('newsArticles');
    if (savedNews) {
      setNews(JSON.parse(savedNews));
    } else {
      setNews(SAMPLE_NEWS);
      localStorage.setItem('newsArticles', JSON.stringify(SAMPLE_NEWS));
    }
  }, []);

  const addArticle = useCallback((article: Omit<NewsArticle, 'id' | 'views'>) => {
    const newArticle: NewsArticle = {
      ...article,
      id: Date.now().toString(),
      views: 0,
    };
    const updatedNews = [newArticle, ...news];
    setNews(updatedNews);
    localStorage.setItem('newsArticles', JSON.stringify(updatedNews));
    return newArticle;
  }, [news]);

  const updateArticle = useCallback((id: string, updates: Partial<NewsArticle>) => {
    const updatedNews = news.map(article => 
      article.id === id ? { ...article, ...updates } : article
    );
    setNews(updatedNews);
    localStorage.setItem('newsArticles', JSON.stringify(updatedNews));
  }, [news]);

  const deleteArticle = useCallback((id: string) => {
    const updatedNews = news.filter(article => article.id !== id);
    setNews(updatedNews);
    localStorage.setItem('newsArticles', JSON.stringify(updatedNews));
  }, [news]);

  const incrementViews = useCallback((id: string) => {
    updateArticle(id, { views: (news.find(a => a.id === id)?.views || 0) + 1 });
  }, [news, updateArticle]);

  return { news, addArticle, updateArticle, deleteArticle, incrementViews };
};

const useArticleForm = (initialData?: ArticleFormData) => {
  const [formData, setFormData] = useState<ArticleFormData>(initialData || {
    title: { en: '', ta: '', si: '' },
    slug: '',
    content: DEFAULT_CONTENT,
    excerpt: { en: '', ta: '', si: '' },
    author: '',
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    category: '',
    status: 'draft',
    priority: 'medium',
    isPinned: false,
    coverImage: '',
    tags: [],
    contactDepartment: ''
  });

  const updateField = useCallback(<K extends keyof ArticleFormData>(field: K, value: ArticleFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateLocalizedField = useCallback((field: 'title' | 'excerpt', language: Language, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: { ...prev[field], [language]: value }
    }));
  }, []);

  const updateContentField = useCallback((field: keyof ArticleContent, subField: string, language: Language, value: any) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [field]: {
          ...prev.content[field],
          [subField]: language === 'all' ? value : {
            ...(prev.content[field] as any)[subField],
            [language]: value
          }
        }
      }
    }));
  }, []);

  const updateStatsField = useCallback((field: keyof ArticleStats, value: number | string) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        stats: {
          ...prev.content.stats,
          [field]: value
        }
      }
    }));
  }, []);

  const updateTransformationStats = useCallback((field: keyof TransformationStats, value: number) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        transformation_journey: {
          ...prev.content.transformation_journey,
          stats: {
            ...prev.content.transformation_journey.stats,
            [field]: value
          }
        }
      }
    }));
  }, []);

  const addPoint = useCallback((section: 'problem_statement' | 'innovative_solution' | 'community_impact') => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [section]: {
          ...prev.content[section],
          points: [...prev.content[section].points, { en: '', ta: '', si: '' }]
        }
      }
    }));
  }, []);

  const removePoint = useCallback((section: 'problem_statement' | 'innovative_solution' | 'community_impact', index: number) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [section]: {
          ...prev.content[section],
          points: prev.content[section].points.filter((_, i) => i !== index)
        }
      }
    }));
  }, []);

  const updatePoint = useCallback((section: 'problem_statement' | 'innovative_solution' | 'community_impact', index: number, language: Language, value: string) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [section]: {
          ...prev.content[section],
          points: prev.content[section].points.map((point, i) => 
            i === index ? { ...point, [language]: value } : point
          )
        }
      }
    }));
  }, []);

  const reset = useCallback(() => {
    setFormData({
      title: { en: '', ta: '', si: '' },
      slug: '',
      content: DEFAULT_CONTENT,
      excerpt: { en: '', ta: '', si: '' },
      author: '',
      date: new Date().toISOString().split('T')[0],
      time: '12:00',
      category: '',
      status: 'draft',
      priority: 'medium',
      isPinned: false,
      coverImage: '',
      tags: [],
      contactDepartment: ''
    });
  }, []);

  return { 
    formData, 
    updateField, 
    updateLocalizedField, 
    updateContentField,
    updateStatsField,
    updateTransformationStats,
    addPoint,
    removePoint,
    updatePoint,
    reset 
  };
};

// Utility Functions
const getPriorityColor = (priority: Priority) => {
  const colors = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200'
  };
  return colors[priority];
};

const getStatusColor = (status: ArticleStatus) => {
  const colors = {
    published: 'bg-green-100 text-green-800 border-green-200',
    draft: 'bg-blue-100 text-blue-800 border-blue-200',
    archived: 'bg-gray-100 text-gray-800 border-gray-200'
  };
  return colors[status];
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const calculateReadTime = (content: ArticleContent) => {
  const totalContent = Object.values(content.introduction).join(' ') +
    Object.values(content.problem_statement.description).join(' ') +
    Object.values(content.innovative_solution.description).join(' ') +
    Object.values(content.transformation_journey.description).join(' ') +
    Object.values(content.community_impact.description).join(' ');
  
  return Math.ceil(totalContent.split(' ').length / 200);
};

const getLocalizedText = (content: LocalizedContent, language: Language, fallback: string = '') => {
  return content?.[language]?.trim() || fallback;
};

const validateArticle = (formData: ArticleFormData): string | null => {
  const missingFields: string[] = [];
  
  if (!formData.category) missingFields.push('Category');
  if (!formData.author.trim()) missingFields.push('Author');
  if (!formData.slug.trim()) missingFields.push('Slug');
  
  LANGUAGES.forEach(({ value, label }) => {
    if (!formData.title[value]?.trim()) missingFields.push(`${label} Title`);
    if (!formData.excerpt[value]?.trim()) missingFields.push(`${label} Excerpt`);
  });

  return missingFields.length > 0 ? `Please fill in: ${missingFields.join(', ')}` : null;
};

const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Components
const LanguageTabs = ({ 
  value, 
  onValueChange 
}: { 
  value: Language; 
  onValueChange: (value: Language) => void;
}) => (
  <Tabs value={value} onValueChange={onValueChange}>
    <TabsList className="grid w-full grid-cols-3">
      {LANGUAGES.map((lang) => (
        <TabsTrigger key={lang.value} value={lang.value}>
          {lang.label}
        </TabsTrigger>
      ))}
    </TabsList>
  </Tabs>
);

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend 
}: { 
  title: string; 
  value: number | string; 
  icon: React.ElementType;
  description?: string;
  trend?: string;
}) => (
  <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
          {trend && (
            <div className="flex items-center mt-1">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-xs text-green-500">{trend}</span>
            </div>
          )}
        </div>
        <div className="p-3 rounded-full bg-blue-100">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const AlertMessage = ({ 
  type, 
  title, 
  message 
}: { 
  type: 'error' | 'success'; 
  title: string; 
  message: string;
}) => {
  const Icon = type === 'error' ? AlertCircle : CheckCircle;
  const styles = {
    error: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-green-50 border-green-200 text-green-800'
  };
  
  return (
    <div className={`border rounded-md p-4 ${styles[type]}`}>
      <div className="flex items-center">
        <Icon className="w-5 h-5 mr-2" />
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
};

const NewsCard = ({ 
  article, 
  currentLanguage,
  onView,
  onEdit,
  onDelete
}: { 
  article: NewsArticle;
  currentLanguage: Language;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <Card className="flex flex-col hover:shadow-lg transition-shadow bg-white/90 backdrop-blur-sm">
    <CardHeader>
      <div className="flex justify-between items-start mb-2">
        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
          {article.category}
        </Badge>
        <div className="flex gap-1">
          {article.isPinned && <Pin className="w-4 h-4 text-blue-500 fill-current" />}
          <Badge variant="outline" className={getStatusColor(article.status)}>
            {article.status.toUpperCase()}
          </Badge>
        </div>
      </div>
      <CardTitle className="text-xl line-clamp-2">
        {getLocalizedText(article.title, currentLanguage)}
      </CardTitle>
      <CardDescription className="line-clamp-3">
        {getLocalizedText(article.excerpt, currentLanguage)}
      </CardDescription>
    </CardHeader>
    <CardContent className="flex-grow">
      <div className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          {formatDate(article.publishDate)}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-2" />
          {article.readTime} min read
        </div>
        <div className="text-sm text-gray-600 flex items-center">
          <User className="h-4 w-4 mr-2" />
          By {article.author}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Eye className="h-4 w-4 mr-2" />
          {article.views} views
        </div>
      </div>
    </CardContent>
    <CardContent className="pt-0">
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={onView}
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={onEdit}
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onDelete}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </CardContent>
  </Card>
);

const ArticleFormFields = ({
  formData,
  selectedLanguage,
  onFieldChange,
  onLocalizedFieldChange,
  onContentFieldChange,
  onStatsFieldChange,
  onTransformationStatsChange,
  onAddPoint,
  onRemovePoint,
  onUpdatePoint,
  onLanguageChange,
  errorMessage
}: {
  formData: ArticleFormData;
  selectedLanguage: Language;
  onFieldChange: <K extends keyof ArticleFormData>(field: K, value: ArticleFormData[K]) => void;
  onLocalizedFieldChange: (field: 'title' | 'excerpt', language: Language, value: string) => void;
  onContentFieldChange: (field: keyof ArticleContent, subField: string, language: Language, value: any) => void;
  onStatsFieldChange: (field: keyof ArticleStats, value: number | string) => void;
  onTransformationStatsChange: (field: keyof TransformationStats, value: number) => void;
  onAddPoint: (section: 'problem_statement' | 'innovative_solution' | 'community_impact') => void;
  onRemovePoint: (section: 'problem_statement' | 'innovative_solution' | 'community_impact', index: number) => void;
  onUpdatePoint: (section: 'problem_statement' | 'innovative_solution' | 'community_impact', index: number, language: Language, value: string) => void;
  onLanguageChange: (language: Language) => void;
  errorMessage: string;
}) => {
  const getLanguageLabel = (lang: Language) => LANGUAGES.find(l => l.value === lang)?.label || lang;

  const handleTitleChange = (language: Language, value: string) => {
    onLocalizedFieldChange('title', language, value);
    if (language === 'en') {
      onFieldChange('slug', generateSlug(value));
    }
  };

  return (
    <div className="grid gap-6 py-4">
      <LanguageTabs value={selectedLanguage} onValueChange={onLanguageChange} />

      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
        
        <div className="grid gap-2">
          <label htmlFor="title" className="text-sm font-medium">
            Title ({getLanguageLabel(selectedLanguage)}) *
          </label>
          <Input
            id="title"
            value={formData.title[selectedLanguage] || ''}
            onChange={(e) => handleTitleChange(selectedLanguage, e.target.value)}
            placeholder={`Enter title in ${getLanguageLabel(selectedLanguage)}`}
            className={!formData.title[selectedLanguage]?.trim() && errorMessage ? "border-red-500" : ""}
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="slug" className="text-sm font-medium">Slug *</label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => onFieldChange('slug', e.target.value)}
            placeholder="article-url-slug"
            className={!formData.slug && errorMessage ? "border-red-500" : ""}
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="excerpt" className="text-sm font-medium">
            Excerpt ({getLanguageLabel(selectedLanguage)}) *
          </label>
          <Textarea
            id="excerpt"
            value={formData.excerpt[selectedLanguage] || ''}
            onChange={(e) => onLocalizedFieldChange('excerpt', selectedLanguage, e.target.value)}
            placeholder={`Brief description in ${getLanguageLabel(selectedLanguage)}`}
            rows={3}
            className={!formData.excerpt[selectedLanguage]?.trim() && errorMessage ? "border-red-500" : ""}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label htmlFor="author" className="text-sm font-medium">Author *</label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => onFieldChange('author', e.target.value)}
              placeholder="Author name"
              className={!formData.author && errorMessage ? "border-red-500" : ""}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="category" className="text-sm font-medium">Category *</label>
            <Select value={formData.category} onValueChange={(value) => onFieldChange('category', value)}>
              <SelectTrigger className={!formData.category && errorMessage ? "border-red-500" : ""}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label htmlFor="date" className="text-sm font-medium">Date</label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => onFieldChange('date', e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="time" className="text-sm font-medium">Time</label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => onFieldChange('time', e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <label htmlFor="coverImage" className="text-sm font-medium">Cover Image URL</label>
          <Input
            id="coverImage"
            value={formData.coverImage}
            onChange={(e) => onFieldChange('coverImage', e.target.value)}
            placeholder="https://example.com/images/cover.jpg"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="tags" className="text-sm font-medium">Tags</label>
          <Input
            id="tags"
            value={formData.tags.join(', ')}
            onChange={(e) => onFieldChange('tags', e.target.value.split(',').map(tag => tag.trim()))}
            placeholder="water, infrastructure, public health"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="contactDepartment" className="text-sm font-medium">Contact Department</label>
          <Input
            id="contactDepartment"
            value={formData.contactDepartment}
            onChange={(e) => onFieldChange('contactDepartment', e.target.value)}
            placeholder="Mannar Urban Council"
          />
        </div>
      </div>

      {/* Introduction */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Introduction</h3>
        <div className="grid gap-2">
          <label htmlFor="introduction" className="text-sm font-medium">
            Introduction ({getLanguageLabel(selectedLanguage)})
          </label>
          <Textarea
            id="introduction"
            value={formData.content.introduction[selectedLanguage] || ''}
            onChange={(e) => onContentFieldChange('introduction', 'description', selectedLanguage, e.target.value)}
            placeholder={`Write introduction in ${getLanguageLabel(selectedLanguage)}...`}
            rows={4}
          />
        </div>
      </div>

      {/* Statistics */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Key Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label htmlFor="residents_served" className="text-sm font-medium">Residents Served</label>
            <Input
              id="residents_served"
              type="number"
              value={formData.content.stats.residents_served}
              onChange={(e) => onStatsFieldChange('residents_served', parseInt(e.target.value) || 0)}
              placeholder="15000"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="satisfaction_rate" className="text-sm font-medium">Satisfaction Rate (%)</label>
            <Input
              id="satisfaction_rate"
              type="number"
              min="0"
              max="100"
              value={formData.content.stats.satisfaction_rate}
              onChange={(e) => onStatsFieldChange('satisfaction_rate', parseInt(e.target.value) || 0)}
              placeholder="95"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="service_available" className="text-sm font-medium">Service Availability</label>
            <Input
              id="service_available"
              value={formData.content.stats.service_available}
              onChange={(e) => onStatsFieldChange('service_available', e.target.value)}
              placeholder="24/7"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="disease_reduction" className="text-sm font-medium">Disease Reduction (%)</label>
            <Input
              id="disease_reduction"
              type="number"
              min="0"
              max="100"
              value={formData.content.stats.disease_reduction}
              onChange={(e) => onStatsFieldChange('disease_reduction', parseInt(e.target.value) || 0)}
              placeholder="60"
            />
          </div>
        </div>
      </div>

      {/* Problem Statement */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Problem Statement</h3>
        <div className="grid gap-2">
          <label htmlFor="problem_description" className="text-sm font-medium">
            Description ({getLanguageLabel(selectedLanguage)})
          </label>
          <Textarea
            id="problem_description"
            value={formData.content.problem_statement.description[selectedLanguage] || ''}
            onChange={(e) => onContentFieldChange('problem_statement', 'description', selectedLanguage, e.target.value)}
            placeholder={`Describe the problem in ${getLanguageLabel(selectedLanguage)}...`}
            rows={3}
          />
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Key Issues</label>
            <Button type="button" variant="outline" size="sm" onClick={() => onAddPoint('problem_statement')}>
              <Plus className="h-4 w-4 mr-1" />
              Add Issue
            </Button>
          </div>
          {formData.content.problem_statement.points.map((point, index) => (
            <div key={index} className="flex gap-2 items-start">
              <Textarea
                value={point[selectedLanguage] || ''}
                onChange={(e) => onUpdatePoint('problem_statement', index, selectedLanguage, e.target.value)}
                placeholder={`Issue point in ${getLanguageLabel(selectedLanguage)}...`}
                rows={2}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onRemovePoint('problem_statement', index)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 mt-1"
                disabled={formData.content.problem_statement.points.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Innovative Solution */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Innovative Solution</h3>
        <div className="grid gap-2">
          <label htmlFor="solution_description" className="text-sm font-medium">
            Description ({getLanguageLabel(selectedLanguage)})
          </label>
          <Textarea
            id="solution_description"
            value={formData.content.innovative_solution.description[selectedLanguage] || ''}
            onChange={(e) => onContentFieldChange('innovative_solution', 'description', selectedLanguage, e.target.value)}
            placeholder={`Describe the solution in ${getLanguageLabel(selectedLanguage)}...`}
            rows={3}
          />
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Key Features</label>
            <Button type="button" variant="outline" size="sm" onClick={() => onAddPoint('innovative_solution')}>
              <Plus className="h-4 w-4 mr-1" />
              Add Feature
            </Button>
          </div>
          {formData.content.innovative_solution.points.map((point, index) => (
            <div key={index} className="flex gap-2 items-start">
              <Textarea
                value={point[selectedLanguage] || ''}
                onChange={(e) => onUpdatePoint('innovative_solution', index, selectedLanguage, e.target.value)}
                placeholder={`Feature point in ${getLanguageLabel(selectedLanguage)}...`}
                rows={2}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onRemovePoint('innovative_solution', index)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 mt-1"
                disabled={formData.content.innovative_solution.points.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Transformation Journey */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Transformation Journey</h3>
        <div className="grid gap-2">
          <label htmlFor="transformation_description" className="text-sm font-medium">
            Description ({getLanguageLabel(selectedLanguage)})
          </label>
          <Textarea
            id="transformation_description"
            value={formData.content.transformation_journey.description[selectedLanguage] || ''}
            onChange={(e) => onContentFieldChange('transformation_journey', 'description', selectedLanguage, e.target.value)}
            placeholder={`Describe the transformation in ${getLanguageLabel(selectedLanguage)}...`}
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Before</h4>
            <div className="grid gap-2">
              <label htmlFor="quality_before" className="text-xs font-medium">Quality Compliance (%)</label>
              <Input
                id="quality_before"
                type="number"
                min="0"
                max="100"
                value={formData.content.transformation_journey.stats.quality_compliance_before}
                onChange={(e) => onTransformationStatsChange('quality_compliance_before', parseInt(e.target.value) || 0)}
                placeholder="65"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="coverage_before" className="text-xs font-medium">Coverage (%)</label>
              <Input
                id="coverage_before"
                type="number"
                min="0"
                max="100"
                value={formData.content.transformation_journey.stats.coverage_before}
                onChange={(e) => onTransformationStatsChange('coverage_before', parseInt(e.target.value) || 0)}
                placeholder="45"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="response_before" className="text-xs font-medium">Complaint Response (hours)</label>
              <Input
                id="response_before"
                type="number"
                value={formData.content.transformation_journey.stats.complaint_response_before_hours}
                onChange={(e) => onTransformationStatsChange('complaint_response_before_hours', parseInt(e.target.value) || 0)}
                placeholder="48"
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">After</h4>
            <div className="grid gap-2">
              <label htmlFor="quality_after" className="text-xs font-medium">Quality Compliance (%)</label>
              <Input
                id="quality_after"
                type="number"
                min="0"
                max="100"
                value={formData.content.transformation_journey.stats.quality_compliance_after}
                onChange={(e) => onTransformationStatsChange('quality_compliance_after', parseInt(e.target.value) || 0)}
                placeholder="98"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="coverage_after" className="text-xs font-medium">Coverage (%)</label>
              <Input
                id="coverage_after"
                type="number"
                min="0"
                max="100"
                value={formData.content.transformation_journey.stats.coverage_after}
                onChange={(e) => onTransformationStatsChange('coverage_after', parseInt(e.target.value) || 0)}
                placeholder="92"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="response_after" className="text-xs font-medium">Complaint Response (hours)</label>
              <Input
                id="response_after"
                type="number"
                value={formData.content.transformation_journey.stats.complaint_response_after_hours}
                onChange={(e) => onTransformationStatsChange('complaint_response_after_hours', parseInt(e.target.value) || 0)}
                placeholder="6"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Community Impact */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Community Impact</h3>
        <div className="grid gap-2">
          <label htmlFor="impact_description" className="text-sm font-medium">
            Description ({getLanguageLabel(selectedLanguage)})
          </label>
          <Textarea
            id="impact_description"
            value={formData.content.community_impact.description[selectedLanguage] || ''}
            onChange={(e) => onContentFieldChange('community_impact', 'description', selectedLanguage, e.target.value)}
            placeholder={`Describe the community impact in ${getLanguageLabel(selectedLanguage)}...`}
            rows={3}
          />
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Key Benefits</label>
            <Button type="button" variant="outline" size="sm" onClick={() => onAddPoint('community_impact')}>
              <Plus className="h-4 w-4 mr-1" />
              Add Benefit
            </Button>
          </div>
          {formData.content.community_impact.points.map((point, index) => (
            <div key={index} className="flex gap-2 items-start">
              <Textarea
                value={point[selectedLanguage] || ''}
                onChange={(e) => onUpdatePoint('community_impact', index, selectedLanguage, e.target.value)}
                placeholder={`Benefit point in ${getLanguageLabel(selectedLanguage)}...`}
                rows={2}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onRemovePoint('community_impact', index)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 mt-1"
                disabled={formData.content.community_impact.points.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Settings</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label htmlFor="status" className="text-sm font-medium">Status</label>
            <Select value={formData.status} onValueChange={(value: ArticleStatus) => onFieldChange('status', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map(status => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label htmlFor="priority" className="text-sm font-medium">Priority</label>
            <Select value={formData.priority} onValueChange={(value: Priority) => onFieldChange('priority', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIORITIES.map(priority => (
                  <SelectItem key={priority} value={priority}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={formData.isPinned}
            onCheckedChange={(checked) => onFieldChange('isPinned', checked)}
          />
          <label htmlFor="isPinned" className="text-sm font-medium">Pin this article</label>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function NewsListPage() {
  const { news, addArticle, updateArticle, deleteArticle, incrementViews } = useNews();
  const articleForm = useArticleForm();
  
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [dialogState, setDialogState] = useState({
    create: false,
    view: false,
    edit: false,
    delete: false
  });

  // Statistics
  const statistics = useMemo((): Statistics => {
    const totalArticles = news.length;
    const publishedArticles = news.filter(article => article.status === 'published').length;
    const draftArticles = news.filter(article => article.status === 'draft').length;
    const archivedArticles = news.filter(article => article.status === 'archived').length;
    const totalViews = news.reduce((sum, article) => sum + article.views, 0);
    const averageReadTime = totalArticles > 0 
      ? Math.round(news.reduce((sum, article) => sum + article.readTime, 0) / totalArticles * 10) / 10 
      : 0;
    const pinnedArticles = news.filter(article => article.isPinned).length;

    return {
      totalArticles,
      publishedArticles,
      draftArticles,
      archivedArticles,
      totalViews,
      averageReadTime,
      pinnedArticles
    };
  }, [news]);

  // Filtered news
  const filteredNews = useMemo(() => {
    return news.filter(article =>
      Object.values(article.title).some(title => 
        title?.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      Object.values(article.excerpt).some(excerpt =>
        excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      article.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [news, searchTerm]);

  // Dialog handlers
  const openDialog = (type: keyof typeof dialogState, article?: NewsArticle) => {
    if (article) setSelectedArticle(article);
    
    if (type === 'edit' && article) {
      articleForm.updateField('title', article.title);
      articleForm.updateField('slug', article.slug);
      articleForm.updateField('content', article.content);
      articleForm.updateField('excerpt', article.excerpt);
      articleForm.updateField('author', article.author);
      articleForm.updateField('date', article.date);
      articleForm.updateField('time', article.time);
      articleForm.updateField('category', article.category);
      articleForm.updateField('status', article.status);
      articleForm.updateField('priority', article.priority || 'medium');
      articleForm.updateField('isPinned', article.isPinned || false);
      articleForm.updateField('coverImage', article.coverImage || '');
      articleForm.updateField('tags', article.tags || []);
      articleForm.updateField('contactDepartment', article.contactDepartment || '');
    }
    
    if (type === 'view' && article) {
      incrementViews(article.id);
    }
    
    setDialogState(prev => ({ ...prev, [type]: true }));
    setMessage({ type: '', text: '' });
  };

  const closeDialog = (type: keyof typeof dialogState) => {
    setDialogState(prev => ({ ...prev, [type]: false }));
    setSelectedArticle(null);
    articleForm.reset();
    setMessage({ type: '', text: '' });
  };

  const handleCreateArticle = () => {
    const error = validateArticle(articleForm.formData);
    if (error) {
      setMessage({ type: 'error', text: error });
      return;
    }

    const articleData = {
      ...articleForm.formData,
      publishDate: articleForm.formData.date,
      readTime: calculateReadTime(articleForm.formData.content),
      lastUpdated: new Date().toISOString(),
      actions: {
        share_count: 0,
        saved: false,
        printable: true
      }
    };

    addArticle(articleData);
    setMessage({ type: 'success', text: 'Article created successfully!' });
    
    setTimeout(() => {
      closeDialog('create');
    }, 2000);
  };

  const handleUpdateArticle = () => {
    if (!selectedArticle) return;

    const error = validateArticle(articleForm.formData);
    if (error) {
      setMessage({ type: 'error', text: error });
      return;
    }

    updateArticle(selectedArticle.id, {
      ...articleForm.formData,
      readTime: calculateReadTime(articleForm.formData.content),
      lastUpdated: new Date().toISOString()
    });

    setMessage({ type: 'success', text: 'Article updated successfully!' });
    
    setTimeout(() => {
      closeDialog('edit');
    }, 2000);
  };

  const handleDeleteArticle = () => {
    if (selectedArticle) {
      deleteArticle(selectedArticle.id);
      closeDialog('delete');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">News Management</h1>
            <p className="text-gray-600">Create and manage news articles</p>
          </div>
          <Button 
            onClick={() => openDialog('create')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add News
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total Articles" 
            value={statistics.totalArticles} 
            icon={FileText}
            description="All news articles"
          />
          <StatCard 
            title="Published" 
            value={statistics.publishedArticles} 
            icon={BarChart3}
            description="Currently live"
            trend={`${statistics.totalArticles > 0 ? Math.round((statistics.publishedArticles / statistics.totalArticles) * 100) : 0}% of total`}
          />
          <StatCard 
            title="Total Views" 
            value={statistics.totalViews.toLocaleString()} 
            icon={Eye}
            description="All-time views"
          />
          <StatCard 
            title="Avg. Read Time" 
            value={`${statistics.averageReadTime}m`} 
            icon={Clock}
            description="Per article"
          />
        </div>

        {/* Additional Statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard 
            title="Draft Articles" 
            value={statistics.draftArticles} 
            icon={FileText}
            description="In progress"
          />
          <StatCard 
            title="Pinned Articles" 
            value={statistics.pinnedArticles} 
            icon={Pin}
            description="Featured content"
          />
          <StatCard 
            title="Archived" 
            value={statistics.archivedArticles} 
            icon={Archive}
            description="Historical articles"
          />
        </div>

        {/* Language Switcher and Search */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">View in:</span>
            <Select value={currentLanguage} onValueChange={(val: Language) => setCurrentLanguage(val)}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map(lang => (
                  <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card className="flex-1 bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search news by title, content, or category..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* News Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredNews.map((article) => (
            <NewsCard
              key={article.id}
              article={article}
              currentLanguage={currentLanguage}
              onView={() => openDialog('view', article)}
              onEdit={() => openDialog('edit', article)}
              onDelete={() => openDialog('delete', article)}
            />
          ))}
        </div>

        {filteredNews.length === 0 && (
          <Card className="text-center py-12 bg-white/80 backdrop-blur-sm">
            <CardContent>
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No news articles found.</p>
            </CardContent>
          </Card>
        )}

        {/* Create/Edit Dialog */}
        {(dialogState.create || dialogState.edit) && (
          <Dialog open={dialogState.create || dialogState.edit} onOpenChange={() => closeDialog(dialogState.create ? 'create' : 'edit')}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader className="flex-shrink-0">
                <DialogTitle>
                  {dialogState.create ? 'Create New Article' : 'Edit Article'}
                </DialogTitle>
                <DialogDescription>
                  Fill in all details in all three languages. All language fields are required.
                </DialogDescription>
              </DialogHeader>
              
              <ArticleFormFields
                formData={articleForm.formData}
                selectedLanguage={selectedLanguage}
                onFieldChange={articleForm.updateField}
                onLocalizedFieldChange={articleForm.updateLocalizedField}
                onContentFieldChange={articleForm.updateContentField}
                onStatsFieldChange={articleForm.updateStatsField}
                onTransformationStatsChange={articleForm.updateTransformationStats}
                onAddPoint={articleForm.addPoint}
                onRemovePoint={articleForm.removePoint}
                onUpdatePoint={articleForm.updatePoint}
                onLanguageChange={setSelectedLanguage}
                errorMessage={message.text}
              />

              {message.text && (
                <AlertMessage 
                  type={message.type as 'error' | 'success'} 
                  title={message.type === 'error' ? 'Validation Error' : 'Success'} 
                  message={message.text} 
                />
              )}

              <DialogFooter className="flex-shrink-0 pt-4 border-t">
                <Button variant="outline" onClick={() => closeDialog(dialogState.create ? 'create' : 'edit')}>
                  Cancel
                </Button>
                <Button onClick={dialogState.create ? handleCreateArticle : handleUpdateArticle}>
                  {dialogState.create ? 'Create Article' : 'Update Article'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* View Dialog */}
        {dialogState.view && selectedArticle && (
          <Dialog open={dialogState.view} onOpenChange={() => closeDialog('view')}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              <DialogHeader className="flex-shrink-0">
                <DialogTitle className="flex items-center gap-2">
                  {selectedArticle.isPinned && <Pin className="w-4 h-4 text-blue-500 fill-current" />}
                  Article Details
                </DialogTitle>
                <DialogDescription>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-2">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{selectedArticle.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(selectedArticle.publishDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{selectedArticle.readTime} min read</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{selectedArticle.views} views</span>
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex-1 overflow-y-auto space-y-4">
                <div className="flex gap-2 flex-wrap">
                  <Badge className={getPriorityColor(selectedArticle.priority || 'medium')}>
                    {(selectedArticle.priority || 'medium').toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                    {selectedArticle.category}
                  </Badge>
                  <Badge variant="outline" className={getStatusColor(selectedArticle.status)}>
                    {selectedArticle.status.toUpperCase()}
                  </Badge>
                  {selectedArticle.isPinned && (
                    <Badge variant="outline" className="text-blue-600 border-blue-200">
                      <Pin className="w-3 h-3 mr-1" />
                      Pinned
                    </Badge>
                  )}
                </div>

                <LanguageTabs value={currentLanguage} onValueChange={setCurrentLanguage} />
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {getLocalizedText(selectedArticle.title, currentLanguage)}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {getLocalizedText(selectedArticle.excerpt, currentLanguage)}
                    </p>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                        {getLocalizedText(selectedArticle.content.introduction, currentLanguage)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="flex-shrink-0 pt-4 border-t">
                <Button variant="outline" onClick={() => closeDialog('view')}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Delete Dialog */}
        {dialogState.delete && selectedArticle && (
          <Dialog open={dialogState.delete} onOpenChange={() => closeDialog('delete')}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete "{selectedArticle.title.en}"? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => closeDialog('delete')}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteArticle}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}