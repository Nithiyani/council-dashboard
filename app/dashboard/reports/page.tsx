"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, Plus, Download, Search, FileText, Users, Activity } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const reportsData = [
  { id: 1, title: "User Activity Report", description: "Monthly user activity and engagement statistics", type: "Activity", generatedDate: "2024-12-20", generatedBy: "Admin", format: "PDF", status: "Completed" },
  { id: 2, title: "Event Attendance Report", description: "Attendance statistics for community events", type: "Events", generatedDate: "2024-12-18", generatedBy: "Manager", format: "CSV", status: "Completed" },
  { id: 3, title: "Document Downloads Report", description: "Analysis of document download patterns", type: "Documents", generatedDate: "2024-12-15", generatedBy: "Admin", format: "PDF", status: "Completed" },
  { id: 4, title: "System Performance Report", description: "System performance and uptime statistics", type: "System", generatedDate: "2024-12-12", generatedBy: "Admin", format: "PDF", status: "Processing" }
];

const activityData = [
  { name: 'Jan', users: 1200, events: 24, notices: 18 },
  { name: 'Feb', users: 1400, events: 28, notices: 22 },
  { name: 'Mar', users: 1600, events: 32, notices: 25 },
  { name: 'Apr', users: 1800, events: 35, notices: 30 },
  { name: 'May', users: 2000, events: 42, notices: 28 },
  { name: 'Jun', users: 2200, events: 38, notices: 35 }
];

const userTypeData = [
  { name: 'Admins', value: 5, color: '#3B82F6' },
  { name: 'Staff', value: 15, color: '#10B981' },
  { name: 'Viewers', value: 25, color: '#F59E0B' },
  { name: 'Inactive', value: 8, color: '#EF4444' }
];

