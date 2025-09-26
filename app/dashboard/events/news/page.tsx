"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Search, Eye, Edit, Calendar, Clock, User, Download, Pin, BarChart3, FileText, Archive, TrendingUp } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string;
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

export default function NewsListPage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsArticle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState<NewsArticle | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsArticle | null>(null);
  const [statistics, setStatistics] = useState<Statistics>({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    archivedArticles: 0,
    totalViews: 0,
    averageReadTime: 0,
    pinnedArticles: 0
  });

  // Sample initial data
  const sampleNews: NewsArticle[] = [
    {
      id: '1',
      title: 'New Event Management System Launched',
      content: `We are excited to announce the launch of our new event management system! This comprehensive platform brings numerous improvements and features designed to enhance your experience.

## Key Features:
- **Intuitive Interface**: Streamlined design for easy navigation
- **Advanced Analytics**: Track event performance with detailed insights
- **Customizable Templates**: Pre-built templates for various event types
- **Real-time Updates**: Instant notifications and updates

The new system represents a significant upgrade from our previous platform, incorporating feedback from our valued users. We've focused on making the event management process more efficient and user-friendly.`,
      excerpt: 'Learn about our new event management system features and improvements.',
      author: 'John Doe',
      publishDate: '2024-01-15',
      status: 'published',
      category: 'Announcements',
      readTime: 5,
      views: 1245,
      isPinned: true,
      priority: 'high',
      attachments: ['system-guide.pdf', 'release-notes.docx']
    },
    {
      id: '2',
      title: 'Upcoming Community Meetup',
      content: `Join us for our monthly community meetup next Saturday at the Community Center. This event is a great opportunity to network with other professionals in your field and learn about the latest industry trends.

## Event Details:
- **Date**: Saturday, January 27, 2024
- **Time**: 2:00 PM - 5:00 PM
- **Location**: Community Center, 123 Main Street
- **Special Guest**: Industry expert Sarah Johnson

We'll have light refreshments, networking sessions, and a special presentation on emerging technologies. All community members are welcome!`,
      excerpt: 'Monthly community gathering with special guests and networking opportunities.',
      author: 'Jane Smith',
      publishDate: '2024-01-10',
      status: 'published',
      category: 'Events',
      readTime: 3,
      views: 867,
      isPinned: false,
      priority: 'medium',
      attachments: ['agenda.pdf']
    },
    {
      id: '3',
      title: 'System Maintenance Schedule',
      content: `Please be advised that we will be performing scheduled system maintenance this weekend to improve performance and security.

## Maintenance Window:
- **Start**: Saturday, January 20, 2024, 10:00 PM
- **End**: Sunday, January 21, 2024, 2:00 AM

During this time, the system may be unavailable. We apologize for any inconvenience this may cause and appreciate your understanding as we work to improve our services.`,
      excerpt: 'Important information about upcoming system maintenance.',
      author: 'Admin Team',
      publishDate: '2024-01-08',
      status: 'draft',
      category: 'Maintenance',
      readTime: 2,
      views: 432,
      isPinned: false,
      priority: 'medium',
      attachments: []
    }
  ];

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
    // Load news from localStorage or use sample data
    const savedNews = localStorage.getItem('newsArticles');
    if (savedNews) {
      const newsData = JSON.parse(savedNews);
      setNews(newsData);
      setStatistics(calculateStatistics(newsData));
    } else {
      setNews(sampleNews);
      setStatistics(calculateStatistics(sampleNews));
      localStorage.setItem('newsArticles', JSON.stringify(sampleNews));
    }
  }, []);

  useEffect(() => {
    const filtered = news.filter(article =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNews(filtered);
    setStatistics(calculateStatistics(news));
  }, [searchTerm, news]);

  const handleViewNews = (article: NewsArticle) => {
    // Increment views when viewing
    const updatedNews = news.map(item =>
      item.id === article.id ? { ...item, views: item.views + 1 } : item
    );
    setNews(updatedNews);
    localStorage.setItem('newsArticles', JSON.stringify(updatedNews));
    setStatistics(calculateStatistics(updatedNews));
    
    setSelectedNews({ ...article, views: article.views + 1 });
    setIsViewDialogOpen(true);
  };

  const handleAddNews = () => {
    setEditingNews(null);
    setIsDialogOpen(true);
  };

  const handleEditNews = (article: NewsArticle) => {
    setEditingNews(article);
    setIsDialogOpen(true);
  };

  const handleDeleteNews = (article: NewsArticle) => {
    setNewsToDelete(article);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (newsToDelete) {
      const updatedNews = news.filter(article => article.id !== newsToDelete.id);
      setNews(updatedNews);
      localStorage.setItem('newsArticles', JSON.stringify(updatedNews));
      setStatistics(calculateStatistics(updatedNews));
      setIsDeleteDialogOpen(false);
      setNewsToDelete(null);
    }
  };

  const handleSaveNews = (formData: FormData) => {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const excerpt = formData.get('excerpt') as string;
    const author = formData.get('author') as string;
    const category = formData.get('category') as string;
    const status = formData.get('status') as 'published' | 'draft';
    const isPinned = formData.get('isPinned') === 'on';
    const priority = formData.get('priority') as 'low' | 'medium' | 'high';

    if (editingNews) {
      const updatedNews = news.map(article =>
        article.id === editingNews.id
          ? {
              ...article,
              title,
              content,
              excerpt,
              author,
              category,
              status,
              isPinned,
              priority,
              publishDate: new Date().toISOString().split('T')[0],
              readTime: Math.ceil(content.split(' ').length / 200)
            }
          : article
      );
      setNews(updatedNews);
      localStorage.setItem('newsArticles', JSON.stringify(updatedNews));
      setStatistics(calculateStatistics(updatedNews));
    } else {
      const newArticle: NewsArticle = {
        id: Date.now().toString(),
        title,
        content,
        excerpt,
        author,
        category,
        status,
        isPinned,
        priority,
        publishDate: new Date().toISOString().split('T')[0],
        readTime: Math.ceil(content.split(' ').length / 200),
        views: 0,
        attachments: []
      };
      const updatedNews = [...news, newArticle];
      setNews(updatedNews);
      localStorage.setItem('newsArticles', JSON.stringify(updatedNews));
      setStatistics(calculateStatistics(updatedNews));
    }

    setIsDialogOpen(false);
    setEditingNews(null);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: { variant: 'default' as const, label: 'Published' },
      draft: { variant: 'secondary' as const, label: 'Draft' },
      archived: { variant: 'outline' as const, label: 'Archived' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPriorityColor = (priority: string) => {
    const priorityColors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    };
    return priorityColors[priority as keyof typeof priorityColors] || priorityColors.medium;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const StatCard = ({ title, value, icon: Icon, description, trend }: { 
    title: string; 
    value: number | string; 
    icon: React.ElementType;
    description?: string;
    trend?: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
            {trend && (
              <div className="flex items-center mt-1">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-green-500">{trend}</span>
              </div>
            )}
          </div>
          <div className="p-3 rounded-full bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">News Management</h1>
          <p className="text-muted-foreground">Create and manage news articles</p>
        </div>
        <Button onClick={handleAddNews} className="gap-2">
          <Plus className="h-4 w-4" />
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

      {/* Additional Statistics Row */}
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

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search news by title, content, or category..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* News Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredNews.map((article) => (
          <Card key={article.id} className="flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline">{article.category}</Badge>
                <div className="flex gap-1">
                  {article.isPinned && <Pin className="w-4 h-4 text-blue-500 fill-current" />}
                  {getStatusBadge(article.status)}
                </div>
              </div>
              <CardTitle className="text-xl line-clamp-2">{article.title}</CardTitle>
              <CardDescription className="line-clamp-3">{article.excerpt}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatDate(article.publishDate)}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2" />
                  {article.readTime} min read
                </div>
                <div className="text-sm text-muted-foreground flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  By {article.author}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
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
                  onClick={() => handleViewNews(article)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleEditNews(article)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDeleteNews(article)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No news articles found.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit News Dialog with Scroll */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>
              {editingNews ? 'Edit News Article' : 'Create New News Article'}
            </DialogTitle>
            <DialogDescription>
              {editingNews ? 'Update the news article details.' : 'Fill in the details for the new news article.'}
            </DialogDescription>
          </DialogHeader>
          <form action={handleSaveNews} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto pr-2 py-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label htmlFor="title" className="text-sm font-medium">Title</label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={editingNews?.title || ''}
                    placeholder="Enter news title"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="excerpt" className="text-sm font-medium">Excerpt</label>
                  <Input
                    id="excerpt"
                    name="excerpt"
                    defaultValue={editingNews?.excerpt || ''}
                    placeholder="Brief description of the news"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="content" className="text-sm font-medium">Content</label>
                  <Textarea
                    id="content"
                    name="content"
                    defaultValue={editingNews?.content || ''}
                    placeholder="Write the full news content here..."
                    rows={8}
                    required
                    className="min-h-[200px] resize-vertical"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="author" className="text-sm font-medium">Author</label>
                    <Input
                      id="author"
                      name="author"
                      defaultValue={editingNews?.author || ''}
                      placeholder="Author name"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="category" className="text-sm font-medium">Category</label>
                    <Input
                      id="category"
                      name="category"
                      defaultValue={editingNews?.category || ''}
                      placeholder="News category"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="status" className="text-sm font-medium">Status</label>
                    <select
                      id="status"
                      name="status"
                      defaultValue={editingNews?.status || 'draft'}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="priority" className="text-sm font-medium">Priority</label>
                    <select
                      id="priority"
                      name="priority"
                      defaultValue={editingNews?.priority || 'medium'}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPinned"
                    name="isPinned"
                    defaultChecked={editingNews?.isPinned || false}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="isPinned" className="text-sm font-medium">Pin this news article</label>
                </div>
              </div>
            </div>
            <DialogFooter className="flex-shrink-0 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingNews ? 'Update News' : 'Create News'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View News Dialog with Enhanced Scroll */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              {selectedNews?.isPinned && <Pin className="w-4 h-4 text-blue-500 fill-current" />}
              {selectedNews?.title}
            </DialogTitle>
            <DialogDescription>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{selectedNews?.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{selectedNews?.publishDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{selectedNews?.readTime} min read</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{selectedNews?.views} views</span>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Badge className={getPriorityColor(selectedNews?.priority || 'medium')}>
                {(selectedNews?.priority || 'medium').toUpperCase()}
              </Badge>
              <Badge variant="secondary">{selectedNews?.category}</Badge>
              {getStatusBadge(selectedNews?.status || 'draft')}
              {selectedNews?.isPinned && (
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  <Pin className="w-3 h-3 mr-1" />
                  Pinned
                </Badge>
              )}
            </div>
            
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">{selectedNews?.content}</p>
            </div>
            
            {selectedNews?.attachments && selectedNews.attachments.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Attachments ({selectedNews.attachments.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedNews.attachments.map((attachment, index) => (
                    <Badge key={index} variant="outline" className="cursor-pointer hover:bg-gray-100 px-3 py-1">
                      {attachment}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter className="flex-shrink-0 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the news article "{newsToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}