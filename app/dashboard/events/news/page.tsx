"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Search, Eye, Edit, Calendar, Clock, User, Download, Pin, BarChart3, FileText, Archive, TrendingUp, AlertCircle, CheckCircle, X } from 'lucide-react';

// Types
type Language = 'en' | 'ta' | 'si';

interface NewsContent {
  en: string;
  ta: string;
  si: string;
}

interface NewsArticle {
  id: string;
  title: NewsContent;
  content: NewsContent;
  excerpt: NewsContent;
  author: string;
  publishDate: string;
  status: 'published' | 'draft' | 'archived';
  category: string;
  readTime: number;
  views: number;
  isPinned?: boolean;
  priority?: 'low' | 'medium' | 'high';
  attachments?: string[];
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
const CATEGORIES = ['Announcements', 'Events', 'Maintenance', 'Updates', 'Community', 'Technology', 'Health', 'Education'] as const;
const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'ta', label: 'Tamil' },
  { value: 'si', label: 'Sinhala' }
];

const SAMPLE_NEWS: NewsArticle[] = [
  {
    id: '1',
    title: {
      en: 'New Event Management System Launched',
      ta: 'புதிய நிகழ்வு மேலாண்மை அமைப்பு தொடக்கம்',
      si: 'නව ඉසව් කළමනාකරණ පද්ධතියක් අරඹන ලදී'
    },
    content: {
      en: `We are excited to announce the launch of our new event management system! This comprehensive platform brings numerous improvements and features designed to enhance your experience.

## Key Features:
- **Intuitive Interface**: Streamlined design for easy navigation
- **Advanced Analytics**: Track event performance with detailed insights
- **Customizable Templates**: Pre-built templates for various event types
- **Real-time Updates**: Instant notifications and updates

The new system represents a significant upgrade from our previous platform, incorporating feedback from our valued users. We've focused on making the event management process more efficient and user-friendly.`,
      ta: `எங்கள் புதிய நிகழ்வு மேலாண்மை அமைப்பைத் தொடங்குவதில் நாங்கள் மகிழ்ச்சியடைகிறோம்! இந்த விரிவான தளம் உங்கள் அனுபவத்தை மேம்படுத்த வடிவமைக்கப்பட்ட பல மேம்பாடுகள் மற்றும் அம்சங்களைக் கொண்டு வருகிறது.

## முக்கிய அம்சங்கள்:
- **அறிவார்ந்த இடைமுகம்**: எளிய வழிசெலுத்தலுக்கான திட்டமிடப்பட்ட வடிவமைப்பு
- **மேம்பட்ட பகுப்பாய்வுகள்**: விரிவான நுண்ணறிவுகளுடன் நிகழ்வு செயல்திறனைக் கண்காணிக்கவும்
- **தனிப்பயனாக்கக்கூடிய வார்ப்புருக்கள்**: பல்வேறு நிகழ்வு வகைகளுக்கான முன்-கட்டப்பட்ட வார்ப்புருக்கள்
- **நிகழ்நேர புதுப்பிப்புகள்**: உடனடி அறிவிப்புகள் மற்றும் புதுப்பிப்புகள்

புதிய அமைப்பு எங்கள் முந்தைய தளத்திலிருந்து குறிப்பிடத்தக்க மேம்பாட்டைக் குறிக்கிறது, எங்கள் மதிப்புமிக்க பயனர்களின் கருத்துகளை இணைத்துக்கொள்கிறது. நிகழ்வு மேலாண்மை செயல்முறையை மிகவும் திறமையானதாகவும் பயனர்-நட்பாகவும் மாற்றுவதில் நாங்கள் கவனம் செலுத்தியுள்ளோம்.`,
      si: `අපගේ නව ඉසව් කළමනාකරණ පද්ධතිය ආරම්භ කිරීමේදී අපි උද්යෝගිමත් වෙමු! මෙම විස්තීර්ණ වේදිකාව ඔබගේ අත්දැකීම් වැඩිදියුණු කිරීම සඳහා නිර්මාණය කරන ලද බොහෝ වැඩිදියුණු කිරීම් සහ විශේෂාංග ගෙන එයි.

## ප්‍රධාන අංග:
- **දෘශ්‍ය අතුරුමුහුණත**: පහසු සංචලනය සඳහා සරල කරන ලද නිර්මාණය
- **උසස් විශ්ලේෂණ**: විස්තරාත්මක තීක්ෂ්ණ බුද්ධිය සමඟ ඉසව් කාර්ය සාධනය නිරීක්ෂණය කරන්න
- **අභිරුචි කළ හැකි අච්චු**: විවිධ ඉසව් වර්ග සඳහා පෙර සාදන ලද අච්චු
- **තාත්වික යාවත්කාලීන කිරීම්**: ක්ෂණික දැනුම්දීම් සහ යාවත්කාලීන කිරීම්

නව පද්ධතිය අපගේ පෙර වේදිකාවෙන් සැලකිය යුතු උසස් කිරීමක් නියෝජනය කරයි, අපගේ ඇගයීමට ලක් වූ පරිශීලකයින්ගේ ප්‍රතිපෝෂණය ඒකාබද්ධ කරයි. ඉසව් කළමනාකරණ ක්‍රියාවලිය වඩාත් කාර්යක්ෂම හා පරිශීලක-හිතකාමී කිරීම上 අපි අවධානය යොමු කර ඇත්තෙමු.`
    },
    excerpt: {
      en: 'Learn about our new event management system features and improvements.',
      ta: 'எங்கள் புதிய நிகழ்வு மேலாண்மை அமைப்பு அம்சங்கள் மற்றும் மேம்பாடுகளைப் பற்றி அறிக.',
      si: 'අපගේ නව ඉසව් කළමනාකරණ පද්ධතියේ විශේෂාංග සහ වැඩිදියුණු කිරීම් පිළිබඳව ඉගෙන ගන්න.'
    },
    author: 'John Doe',
    publishDate: '2024-01-15',
    status: 'published',
    category: 'Technology',
    readTime: 5,
    views: 1245,
    isPinned: true,
    priority: 'high',
    attachments: ['system-guide.pdf', 'release-notes.docx']
  },
  {
    id: '2',
    title: {
      en: 'Upcoming Community Meetup',
      ta: 'வரவிருக்கும் சமூக சந்திப்பு',
      si: 'ඉදිරියේදී පැවැත්වෙන සමාජ හමුව'
    },
    content: {
      en: `Join us for our monthly community meetup next Saturday at the Community Center. This event is a great opportunity to network with other professionals in your field and learn about the latest industry trends.

## Event Details:
- **Date**: Saturday, January 27, 2024
- **Time**: 2:00 PM - 5:00 PM
- **Location**: Community Center, 123 Main Street
- **Special Guest**: Industry expert Sarah Johnson

We'll have light refreshments, networking sessions, and a special presentation on emerging technologies. All community members are welcome!`,
      ta: `அடுத்த சனிக்கிழமை சமூக மையத்தில் நமது மாதாந்திர சமூக சந்திப்பில் எங்களுடன் சேரவும். இந்த நிகழ்வு உங்கள் துறையில் உள்ள மற்ற வல்லுநர்களுடன் நெட்வொர்க்கிங் செய்வதற்கும், சமீபத்திய தொழில் போக்குகளைப் பற்றி அறிந்துகொள்வதற்கும் சிறந்த வாய்ப்பாகும்.

## நிகழ்வு விவரங்கள்:
- **தேதி**: சனிக்கிழமை, ஜனவரி 27, 2024
- **நேரம்**: மாலை 2:00 மணி - 5:00 மணி
- **இடம்**: சமூக மையம், 123 மெயின் தெரு
- **சிறப்பு விருந்தினர்**: தொழில் நிபுணர் சாரா ஜான்சன்

இலகுவான புத்துணர்ச்சி, நெட்வொர்க்கிங் அமர்வுகள் மற்றும் எழும் தொழில்நுட்பங்கள் குறித்த சிறப்பு விளக்கக்காட்சி ஆகியவை இருக்கும். அனைத்து சமூக உறுப்பினர்களும் வரவேற்கப்படுகிறார்கள்!`,
      si: `ඊළඟ සෙනසුරාදා ප්‍රජා මධ්‍යස්ථානයේදී අපගේ මාසික සමාජ හමුවට සහභාගී වන්න. මෙම ඉසව්ව ඔබගේ ක්ෂේත්‍රයේ අනෙක් වෘත්තිකයන් සමඟ ජාලකරණය කිරීමට සහ නවතම කර්මාන්ත ප්‍රවණතා ගැන ඉගෙන ගැනීමට විශිෂ්ට අවස්ථාවකි.

## ඉසව්වේ විස්තර:
- **දිනය**: සෙනසුරාදා, ජනවාරි 27, 2024
- **වේලාව**: ප.ව. 2:00 - 5:00
- **ස්ථානය**: ප්‍රජා මධ්‍යස්ථානය, 123 ප්‍රධාන වීදිය
- **විශේෂ අමුත්තා**: කර්මාන්ත විශේෂඥ සාරා ජොන්සන්

සැහැල්ලු නැවුම් කිරීම්, ජාලකරණ සැසි සහ නැගී එන තාක්ෂණය පිළිබඳ විශේෂ ඉදිරිපත් කිරීමක් අප සතුව ඇත. සියලුම ප්‍රජා සාමාජිකයන් සාදරයෙන් පිළිගනිමු!`
    },
    excerpt: {
      en: 'Monthly community gathering with special guests and networking opportunities.',
      ta: 'சிறப்பு விருந்தினர்கள் மற்றும் நெட்வொர்க்கிங் வாய்ப்புகளுடன் மாதாந்திர சமூக கூட்டம்.',
      si: 'විශේෂ අමුත්තන් සහ ජාලකරණ අවස්ථා සහිත මාසික සමාජ රැස්වීම.'
    },
    author: 'Jane Smith',
    publishDate: '2024-01-10',
    status: 'published',
    category: 'Community',
    readTime: 3,
    views: 867,
    isPinned: true,
    priority: 'medium',
    attachments: ['agenda.pdf']
  },
  {
    id: '3',
    title: {
      en: 'System Maintenance Schedule',
      ta: 'கணினி பராமரிப்பு அட்டவணை',
      si: 'පද්ධති නඩත්තු කාලසටහන'
    },
    content: {
      en: `Please be advised that we will be performing scheduled system maintenance this weekend to improve performance and security.

## Maintenance Window:
- **Start**: Saturday, January 20, 2024, 10:00 PM
- **End**: Sunday, January 21, 2024, 2:00 AM

During this time, the system may be unavailable. We apologize for any inconvenience this may cause and appreciate your understanding as we work to improve our services.`,
      ta: `செயல்திறன் மற்றும் பாதுகாப்பை மேம்படுத்த இந்த வார இறுதியில் திட்டமிடப்பட்ட கணினி பராமரிப்பை நாங்கள் செயல்படுத்தப் போவதாக தெரிவித்துக்கொள்கிறோம்.

## பராமரிப்பு நேரம்:
- **தொடக்கம்**: சனிக்கிழமை, ஜனவரி 20, 2024, இரவு 10:00 மணி
- **முடிவு**: ஞாயிற்றுக்கிழமை, ஜனவரி 21, 2024, காலை 2:00 மணி

இந்த நேரத்தில், கணினி கிடைக்காமல் போகலாம். இது ஏற்படுத்தக்கூடிய எந்தவொரு சிரமத்திற்கும் நாங்கள் மன்னிப்பு கோருகிறோம், மேலும் எங்கள் சேவைகளை மேம்படுத்துவதற்காக நாங்கள் பணியாற்றும்போது உங்கள் புரிதலைப் பாராட்டுகிறோம்.`,
      si: `කාර්ය සාධනය සහ ආරක්ෂාව වැඩිදියුණු කිරීම සඳහා මෙම සති අන්තයේදී නිශ්චිත පද්ධති නඩත්තු කටයුතු සිදු කරන බව කරුණාවෙන් දන්වන්නෙමු.

## නඩත්තු කාල පරතරය:
- **ආරම්භය**: සෙනසුරාදා, ජනවාරි 20, 2024, ප.ව. 10:00
- **අවසානය**: ඉරිදා, ජනවාරි 21, 2024, පෙ.ව. 2:00

මෙම කාලය තුළ පද්ධතිය භාවිතයට නොහැකි විය හැකිය. මෙය ඇති කළ හැකි ඕනෑම අසහනයක් සඳහා අපි සමාව අයදිමු, අපගේ සේවාවන් වැඩිදියුණු කිරීම සඳහා අප විසින් වැඩ කරන විට ඔබගේ අවබෝධය අපි අගය කරමු.`
    },
    excerpt: {
      en: 'Important information about upcoming system maintenance.',
      ta: 'வரவிருக்கும் கணினி பராமரிப்பு பற்றிய முக்கியமான தகவல்.',
      si: 'ඉදිරියේදී පැවැත්වෙන පද්ධති නඩත්තුව පිළිබඳව වැදගත් තොරතුරු.'
    },
    author: 'Admin Team',
    publishDate: '2024-01-08',
    status: 'published',
    category: 'Maintenance',
    readTime: 2,
    views: 432,
    isPinned: false,
    priority: 'medium',
    attachments: []
  },
  {
    id: '4',
    title: {
      en: 'New Health Clinic Opening',
      ta: 'புதிய சுகாதார மருத்துவமனை திறப்பு',
      si: 'නව සෞඛ්‍ය වෛද්‍යාලයක් විවෘත කිරීම'
    },
    content: {
      en: `We are pleased to announce the opening of a new health clinic in Ward 5. The clinic will provide comprehensive healthcare services to the community.

## Services Offered:
- General medical consultations
- Vaccination programs
- Health screening
- Emergency care
- Maternal and child health services

The clinic will be open from Monday to Saturday, 8:00 AM to 6:00 PM.`,
      ta: `வார்டு 5-ல் ஒரு புதிய சுகாதார மருத்துவமனை திறப்பதை அறிவித்து மகிழ்ச்சியடைகிறோம். இந்த மருத்துவமனை சமூகத்திற்கு விரிவான சுகாதாரப் பராமரிப்பு சேவைகளை வழங்கும்.

## வழங்கப்படும் சேவைகள்:
- பொது மருத்துவ ஆலோசனைகள்
- தடுப்பூசி திட்டங்கள்
- சுகாதார பரிசோதனை
- அவசர பராமரிப்பு
- தாய் மற்றும் குழந்தை சுகாதார சேவைகள்

இந்த மருத்துவமனை திங்கள் முதல் சனி வரை காலை 8:00 மணி முதல் மாலை 6:00 மணி வரை திறந்திருக்கும்.`,
      si: `වාර්ඩ් 5 හි නව සෞඛ්‍ය වෛද්‍යාලයක් විවෘත කිරීම ප්‍රකාශයට පත් කිරීමට අපි සතුටු වෙමු. වෛද්‍යාලය ප්‍රජාවට සවිස්තරාත්මක සෞඛ්‍ය සේවා සපයනු ඇත.

## ලබා දෙන සේවා:
- සාමාන්‍ය වෛද්‍ය පරීක්ෂා
- වැක්සිනීකරණ වැඩසටහන්
- සෞඛ්‍ය පරීක්ෂණ
- හදිසි සත්කාර
- මාතෘ හා ළමා සෞඛ්‍ය සේවා

වෛද්‍යාලය සඳුදා සිට සෙනසුරාදා දක්වා පෙ.ව. 8:00 සිට ප.ව. 6:00 දක්වා විවෘත වේ.`
    },
    excerpt: {
      en: 'New health clinic opening in Ward 5 with comprehensive services.',
      ta: 'வார்டு 5-ல் விரிவான சேவைகளுடன் புதிய சுகாதார மருத்துவமனை திறப்பு.',
      si: 'වාර්ඩ් 5 හි සවිස්තරාත්මක සේවා සහිත නව සෞඛ්‍ය වෛද්‍යාලයක් විවෘත වේ.'
    },
    author: 'Dr. Rajesh Kumar',
    publishDate: '2024-01-05',
    status: 'published',
    category: 'Health',
    readTime: 4,
    views: 678,
    isPinned: false,
    priority: 'high',
    attachments: ['clinic-schedule.pdf', 'services-list.docx']
  },
  {
    id: '5',
    title: {
      en: 'Educational Workshop Announcement',
      ta: 'கல்வி பட்டறை அறிவிப்பு',
      si: 'අධ්‍යාපන වැඩමුළු නිවේදනය'
    },
    content: {
      en: `We are organizing a free educational workshop on digital literacy for senior citizens. This workshop aims to help older adults become more comfortable with modern technology.

## Workshop Details:
- **Topic**: Digital Literacy for Seniors
- **Date**: February 3, 2024
- **Time**: 10:00 AM - 1:00 PM
- **Venue**: Community Library
- **Topics Covered**: Smartphone basics, Internet safety, Online banking, Social media

Registration is free but required due to limited seating.`,
      ta: `முதியவர்களுக்கான டிஜிட்டல் எழுத்தறிவு குறித்த இலவச கல்வி பட்டறையை நாங்கள் ஏற்பாடு செய்கிறோம். இந்த பட்டறை முதியவர்கள் நவீன தொழில்நுட்பத்தில் மேலும் வசதியாக இருக்க உதவும்.

## பட்டறை விவரங்கள்:
- **தலைப்பு**: முதியவர்களுக்கான டிஜிட்டல் எழுத்தறிவு
- **தேதி**: பிப்ரவரி 3, 2024
- **நேரம்**: காலை 10:00 மணி - 1:00 மணி
- **இடம்**: சமூக நூலகம்
- **உள்ளடக்கப்பட்ட தலைப்புகள்**: ஸ்மார்ட்போன் அடிப்படைகள், இணைய பாதுகாப்பு, ஆன்லைன் வங்கி, சமூக ஊடகங்கள்

பதிவு இலவசம் ஆனால் வரம்புக்குட்பட்ட இருக்கை இருப்பு காரணமாக தேவைப்படுகிறது.`,
      si: `වයස්ගත පුරවැසියන් සඳහා ඩිජිටල් සාක්ෂරතාවය පිළිබඳ නොමිලේ අධ්‍යාපන වැඩමුළුවක් සංවිධානය කරන්නෙමු. මෙම වැඩමුළුව වයස්ගත වැඩිහිටියන් නවීන තාක්ෂණය සමඟ වඩාත් සුවපහසු වීමට උපකාරී වේ.

## වැඩමුළු විස්තර:
- **විෂය**: වයස්ගතයන් සඳහා ඩිජිටල් සාක්ෂරතාවය
- **දිනය**: පෙබරවාරි 3, 2024
- **වේලාව**: පෙ.ව. 10:00 - 1:00
- **ස්ථානය**: ප්‍රජා පුස්තකාලය
- **ආවරණය වන විෂයන්**: ස්මාර්ට්ෆෝන මූලික කරුණු, අන්තර්ජාල ආරක්ෂාව, අන්ලයින් බැංකුකරණය, සමාජ මාධ්‍ය

ලියාපදිංචි වීම නොමිලේ නමුත් සීමිත ආසන ප්‍රමාණය හේතුවෙන් අවශ්‍ය වේ.`
    },
    excerpt: {
      en: 'Free digital literacy workshop for senior citizens.',
      ta: 'முதியவர்களுக்கான இலவச டிஜிட்டல் எழுத்தறிவு பட்டறை.',
      si: 'වයස්ගත පුරවැසියන් සඳහා නොමිලේ ඩිජිටල් සාක්ෂරතා වැඩමුළුව.'
    },
    author: 'Education Department',
    publishDate: '2024-01-03',
    status: 'draft',
    category: 'Education',
    readTime: 3,
    views: 234,
    isPinned: false,
    priority: 'low',
    attachments: ['workshop-brochure.pdf']
  },
  {
    id: '6',
    title: {
      en: 'Road Construction Update',
      ta: 'சாலை கட்டுமான புதுப்பிப்பு',
      si: 'මාර්ග ඉදිකිරීම් යාවත්කාලීන කිරීම'
    },
    content: {
      en: `Important update regarding the ongoing road construction project on Main Street. The project is progressing well and we expect completion by the end of February.

## Current Status:
- Phase 1: Completed (Drainage system)
- Phase 2: In progress (Road foundation)
- Phase 3: Scheduled (Paving and markings)

Please follow the temporary traffic arrangements and drive carefully in the construction zone.`,
      ta: `மெயின் தெருவில் நடைபெறும் சாலை கட்டுமான திட்டம் தொடர்பான முக்கியமான புதுப்பிப்பு. திட்டம் நன்றாக முன்னேறுகிறது மற்றும் பிப்ரவரி இறுதிக்குள் நிறைவடையும் என்று எதிர்பார்க்கிறோம்.

## தற்போதைய நிலை:
- கட்டம் 1: முடிந்தது (வடிகால் அமைப்பு)
- கட்டம் 2: நடந்து கொண்டிருக்கிறது (சாலை அடித்தளம்)
- கட்டம் 3: திட்டமிடப்பட்டது (பாவுதல் மற்றும் குறியீடுகள்)

தற்காலிக போக்குவரத்து ஏற்பாடுகளைப் பின்பற்றவும் மற்றும் கட்டுமான மண்டலத்தில் கவனமாக வாகனம் ஓட்டவும்.`,
      si: `ප්‍රධාන වීදියේ සිදුවෙමින් පවතින මාර්ග ඉදිකිරීම් ව්‍යාපෘතිය සම්බන්ධයෙන් වැදගත් යාවත්කාලීන කිරීමකි. ව්‍යාපෘතිය හොඳින් ප්‍රගති වෙමින් පවතින අතර පෙබරවාරි අවසන් වන විට නිම කිරීම අප අපේක්ෂා කරමු.

## වර්තමාන තත්ත්වය:
- 1 වන අදියර: නිමි (ජලාපවහන පද්ධතිය)
- 2 වන අදියර: සිදු වෙමින් පවතී (මාර්ග පදනම)
- 3 වන අදියර: සැලසුම් කර ඇත (පaving යාම සහ සලකුණු කිරීම)

කරුණාකර තාවකාලික ගමනාගමන අනුවිතයන් පිළිපදින්න සහ ඉදිකිරීම් කලාපය තුළ ප්‍රවේශමෙන් පැදි ගැනීමට යන්න.`
    },
    excerpt: {
      en: 'Update on Main Street road construction progress.',
      ta: 'மெயின் தெரு சாலை கட்டுமான முன்னேற்றம் குறித்த புதுப்பிப்பு.',
      si: 'ප්‍රධාන වීදියේ මාර්ග ඉදිකිරීම් ප්‍රගතිය පිළිබඳ යාවත්කාලීන කිරීම.'
    },
    author: 'Public Works Department',
    publishDate: '2024-01-01',
    status: 'published',
    category: 'Infrastructure',
    readTime: 2,
    views: 543,
    isPinned: false,
    priority: 'medium',
    attachments: ['construction-map.pdf', 'traffic-plan.docx']
  }
];

