"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Mail, User, MessageSquare, Eye, EyeOff } from "lucide-react";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  status: "new" | "read";
  timestamp: string;
}

export default function ContactDashboard() {
  const [messages, setMessages] = useState<ContactMessage[]>([
    { 
      id: 1, 
      name: "John Smith", 
      email: "john@example.com", 
      message: "Hello! I would like to inquire about your pricing plans for the enterprise package.", 
      status: "new",
      timestamp: "2024-01-15T10:30:00"
    },
    { 
      id: 2, 
      name: "Jane Doe", 
      email: "jane@example.com", 
      message: "Need more information about your API documentation and integration process.", 
      status: "read",
      timestamp: "2024-01-14T14:22:00"
    },
    { 
      id: 3, 
      name: "Mike Johnson", 
      email: "mike@techcorp.com", 
      message: "We're experiencing issues with the dashboard analytics. Can you help?",
      status: "new",
      timestamp: "2024-01-15T09:15:00"
    },
  ]);

  const [search, setSearch] = useState("");

  const filteredMessages = useMemo(() => {
    if (!search) return messages;
    
    const searchLower = search.toLowerCase();
    return messages.filter(
      (msg) =>
        msg.name.toLowerCase().includes(searchLower) ||
        msg.email.toLowerCase().includes(searchLower) ||
        msg.message.toLowerCase().includes(searchLower)
    );
  }, [messages, search]);

  const markAsRead = (id: number) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, status: "read" } : msg))
    );
  };

  const markAllAsRead = () => {
    setMessages((prev) =>
      prev.map((msg) => ({ ...msg, status: "read" }))
    );
  };

  const newMessagesCount = messages.filter(msg => msg.status === "new").length;

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return "Invalid date";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
              Contact Dashboard
            </h1>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
              Manage and respond to customer messages
              {newMessagesCount > 0 && (
                <span className="ml-2 text-sm font-medium text-blue-600 whitespace-nowrap">
                  ({newMessagesCount} new message{newMessagesCount !== 1 ? 's' : ''})
                </span>
              )}
            </p>
          </div>
          
          {newMessagesCount > 0 && (
            <Button 
              onClick={markAllAsRead} 
              variant="outline" 
              className="whitespace-nowrap flex-shrink-0 mt-2 sm:mt-0"
              size="sm"
            >
              <Eye className="w-4 h-4 mr-2" />
              Mark All as Read
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <Card className="bg-white border-l-4 border-l-blue-500">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-600 truncate">Total Messages</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{messages.length}</p>
                </div>
                <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 flex-shrink-0 ml-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-l-green-500">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-600 truncate">New Messages</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{newMessagesCount}</p>
                </div>
                <EyeOff className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 flex-shrink-0 ml-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-l-gray-500">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-600 truncate">Read Messages</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {messages.length - newMessagesCount}
                  </p>
                </div>
                <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500 flex-shrink-0 ml-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Section */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search messages by name, email, or content..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
              <div className="text-sm text-gray-500 whitespace-nowrap flex-shrink-0 text-center sm:text-left">
                {filteredMessages.length} of {messages.length} messages
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages Grid */}
        {filteredMessages.length === 0 ? (
          <Card>
            <CardContent className="p-8 sm:p-12 text-center">
              <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages found</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                {search ? "Try adjusting your search terms" : "No contact messages yet"}
              </p>
              {search && (
                <Button 
                  variant="outline" 
                  onClick={() => setSearch("")}
                  className="mt-4"
                >
                  Clear Search
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {filteredMessages.map((msg) => (
              <Card 
                key={msg.id} 
                className={`hover:shadow-lg transition-all duration-200 border-l-4 overflow-hidden ${
                  msg.status === "new" 
                    ? "border-l-blue-500 bg-blue-50/50" 
                    : "border-l-gray-300"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                          {msg.name}
                        </CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <CardDescription className="text-sm text-gray-600 truncate">
                          {msg.email}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge 
                      variant={msg.status === "new" ? "default" : "secondary"}
                      className={`flex-shrink-0 ${
                        msg.status === "new" 
                          ? "bg-blue-100 text-blue-800 hover:bg-blue-100 border-0" 
                          : "bg-gray-100 text-gray-800 hover:bg-gray-100 border-0"
                      }`}
                    >
                      {msg.status === "new" ? "NEW" : "READ"}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="min-h-[60px]">
                    <p className="text-sm text-gray-700 line-clamp-3 break-words">
                      {msg.message}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {formatTimestamp(msg.timestamp)}
                    </span>
                    
                    {msg.status === "new" && (
                      <Button 
                        onClick={() => markAsRead(msg.id)} 
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
                      >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Mark Read
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}