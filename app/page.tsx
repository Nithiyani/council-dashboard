import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, Users, Calendar, Bell, Building2, Settings, Crown, BarChart3 } from 'lucide-react';

export default function Home() {
  // Redirect to login instead of showing the landing page
  // This will be handled by middleware, but we can also redirect here
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900">
            Municipal Admin
            <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent"> Dashboard</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Comprehensive administrative solution for managing council operations, 
            community events, public notices, and citizen services
          </p>
          <div className="pt-8">
            <Link href="/dashboard">
              <Button size="lg" className="px-8 py-4 text-lg">
                <LayoutDashboard className="w-5 h-5 mr-2" />
                Access Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Crown className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Chairman Management</CardTitle>
              <CardDescription>
                Manage chairman profile, messages, and achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Profile & biography management</li>
                <li>• Official message updates</li>
                <li>• Achievement tracking</li>
                <li>• Photo gallery</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-emerald-600" />
              </div>
              <CardTitle className="text-xl">Council Members</CardTitle>
              <CardDescription>
                Comprehensive member directory and role management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Member profiles & contact info</li>
                <li>• Ward assignments</li>
                <li>• Role-based permissions</li>
                <li>• Activity tracking</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-orange-600" />
              </div>
              <CardTitle className="text-xl">Events Management</CardTitle>
              <CardDescription>
                Plan and organize community events and meetings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Event scheduling & planning</li>
                <li>• Photo gallery integration</li>
                <li>• Attendee management</li>
                <li>• Publishing controls</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Notices & Announcements</CardTitle>
              <CardDescription>
                Manage public communications and announcements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Public notice creation</li>
                <li>• Scheduled publishing</li>
                <li>• Priority categorization</li>
                <li>• Archive management</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Building2 className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-xl">Departments & Services</CardTitle>
              <CardDescription>
                Organize departmental information and services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Department directory</li>
                <li>• Service catalogs</li>
                <li>• Document management</li>
                <li>• Contact information</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="w-8 h-8 text-indigo-600" />
              </div>
              <CardTitle className="text-xl">Analytics & Reports</CardTitle>
              <CardDescription>
                Comprehensive reporting and data insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Usage statistics</li>
                <li>• Activity logs</li>
                <li>• Performance metrics</li>
                <li>• Export capabilities</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Experience the power of modern municipal administration with our comprehensive dashboard solution
          </p>
          <Link href="/dashboard">
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-gray-900">
              Launch Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}