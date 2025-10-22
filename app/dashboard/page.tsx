"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Calendar,
  Bell,
  Image,
  Newspaper,
  Megaphone,
  Settings,
  TrendingUp,
  Activity,
  FileText,
  Building2,
  Users,
  Globe,
  Heart,
  Camera
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const dashboardData = [
  { name: 'Gallery', value: 22, color: '#10B981', icon: Image, href: '/dashboard/events/gallery' },
  { name: 'News', value: 25, color: '#F59E0B', icon: Newspaper, href: '/dashboard/events/news' },
  { name: 'Announcements', value: 18, color: '#EF4444', icon: Megaphone, href: '/dashboard/events/announcements' },
  { name: 'Notices', value: 25, color: '#8B5CF6', icon: Bell, href: '/dashboard/events/notices' },
  { name: 'Services', value: 35, color: '#3B82F6', icon: Settings, href: '/dashboard/information/services' },
  { name: 'Tourism', value: 22, color: '#06B6D4', icon: Globe, href: '/dashboard/information/tourism' },
  { name: 'Ads', value: 18, color: '#84CC16', icon: Megaphone, href: '/dashboard/information/ads' },
  { name: 'Social Work', value: 28, color: '#EC4899', icon: Heart, href: '/dashboard/information/social_work' },
];

const activityData = [
  { name: 'Mon', activities: 45 },
  { name: 'Tue', activities: 68 },
  { name: 'Wed', activities: 52 },
  { name: 'Thu', activities: 75 },
  { name: 'Fri', activities: 60 },
  { name: 'Sat', activities: 38 },
  { name: 'Sun', activities: 25 },
];

const categoryData = [
  { name: 'Gallery', value: 22, color: '#10B981' },
  { name: 'News', value: 25, color: '#F59E0B' },
  { name: 'Announcements', value: 18, color: '#EF4444' },
  { name: 'Notices', value: 25, color: '#8B5CF6' },
  { name: 'Services', value: 35, color: '#3B82F6' },
  { name: 'Tourism', value: 22, color: '#06B6D4' },
  { name: 'Ads', value: 18, color: '#84CC16' },
  { name: 'Social Work', value: 28, color: '#EC4899' },
];

const monthlyData = [
  { name: 'Jan', gallery: 8, news: 12, announcements: 6, notices: 12, services: 18, tourism: 10, ads: 8, socialWork: 15 },
  { name: 'Feb', gallery: 12, news: 8, announcements: 9, notices: 15, services: 22, tourism: 12, ads: 10, socialWork: 18 },
  { name: 'Mar', gallery: 15, news: 14, announcements: 12, notices: 8, services: 25, tourism: 15, ads: 12, socialWork: 20 },
  { name: 'Apr', gallery: 10, news: 16, announcements: 8, notices: 20, services: 30, tourism: 18, ads: 15, socialWork: 22 },
  { name: 'May', gallery: 18, news: 20, announcements: 15, notices: 18, services: 28, tourism: 20, ads: 18, socialWork: 25 },
  { name: 'Jun', gallery: 22, news: 25, announcements: 18, notices: 25, services: 35, tourism: 22, ads: 20, socialWork: 28 },
];

// Quick Action Button component
interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const QuickAction = ({ icon, label, href }: QuickActionProps) => {
  const router = useRouter();
  
  return (
    <Button 
      variant="outline" 
      className="h-20 flex flex-col items-center justify-center space-y-2 p-2 hover:shadow-md transition-all duration-200 hover:scale-105"
      onClick={() => router.push(href)}
    >
      <div className="w-6 h-6 flex items-center justify-center">
        {icon}
      </div>
      <span className="text-xs text-center leading-tight font-medium">{label}</span>
    </Button>
  );
};