const logsData = [
  { id: 1, timestamp: "2024-12-20 14:30:25", user: "admin@council.gov", action: "Created new event", resource: "Community Meeting", ipAddress: "192.168.1.100", status: "Success" },
  { id: 2, timestamp: "2024-12-20 14:25:10", user: "sarah.manager@council.gov", action: "Updated notice", resource: "Road Closure Notice", ipAddress: "192.168.1.101", status: "Success" },
  { id: 3, timestamp: "2024-12-20 14:20:45", user: "mike.editor@council.gov", action: "Uploaded document", resource: "Budget Report 2025", ipAddress: "192.168.1.102", status: "Success" },
  { id: 4, timestamp: "2024-12-20 14:15:30", user: "unknown@external.com", action: "Failed login attempt", resource: "Admin Panel", ipAddress: "203.0.113.1", status: "Failed" }
];

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedUser, setSelectedUser] = useState('all');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [reports, setReports] = useState(reportsData);
  const [newReport, setNewReport] = useState({ title: '', type: 'Activity', format: 'PDF', dateRange: 'last_month' });

  const reportTypes = ['Activity', 'Events', 'Documents', 'System', 'Users'];
  const formats = ['PDF', 'CSV', 'Excel'];

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || report.type === selectedType;
    return matchesSearch && matchesType;
  });

  const filteredLogs = logsData.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.resource.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUser = selectedUser === 'all' || log.user === selectedUser;
    return matchesSearch && matchesUser;
  });

  const handleGenerateReport = () => {
    const report = { id: reports.length + 1, ...newReport, description: `Generated ${newReport.type.toLowerCase()} report`, generatedDate: new Date().toISOString().split('T')[0], generatedBy: "Admin", status: "Processing" };
    setReports([...reports, report]);
    setNewReport({ title: '', type: 'Activity', format: 'PDF', dateRange: 'last_month' });
    setIsGenerateDialogOpen(false);
  };

  const handleExportCSV = () => console.log('Exporting CSV...');
  const handleExportPDF = () => console.log('Exporting PDF...');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Logs</h1>
          <p className="text-gray-600">Generate reports and monitor system activity</p>
        </div>
        <Button onClick={() => setIsGenerateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Generate Report
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg"><BarChart3 className="w-6 h-6 text-blue-600" /></div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold">{reports.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex items-center">
            <div className="p-2 bg-green-100 rounded-lg"><FileText className="w-6 h-6 text-green-600" /></div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold">{reports.filter(r => r.status === 'Completed').length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg"><Activity className="w-6 h-6 text-orange-600" /></div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Activity Logs</p>
              <p className="text-2xl font-bold">{logsData.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg"><Users className="w-6 h-6 text-purple-600" /></div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold">45</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="logs">Activity Logs</TabsTrigger>
        </TabsList>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
              <CardDescription>View and download generated reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input placeholder="Search reports..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                </div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {reportTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Generated</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map(report => (
                      <TableRow key={report.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <p className="font-medium">{report.title}</p>
                            <p className="text-sm text-gray-500 truncate max-w-xs">{report.description}</p>
                          </div>
                        </TableCell>
                        <TableCell><Badge variant="outline">{report.type}</Badge></TableCell>
                        <TableCell><Badge variant="secondary">{report.format}</Badge></TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{new Date(report.generatedDate).toLocaleDateString()}</p>
                            <p className="text-gray-500">by {report.generatedBy}</p>
                          </div>
                        </TableCell>
                        <TableCell><Badge variant={report.status === 'Completed' ? 'default' : 'secondary'}>{report.status}</Badge></TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" disabled={report.status !== 'Completed'}>
                            <Download className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Activity Trends</CardTitle>
                <CardDescription>Monthly activity statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="users" fill="#3B82F6" name="Users" />
                      <Bar dataKey="events" fill="#10B981" name="Events" />
                      <Bar dataKey="notices" fill="#F59E0B" name="Notices" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>User types breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={userTypeData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} dataKey="value">
                        {userTypeData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-4">
                  {userTypeData.map(item => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex space-x-4">
            <Button onClick={handleExportCSV}><Download className="w-4 h-4 mr-2" />Export CSV</Button>
            <Button variant="outline" onClick={handleExportPDF}><Download className="w-4 h-4 mr-2" />Export PDF</Button>
          </div>
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs" className="space-y-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Activity Logs</CardTitle>
              <CardDescription>System activity and user actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input placeholder="Search logs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                </div>
                <Input type="date" value={dateRange.from} onChange={(e) => setDateRange({...dateRange, from: e.target.value})} className="w-[150px]" />
                <Input type="date" value={dateRange.to} onChange={(e) => setDateRange({...dateRange, to: e.target.value})} className="w-[150px]" />
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map(log => (
                      <TableRow key={log.id} className="hover:bg-gray-50">
                        <TableCell><div className="text-sm">{new Date(log.timestamp).toLocaleString()}</div></TableCell>
                        <TableCell><div className="text-sm">{log.user}</div></TableCell>
                        <TableCell><div className="text-sm">{log.action}</div></TableCell>
                        <TableCell><div className="text-sm">{log.resource}</div></TableCell>
                        <TableCell><div className="text-sm font-mono">{log.ipAddress}</div></TableCell>
                        <TableCell><Badge variant={log.status === 'Success' ? 'default' : 'destructive'}>{log.status}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Generate Report Dialog */}
      <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Report</DialogTitle>
            <DialogDescription>Create a new report</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Title</Label>
              <Input id="title" className="col-span-3" value={newReport.title} onChange={(e) => setNewReport({...newReport, title: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">Type</Label>
              <Select value={newReport.type} onValueChange={(value) => setNewReport({...newReport, type: value})} className="col-span-3">
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {reportTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="format" className="text-right">Format</Label>
              <Select value={newReport.format} onValueChange={(value) => setNewReport({...newReport, format: value})} className="col-span-3">
                <SelectTrigger><SelectValue placeholder="Select format" /></SelectTrigger>
                <SelectContent>
                  {formats.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleGenerateReport}>Generate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
