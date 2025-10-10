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
  Building2
} from 'lucide-react';

const dashboardData = [
  { name: 'Jan', events: 24, gallery: 8, news: 12, announcements: 6, notices: 12, service: 18 },
  { name: 'Feb', events: 18, gallery: 12, news: 8, announcements: 9, notices: 15, service: 22 },
  { name: 'Mar', events: 32, gallery: 15, news: 14, announcements: 12, notices: 8, service: 25 },
  { name: 'Apr', events: 28, gallery: 10, news: 16, announcements: 8, notices: 20, service: 30 },
  { name: 'May', events: 35, gallery: 18, news: 20, announcements: 15, notices: 18, service: 28 },
  { name: 'Jun', events: 42, gallery: 22, news: 25, announcements: 18, notices: 25, service: 35 },
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
  { name: 'Events', value: 35, color: '#3B82F6' },
  { name: 'News', value: 25, color: '#10B981' },
  { name: 'Services', value: 20, color: '#F59E0B' },
  { name: 'Announcements', value: 15, color: '#EF4444' },
  { name: 'Gallery', value: 5, color: '#8B5CF6' },
];

// Activity item component
interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
}

const ActivityItem = ({ icon, title, description, time, badgeVariant = "secondary" }: ActivityItemProps) => (
  <div className="flex items-start space-x-3 sm:space-x-4 py-3">
    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
      <p className="text-sm text-gray-500 truncate">{description}</p>
    </div>
    <Badge variant={badgeVariant} className="flex-shrink-0 text-xs whitespace-nowrap">
      {time}
    </Badge>
  </div>
);

// Quick Action Button component
interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const QuickAction = ({ icon, label, onClick }: QuickActionProps) => (
  <Button 
    variant="outline" 
    className="h-16 sm:h-20 flex flex-col items-center space-y-1 sm:space-y-2 p-2"
    onClick={onClick}
  >
    <div className="w-5 h-5 sm:w-6 sm:h-6">
      {icon}
    </div>
    <span className="text-xs text-center leading-tight">{label}</span>
  </Button>
);

export default function DashboardPage() {
  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 text-sm sm:text-base mt-1">Welcome to the administrative dashboard</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-lg sm:text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8 this month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gallery</CardTitle>
            <Image className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">22</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <Activity className="h-3 w-3 mr-1" />
              3 new albums
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">News</CardTitle>
            <Newspaper className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +5 this week
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Announcements</CardTitle>
            <Megaphone className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <Activity className="h-3 w-3 mr-1" />
              2 active
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notices</CardTitle>
            <Bell className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-lg sm:text-2xl font-bold">25</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <Activity className="h-3 w-3 mr-1" />
              5 published today
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Services</CardTitle>
            <Settings className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">35</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +7 this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Monthly Activity Chart */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Monthly Content Overview</CardTitle>
            <CardDescription>All content types over time</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    interval={0}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="events" fill="#3B82F6" name="Events" />
                  <Bar dataKey="gallery" fill="#10B981" name="Gallery" />
                  <Bar dataKey="news" fill="#F59E0B" name="News" />
                  <Bar dataKey="announcements" fill="#EF4444" name="Announcements" />
                  <Bar dataKey="notices" fill="#8B5CF6" name="Notices" />
                  <Bar dataKey="service" fill="#06B6D4" name="Services" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Activity Trend */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Weekly Activity Trend</CardTitle>
            <CardDescription>Overall platform engagement</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
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
                    fill="#3B82F6"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Distribution and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Distribution */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Content Distribution</CardTitle>
            <CardDescription>By content type</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="h-48 sm:h-64">
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
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs sm:text-sm truncate">{item.name}</span>
                  </div>
                  <span className="text-xs sm:text-sm font-medium flex-shrink-0">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2 hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
            <CardDescription className="text-sm">Latest updates and actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New event scheduled</p>
                  <p className="text-sm text-gray-500">Summer Festival 2025 - July 15</p>
                </div>
                <Badge variant="secondary">2 min ago</Badge>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Image className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Gallery album created</p>
                  <p className="text-sm text-gray-500">Community Garden Photos</p>
                </div>
                <Badge variant="secondary">1 hour ago</Badge>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Newspaper className="w-4 h-4 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">News article published</p>
                  <p className="text-sm text-gray-500">Infrastructure Development Update</p>
                </div>
                <Badge variant="secondary">3 hours ago</Badge>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Megaphone className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New announcement</p>
                  <p className="text-sm text-gray-500">Public Hearing Schedule</p>
                </div>
                <Badge variant="secondary">5 hours ago</Badge>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Settings className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Service updated</p>
                  <p className="text-sm text-gray-500">Online Permit Application</p>
                </div>
                <Badge variant="secondary">1 day ago</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
          <CardDescription className="text-sm">Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center space-y-2">
              <Calendar className="w-6 h-6" />
              <span className="text-xs">Add Event</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center space-y-2">
              <Image className="w-6 h-6" />
              <span className="text-xs">Manage Gallery</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center space-y-2">
              <Newspaper className="w-6 h-6" />
              <span className="text-xs">Create News</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center space-y-2">
              <Megaphone className="w-6 h-6" />
              <span className="text-xs">Post Announcement</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center space-y-2">
              <Bell className="w-6 h-6" />
              <span className="text-xs">Add Notice</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center space-y-2">
              <Settings className="w-6 h-6" />
              <span className="text-xs">Manage Services</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}