// Utility Functions
const getPriorityColor = (priority: string) => {
  const colors = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200'
  };
  return colors[priority as keyof typeof colors] || colors.medium;
};

const getStatusColor = (status: string) => {
  const colors = {
    published: 'bg-green-100 text-green-800 border-green-200',
    draft: 'bg-blue-100 text-blue-800 border-blue-200',
    archived: 'bg-gray-100 text-gray-800 border-gray-200'
  };
  return colors[status as keyof typeof colors] || colors.draft;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Helper function to safely get text with fallback
const getLocalizedText = (content: NewsContent, language: Language, fallback: string = 'No translation') => {
  return content?.[language]?.trim() || fallback;
};

const getPreviewText = (content: NewsContent, language: Language, maxLength: number = 15) => {
  const text = getLocalizedText(content, language, '');
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
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

const StatCard = ({ title, value, icon: Icon, description, trend }: { 
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

const AlertMessage = ({ type, title, message }: { type: 'error' | 'success'; title: string; message: string }) => {
  const styles = {
    error: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-green-50 border-green-200 text-green-800'
  };
  
  return (
    <div className={`border rounded-md p-4 ${styles[type]}`}>
      <div className="flex items-center">
        {type === 'error' ? <AlertCircle className="w-5 h-5 mr-2" /> : <CheckCircle className="w-5 h-5 mr-2" />}
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
  onView, 
  onEdit, 
  onDelete,
  currentLanguage 
}: { 
  article: NewsArticle;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  currentLanguage: Language;
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
        {getLocalizedText(article.title, currentLanguage, article.title.en)}
      </CardTitle>
      <CardDescription className="line-clamp-3">
        {getLocalizedText(article.excerpt, currentLanguage, article.excerpt.en)}
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

      {/* Language Indicators */}
      <div className="flex gap-2 mt-3">
        <Badge variant="outline" className="text-xs bg-gray-50">
          TA: {getPreviewText(article.title, 'ta')}
        </Badge>
        <Badge variant="outline" className="text-xs bg-gray-50">
          SI: {getPreviewText(article.title, 'si')}
        </Badge>
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

export default function NewsListPage() {
  // State
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsArticle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [articleToDelete, setArticleToDelete] = useState<NewsArticle | null>(null);
  const [dialogState, setDialogState] = useState({ create: false, view: false, edit: false, delete: false });
  const [message, setMessage] = useState({ type: '', text: '' });

  const [newArticle, setNewArticle] = useState({
    title: { en: '', ta: '', si: '' },
    content: { en: '', ta: '', si: '' },
    excerpt: { en: '', ta: '', si: '' },
    author: '',
    category: '',
    status: 'draft' as const,
    priority: 'medium' as const,
    isPinned: false
  });

  const [statistics, setStatistics] = useState<Statistics>({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    archivedArticles: 0,
    totalViews: 0,
    averageReadTime: 0,
    pinnedArticles: 0
  });

  // Calculate statistics
  const calculateStatistics = (newsData: NewsArticle[]) => {
    const totalArticles = newsData.length;
    const publishedArticles = newsData.filter(article => article.status === 'published').length;
    const draftArticles = newsData.filter(article => article.status === 'draft').length;
    const archivedArticles = newsData.filter(article => article.status === 'archived').length;
    const totalViews = newsData.reduce((sum, article) => sum + article.views, 0);
    const averageReadTime = totalArticles > 0 
      ? Math.round(newsData.reduce((sum, article) => sum + article.readTime, 0) / totalArticles * 10) / 10 
      : 0;
    const pinnedArticles = newsData.filter(article => article.isPinned).length;

    return {
      totalArticles,
      publishedArticles,
      draftArticles,
      archivedArticles,
      totalViews,
      averageReadTime,
      pinnedArticles
    };
  };

  useEffect(() => {
    const savedNews = localStorage.getItem('newsArticles');
    if (savedNews) {
      const newsData = JSON.parse(savedNews);
      setNews(newsData);
      setStatistics(calculateStatistics(newsData));
    } else {
      setNews(SAMPLE_NEWS);
      setStatistics(calculateStatistics(SAMPLE_NEWS));
      localStorage.setItem('newsArticles', JSON.stringify(SAMPLE_NEWS));
    }
  }, []);

  useEffect(() => {
    const filtered = news.filter(article =>
      Object.values(article.title).some(title => 
        title?.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      Object.values(article.excerpt).some(excerpt =>
        excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      article.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNews(filtered);
    setStatistics(calculateStatistics(news));
  }, [searchTerm, news]);

  // Handlers
  const validateArticle = (): string | null => {
    const missingFields = [];
    
    if (!newArticle.category) missingFields.push('Category');
    if (!newArticle.author.trim()) missingFields.push('Author');
    
    LANGUAGES.forEach(lang => {
      if (!newArticle.title[lang.value]?.trim()) missingFields.push(`${lang.label} Title`);
      if (!newArticle.content[lang.value]?.trim()) missingFields.push(`${lang.label} Content`);
      if (!newArticle.excerpt[lang.value]?.trim()) missingFields.push(`${lang.label} Excerpt`);
    });

    return missingFields.length > 0 ? `Please fill in: ${missingFields.join(', ')}` : null;
  };

  const handleCreateArticle = () => {
    const error = validateArticle();
    if (error) {
      setMessage({ type: 'error', text: error });
      return;
    }

    const article: NewsArticle = {
      id: Date.now().toString(),
      ...newArticle,
      publishDate: new Date().toISOString().split('T')[0],
      readTime: Math.ceil(newArticle.content.en.split(' ').length / 200),
      views: 0,
      attachments: []
    };
    
    const updatedNews = [article, ...news];
    setNews(updatedNews);
    localStorage.setItem('newsArticles', JSON.stringify(updatedNews));
    setStatistics(calculateStatistics(updatedNews));
    
    resetForm();
    setMessage({ type: 'success', text: 'Article created successfully!' });
    setTimeout(() => setMessage({ type: '', text: '' }), 2000);
  };

  const handleUpdateArticle = () => {
    const error = validateArticle();
    if (error) {
      setMessage({ type: 'error', text: error });
      return;
    }

    if (!selectedArticle) return;

    const updatedNews = news.map(article =>
      article.id === selectedArticle.id 
        ? { 
            ...article, 
            ...newArticle,
            readTime: Math.ceil(newArticle.content.en.split(' ').length / 200)
          }
        : article
    );

    setNews(updatedNews);
    localStorage.setItem('newsArticles', JSON.stringify(updatedNews));
    setStatistics(calculateStatistics(updatedNews));
    
    resetForm();
    setMessage({ type: 'success', text: 'Article updated successfully!' });
    setTimeout(() => setMessage({ type: '', text: '' }), 2000);
  };

  const handleDeleteArticle = () => {
    if (!articleToDelete) return;
    const updatedNews = news.filter(article => article.id !== articleToDelete.id);
    setNews(updatedNews);
    localStorage.setItem('newsArticles', JSON.stringify(updatedNews));
    setStatistics(calculateStatistics(updatedNews));
    setDialogState(prev => ({ ...prev, delete: false }));
  };

  const resetForm = () => {
    setNewArticle({
      title: { en: '', ta: '', si: '' },
      content: { en: '', ta: '', si: '' },
      excerpt: { en: '', ta: '', si: '' },
      author: '',
      category: '',
      status: 'draft',
      priority: 'medium',
      isPinned: false
    });
  };

  const openDialog = (type: keyof typeof dialogState, article?: NewsArticle) => {
    if (article) setSelectedArticle(article);
    if (type === 'edit' && article) {
      setNewArticle({
        title: article.title,
        content: article.content,
        excerpt: article.excerpt,
        author: article.author,
        category: article.category,
        status: article.status,
        priority: article.priority || 'medium',
        isPinned: article.isPinned || false
      });
    }
    if (type === 'view' && article) {
      const updatedNews = news.map(item =>
        item.id === article.id ? { ...item, views: item.views + 1 } : item
      );
      setNews(updatedNews);
      localStorage.setItem('newsArticles', JSON.stringify(updatedNews));
      setStatistics(calculateStatistics(updatedNews));
    }
    if (type === 'delete' && article) {
      setArticleToDelete(article);
    }
    setDialogState(prev => ({ ...prev, [type]: true }));
  };

  const closeDialog = (type: keyof typeof dialogState) => {
    setDialogState(prev => ({ ...prev, [type]: false }));
    setMessage({ type: '', text: '' });
    if (type === 'create' || type === 'edit') resetForm();
  };

  const updateArticleField = (field: string, value: string) => {
    setNewArticle(prev => ({ ...prev, [field]: value }));
  };

  const updateArticleContent = (field: 'title' | 'content' | 'excerpt', value: string) => {
    setNewArticle(prev => ({
      ...prev,
      [field]: { ...prev[field], [selectedLanguage]: value }
    }));
  };

  const getLanguageLabel = (lang: Language) => {
    return LANGUAGES.find(l => l.value === lang)?.label || lang;
  };

  // Form Fields Component
  const ArticleFormFields = () => (
    <div className="grid gap-4 py-4">
      {/* Language Tabs */}
      <LanguageTabs value={selectedLanguage} onValueChange={setSelectedLanguage} />

      {/* Title Input */}
      <div className="grid gap-2">
        <label htmlFor="title" className="text-sm font-medium">
          Title ({getLanguageLabel(selectedLanguage)}) *
        </label>
        <Input
          id="title"
          value={newArticle.title[selectedLanguage] || ''}
          onChange={(e) => updateArticleContent('title', e.target.value)}
          placeholder={`Enter title in ${getLanguageLabel(selectedLanguage)}`}
          className={!newArticle.title[selectedLanguage]?.trim() && message.type === 'error' ? "border-red-500" : ""}
        />
        {!newArticle.title[selectedLanguage]?.trim() && message.type === 'error' && (
          <p className="text-red-500 text-sm">Title is required in {getLanguageLabel(selectedLanguage)}</p>
        )}
      </div>

      {/* Excerpt Input */}
      <div className="grid gap-2">
        <label htmlFor="excerpt" className="text-sm font-medium">
          Excerpt ({getLanguageLabel(selectedLanguage)}) *
        </label>
        <Input
          id="excerpt"
          value={newArticle.excerpt[selectedLanguage] || ''}
          onChange={(e) => updateArticleContent('excerpt', e.target.value)}
          placeholder={`Brief description in ${getLanguageLabel(selectedLanguage)}`}
          className={!newArticle.excerpt[selectedLanguage]?.trim() && message.type === 'error' ? "border-red-500" : ""}
        />
        {!newArticle.excerpt[selectedLanguage]?.trim() && message.type === 'error' && (
          <p className="text-red-500 text-sm">Excerpt is required in {getLanguageLabel(selectedLanguage)}</p>
        )}
      </div>

      {/* Content Input */}
      <div className="grid gap-2">
        <label htmlFor="content" className="text-sm font-medium">
          Content ({getLanguageLabel(selectedLanguage)}) *
        </label>
        <Textarea
          id="content"
          value={newArticle.content[selectedLanguage] || ''}
          onChange={(e) => updateArticleContent('content', e.target.value)}
          placeholder={`Write content in ${getLanguageLabel(selectedLanguage)}...`}
          rows={8}
          className={!newArticle.content[selectedLanguage]?.trim() && message.type === 'error' ? "border-red-500" : ""}
        />
        {!newArticle.content[selectedLanguage]?.trim() && message.type === 'error' && (
          <p className="text-red-500 text-sm">Content is required in {getLanguageLabel(selectedLanguage)}</p>
        )}
      </div>

      {/* Common Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <label htmlFor="author" className="text-sm font-medium">Author *</label>
          <Input
            id="author"
            value={newArticle.author}
            onChange={(e) => updateArticleField('author', e.target.value)}
            placeholder="Author name"
            className={!newArticle.author && message.type === 'error' ? "border-red-500" : ""}
          />
          {!newArticle.author && message.type === 'error' && (
            <p className="text-red-500 text-sm">Author is required</p>
          )}
        </div>
        <div className="grid gap-2">
          <label htmlFor="category" className="text-sm font-medium">Category *</label>
          <Select value={newArticle.category} onValueChange={(value) => updateArticleField('category', value)}>
            <SelectTrigger className={!newArticle.category && message.type === 'error' ? "border-red-500" : ""}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!newArticle.category && message.type === 'error' && (
            <p className="text-red-500 text-sm">Category is required</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <label htmlFor="status" className="text-sm font-medium">Status</label>
          <Select value={newArticle.status} onValueChange={(value: 'published' | 'draft') => updateArticleField('status', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <label htmlFor="priority" className="text-sm font-medium">Priority</label>
          <Select value={newArticle.priority} onValueChange={(value: 'low' | 'medium' | 'high') => updateArticleField('priority', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={newArticle.isPinned}
          onCheckedChange={(checked) => updateArticleField('isPinned', checked.toString())}
        />
        <label htmlFor="isPinned" className="text-sm font-medium">Pin this article</label>
      </div>
    </div>
  );

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
              onView={() => openDialog('view', article)}
              onEdit={() => openDialog('edit', article)}
              onDelete={() => openDialog('delete', article)}
              currentLanguage={currentLanguage}
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
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              <DialogHeader className="flex-shrink-0">
                <DialogTitle>
                  {dialogState.create ? 'Create New Article' : 'Edit Article'}
                </DialogTitle>
                <DialogDescription>
                  Fill in all details in all three languages. All language fields are required.
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex-1 overflow-y-auto">
                <ArticleFormFields />
              </div>

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

                {/* Language Tabs for Viewing */}
                <LanguageTabs value={currentLanguage} onValueChange={setCurrentLanguage} />
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {getLocalizedText(selectedArticle.title, currentLanguage, selectedArticle.title.en)}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {getLocalizedText(selectedArticle.excerpt, currentLanguage, selectedArticle.excerpt.en)}
                    </p>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                        {getLocalizedText(selectedArticle.content, currentLanguage, selectedArticle.content.en)}
                      </p>
                    </div>
                  </div>
                </div>
                
                {selectedArticle.attachments && selectedArticle.attachments.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Attachments ({selectedArticle.attachments.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedArticle.attachments.map((attachment, index) => (
                        <Badge key={index} variant="outline" className="cursor-pointer hover:bg-gray-100 px-3 py-1">
                          {attachment}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
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
        {dialogState.delete && articleToDelete && (
          <Dialog open={dialogState.delete} onOpenChange={() => closeDialog('delete')}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete "{articleToDelete.title.en}"? This action cannot be undone.
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