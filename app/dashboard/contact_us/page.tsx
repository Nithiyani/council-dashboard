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
import { Label } from "@/components/ui/label";
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
      timestamp: "2024-01-15 10:30:00"
    },
    { 
      id: 2, 
      name: "Jane Doe", 
      email: "jane@example.com", 
      message: "Need more information about your API documentation and integration process.", 
      status: "read",
      timestamp: "2024-01-14 14:22:00"
    },
    { 
      id: 3, 
      name: "Mike Johnson", 
      email: "mike@techcorp.com", 
      message: "We're experiencing issues with the dashboard analytics. Can you help?",
      status: "new",
      timestamp: "2024-01-15 09:15:00"
    },
  ]);

  const [search, setSearch] = useState("");

  const filteredMessages = useMemo(() => {
    return messages.filter(
      (msg) =>
        msg.name.toLowerCase().includes(search.toLowerCase()) ||
        msg.email.toLowerCase().includes(search.toLowerCase()) ||
        msg.message.toLowerCase().includes(search.toLowerCase())
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

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contact Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Manage and respond to customer messages
              {newMessagesCount > 0 && (
                <span className="ml-2 text-sm font-medium text-blue-600">
                  ({newMessagesCount} new message{newMessagesCount !== 1 ? 's' : ''})
                </span>
              )}
            </p>
          </div>
          
          {newMessagesCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline" className="whitespace-nowrap">
              <Eye className="w-4 h-4 mr-2" />
              Mark All as Read
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Messages</p>
                  <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
                </div>
                <Mail className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">New Messages</p>
                  <p className="text-2xl font-bold text-gray-900">{newMessagesCount}</p>
                </div>
                <EyeOff className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-l-gray-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Read Messages</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {messages.length - newMessagesCount}
                  </p>
                </div>
                <Eye className="w-8 h-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search messages by name, email, or content..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="text-sm text-gray-500 whitespace-nowrap">
                {filteredMessages.length} of {messages.length} messages
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages Grid */}
        {filteredMessages.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages found</h3>
              <p className="text-gray-600">
                {search ? "Try adjusting your search terms" : "No contact messages yet"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredMessages.map((msg) => (
              <Card 
                key={msg.id} 
                className={`hover:shadow-lg transition-all duration-200 border-l-4 ${
                  msg.status === "new" 
                    ? "border-l-blue-500 bg-blue-50/50" 
                    : "border-l-gray-300"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <CardTitle className="text-lg font-semibold text-gray-900">
                          {msg.name}
                        </CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <CardDescription className="text-sm text-gray-600">
                          {msg.email}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge 
                      variant={msg.status === "new" ? "default" : "secondary"}
                      className={msg.status === "new" 
                        ? "bg-blue-100 text-blue-800 hover:bg-blue-100" 
                        : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                      }
                    >
                      {msg.status === "new" ? "NEW" : "READ"}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {msg.message}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-xs text-gray-500">
                      {new Date(msg.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    
                    {msg.status === "new" && (
                      <Button 
                        onClick={() => markAsRead(msg.id)} 
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Eye className="w-4 h-4 mr-1" />
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