export default function DashboardPage() {
  const router = useRouter();

  const quickActions = [
    {
      icon: <Image className="w-6 h-6 text-emerald-600" />,
      label: "Gallery",
      href: "/dashboard/events/gallery"
    },
    {
      icon: <Newspaper className="w-6 h-6 text-amber-600" />,
      label: "News",
      href: "/dashboard/events/news"
    },
    {
      icon: <Megaphone className="w-6 h-6 text-red-600" />,
      label: "Announcements",
      href: "/dashboard/events/announcements"
    },
    {
      icon: <Bell className="w-6 h-6 text-violet-600" />,
      label: "Notices",
      href: "/dashboard/events/notices"
    },
    {
      icon: <Settings className="w-6 h-6 text-blue-600" />,
      label: "Services",
      href: "/dashboard/information/services"
    },
    {
      icon: <Globe className="w-6 h-6 text-cyan-600" />,
      label: "Tourism",
      href: "/dashboard/information/tourism"
    },
    {
      icon: <Megaphone className="w-6 h-6 text-lime-600" />,
      label: "Ads",
      href: "/dashboard/information/ads"
    },
    {
      icon: <Heart className="w-6 h-6 text-pink-600" />,
      label: "Social Work",
      href: "/dashboard/information/social_work"
    }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome to the administrative dashboard</p>
      </div>

      {/* Quick Stats - All 8 categories */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8">
        {dashboardData.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-sm hover:scale-105 bg-gradient-to-br from-white to-gray-50"
              onClick={() => router.push(item.href)}
            >
              <CardContent className="p-4">
                <div className="flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${item.color}15` }}>
                    <IconComponent className="w-6 h-6" style={{ color: item.color }} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                    <p className="text-sm font-semibold text-gray-700">{item.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Activity Chart */}
        <Card className="hover:shadow-lg transition-shadow border-0 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white rounded-t-lg">
            <CardTitle className="text-lg font-semibold">Content Overview</CardTitle>
            <CardDescription>All content types over time</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={monthlyData} 
                  margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    interval={0}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="gallery" fill="#10B981" name="Gallery" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="news" fill="#F59E0B" name="News" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="announcements" fill="#EF4444" name="Announcements" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="notices" fill="#8B5CF6" name="Notices" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="services" fill="#3B82F6" name="Services" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="tourism" fill="#06B6D4" name="Tourism" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="ads" fill="#84CC16" name="Ads" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="socialWork" fill="#EC4899" name="Social Work" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Activity Trend */}
        <Card className="hover:shadow-lg transition-shadow border-0 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white rounded-t-lg">
            <CardTitle className="text-lg font-semibold">Weekly Activity Trend</CardTitle>
            <CardDescription>Overall platform engagement</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="activities"
                    stroke="#3B82F6"
                    fill="url(#colorUv)"
                    fillOpacity={0.3}
                  />
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Distribution and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Distribution */}
        <Card className="hover:shadow-lg transition-shadow border-0 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white rounded-t-lg">
            <CardTitle className="text-lg font-semibold">Content Distribution</CardTitle>
            <CardDescription>By content type</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    dataKey="value"
                    labelLine={false}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2 hover:shadow-lg transition-shadow border-0 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white rounded-t-lg">
            <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
            <CardDescription>Latest updates and actions</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Image className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">Gallery album created</p>
                  <p className="text-sm text-gray-500">Community Garden Photos</p>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">2 min ago</Badge>
              </div>
              
              <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <Newspaper className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">News article published</p>
                  <p className="text-sm text-gray-500">Infrastructure Development Update</p>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700">1 hour ago</Badge>
              </div>

              <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Megaphone className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">Announcement posted</p>
                  <p className="text-sm text-gray-500">Public Hearing Schedule</p>
                </div>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">3 hours ago</Badge>
              </div>

              <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
                  <Bell className="w-5 h-5 text-violet-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">Notice issued</p>
                  <p className="text-sm text-gray-500">Office Holiday Schedule</p>
                </div>
                <Badge variant="secondary" className="bg-orange-100 text-orange-700">5 hours ago</Badge>
              </div>

              <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Settings className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">Service updated</p>
                  <p className="text-sm text-gray-500">Online Permit Application</p>
                </div>
                <Badge variant="secondary" className="bg-gray-100 text-gray-700">1 day ago</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="hover:shadow-lg transition-shadow border-0 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white rounded-t-lg">
          <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {quickActions.map((action, index) => (
              <QuickAction
                key={index}
                icon={action.icon}
                label={action.label}
                href={action.href}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}