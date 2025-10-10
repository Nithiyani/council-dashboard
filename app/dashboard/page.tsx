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
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import {
  Users,
  Calendar,
  Bell,
  Download,
  TrendingUp,
  Eye,
  FileText,
  Activity,
  Crown,
  Building2
} from 'lucide-react';

// Types for chart data
interface DashboardData {
  name: string;
  users: number;
  events: number;
  notices: number;
}

interface VisitorsData {
  name: string;
  visitors: number;
}

interface DepartmentData {
  name: string;
  value: number;
  color: string;
}

// Chart data
const dashboardData: DashboardData[] = [
  { name: 'Jan', users: 400, events: 24, notices: 12 },
  { name: 'Feb', users: 300, events: 18, notices: 15 },
  { name: 'Mar', users: 500, events: 32, notices: 8 },
  { name: 'Apr', users: 450, events: 28, notices: 20 },
  { name: 'May', users: 600, events: 35, notices: 18 },
  { name: 'Jun', users: 750, events: 42, notices: 25 },
];

const visitorsData: VisitorsData[] = [
  { name: 'Mon', visitors: 1200 },
  { name: 'Tue', visitors: 1900 },
  { name: 'Wed', visitors: 1600 },
  { name: 'Thu', visitors: 2100 },
  { name: 'Fri', visitors: 1800 },
  { name: 'Sat', visitors: 1400 },
  { name: 'Sun', visitors: 1000 },
];

const departmentData: DepartmentData[] = [
  { name: 'Health', value: 35, color: '#3B82F6' },
  { name: 'Education', value: 25, color: '#10B981' },
  { name: 'Infrastructure', value: 20, color: '#F59E0B' },
  { name: 'Social Services', value: 15, color: '#EF4444' },
  { name: 'Others', value: 5, color: '#8B5CF6' },
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
      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-lg sm:text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Events</CardTitle>
            <Calendar className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-lg sm:text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8 this month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Notices</CardTitle>
            <Bell className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-lg sm:text-2xl font-bold">25</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <Activity className="h-3 w-3 mr-1" />
              5 published today
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Downloads</CardTitle>
            <Download className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-lg sm:text-2xl font-bold">1,254</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +23% this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Monthly Activity Chart */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Monthly Activity</CardTitle>
            <CardDescription className="text-sm">Users, Events, and Notices over time</CardDescription>
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
                  <Bar dataKey="users" fill="#3B82F6" name="Users" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="events" fill="#10B981" name="Events" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="notices" fill="#F59E0B" name="Notices" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Visitors */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Weekly Visitors</CardTitle>
            <CardDescription className="text-sm">Website traffic for the past week</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={visitorsData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="visitors"
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

      {/* Department Distribution and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Department Distribution */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Department Distribution</CardTitle>
            <CardDescription className="text-sm">Services by department</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    dataKey="value"
                    labelLine={false}
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {departmentData.map((item) => (
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
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="space-y-0 divide-y">
              <ActivityItem
                icon={<Users className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />}
                title="New council member added"
                description="John Smith from Ward 5"
                time="2 min ago"
              />
              
              <ActivityItem
                icon={<Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />}
                title="Community Meeting scheduled"
                description="July 15, 2025 at Town Hall"
                time="1 hour ago"
              />

              <ActivityItem
                icon={<Bell className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600" />}
                title="New notice published"
                description="Road closure announcement"
                time="3 hours ago"
              />

              <ActivityItem
                icon={<FileText className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />}
                title="Document uploaded"
                description="Budget Report 2025.pdf"
                time="5 hours ago"
              />
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
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
            <QuickAction
              icon={<Bell className="w-full h-full" />}
              label="Add Notice"
            />
            <QuickAction
              icon={<Calendar className="w-full h-full" />}
              label="New Event"
            />
            <QuickAction
              icon={<Users className="w-full h-full" />}
              label="Add Member"
            />
            <QuickAction
              icon={<FileText className="w-full h-full" />}
              label="Upload Doc"
            />
            <QuickAction
              icon={<Activity className="w-full h-full" />}
              label="View Reports"
            />
            <QuickAction
              icon={<Building2 className="w-full h-full" />}
              label="Departments"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}