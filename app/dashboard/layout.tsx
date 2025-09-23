"use client";

import { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Bell,
  Building2,
  Images,
  FileText,
  UserCog,
  BarChart3,
  Settings,
  Menu,
  X,
  Crown,
  ChevronDown,
  Home,
  MapPin,
  Globe,
  Info,
  FolderTree
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';


interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  children?: NavigationItem[];
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());
  const pathname = usePathname();
  const router = useRouter();


  const navigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Chairman', href: '/dashboard/chairman', icon: Crown },
    { name: 'Council Members', href: '/dashboard/members', icon: Users },
    { 
      name: 'Events', 
      href: '/dashboard/events', 
      icon: Calendar,
      children: [
        { name: 'gallery', href: '/dashboard/events/gallery', icon: Images },
        { name: 'news', href: '/dashboard/events/news', icon: FileText },
        { name: 'announcements', href: '/dashboard/events/announcements', icon: Bell },
        { name: 'notices', href: '/dashboard/events/notices', icon: Bell },
      ]
    },
    { name: 'Departments', href: '/dashboard/departments', icon: Building2 },
    { name: 'Gallery', href: '/dashboard/gallery', icon: Images },
    { name: 'Documents', href: '/dashboard/documents', icon: FileText },
    { 
      name: 'Information', 
      href: '/dashboard/information', 
      icon: Info,
      children: [
        { name: 'services', href: '/dashboard/information/services', icon: FolderTree },
        { name: 'tourism', href: '/dashboard/information/tourism', icon: Globe },
        { name: 'ads', href: '/dashboard/information/ads', icon: MapPin },
       
       
      ]
    },
    { name: 'User Management', href: '/dashboard/users', icon: UserCog },
    { name: 'Reports & Logs', href: '/dashboard/reports', icon: BarChart3 },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  // Check authentication on mount
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [router]);

  const toggleDropdown = (itemName: string) => {
    setOpenDropdowns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemName)) {
        newSet.delete(itemName);
      } else {
        newSet.add(itemName);
      }
      return newSet;
    });
  };

  const isDropdownOpen = (itemName: string) => openDropdowns.has(itemName);

  const isActiveLink = (href: string) => pathname === href;

  const isActiveParent = (item: NavigationItem) => {
    if (item.children) {
      return item.children.some(child => isActiveLink(child.href));
    }
    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('rememberMe');
    router.push('/login');
  };

  const renderNavigationItem = (item: NavigationItem, isMobile = false) => {
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isActive = isActiveLink(item.href) || isActiveParent(item);
    const isOpen = isDropdownOpen(item.name);

    if (isMobile) {
      return (
        <div key={item.name}>
          {hasChildren ? (
            <div className="space-y-1">
              <button
                onClick={() => toggleDropdown(item.name)}
                className={cn(
                  "group flex w-full items-center justify-between rounded-md px-2 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary border-r-2 border-primary"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <div className="flex items-center">
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isOpen ? "rotate-180" : ""
                  )}
                />
              </button>
              {isOpen && (
                <div className="ml-6 space-y-1 border-l-2 border-gray-200 pl-3">
                  {item.children!.map((child) => {
                    const ChildIcon = child.icon;
                    const isChildActive = isActiveLink(child.href);
                    return (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={cn(
                          "group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors",
                          isChildActive
                            ? "bg-primary/10 text-primary"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <ChildIcon className="mr-3 h-4 w-4" />
                        {child.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <Link
              href={item.href}
              className={cn(
                "group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary border-r-2 border-primary"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )}
        </div>
      );
    }

    // Desktop version
    return (
      <li key={item.name}>
        {hasChildren ? (
          <div className="space-y-1">
            <button
              onClick={() => toggleDropdown(item.name)}
              className={cn(
                "group flex w-full items-center justify-between rounded-md p-2 text-sm leading-6 font-semibold transition-all",
                isActive
                  ? "bg-primary/10 text-primary border-r-2 border-primary"
                  : "text-gray-700 hover:text-primary hover:bg-gray-50"
              )}
            >
              <div className="flex items-center gap-x-3">
                <Icon className="h-5 w-5 shrink-0" />
                {item.name}
              </div>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  isOpen ? "rotate-180" : ""
                )}
              />
            </button>
            {isOpen && (
              <div className="ml-6 space-y-1 border-l-2 border-gray-200 pl-3">
                {item.children!.map((child) => {
                  const ChildIcon = child.icon;
                  const isChildActive = isActiveLink(child.href);
                  return (
                    <Link
                      key={child.name}
                      href={child.href}
                      className={cn(
                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-all",
                        isChildActive
                          ? "bg-primary/10 text-primary"
                          : "text-gray-700 hover:text-primary hover:bg-gray-50"
                      )}
                    >
                      <ChildIcon className="h-4 w-4 shrink-0" />
                      {child.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <Link
            href={item.href}
            className={cn(
              "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-all",
              isActive
                ? "bg-primary/10 text-primary border-r-2 border-primary"
                : "text-gray-700 hover:text-primary hover:bg-gray-50"
            )}
          >
            <Icon className="h-5 w-5 shrink-0" />
            {item.name}
          </Link>
        )}
      </li>
    );
  };

  return (
    <div className="h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden",
        sidebarOpen ? "block" : "hidden"
      )}>
        <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white">
          <div className="flex h-16 items-center justify-between px-6">
            <span className="text-xl font-semibold text-gray-900">Admin Panel</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <ScrollArea className="flex-1 h-[calc(100vh-4rem)]">
            <nav className="space-y-1 px-4 py-4">
              {navigation.map((item) => renderNavigationItem(item, true))}
            </nav>
          </ScrollArea>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <span className="text-xl font-semibold text-gray-900">Admin Panel</span>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => renderNavigationItem(item))}
                </ul>
              </li>
              
              {/* User info section */}
              <li className="mt-auto">
                <div className="flex items-center gap-x-3 p-2 text-sm text-gray-700">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">A</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">Admin User</p>
                    <p className="text-gray-500 truncate">admin@mannar.gov.lk</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full mt-2 text-gray-600 hover:text-gray-900"
                >
                  Logout
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />
            </div>
            <div className="flex flex-1"></div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="flex items-center gap-x-4">
                <div className="hidden lg:flex items-center gap-x-2">
                  <span className="text-sm font-medium text-gray-700">Welcome, Admin</span>
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">A</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900 lg:hidden"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}