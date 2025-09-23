"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Search, Eye, Edit, Calendar, Clock } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
}

export default function NewsListPage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsArticle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState<NewsArticle | null>(null);
  const router = useRouter();

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
      views: 1245
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
      views: 867
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
      views: 432
    }
  ];

  useEffect(() => {
    // Load news from localStorage or use sample data
    const savedNews = localStorage.getItem('newsArticles');
    if (savedNews) {
      setNews(JSON.parse(savedNews));
    } else {
      setNews(sampleNews);
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
  }, [searchTerm, news]);

  const handleViewNews = (articleId: string) => {
    router.push(`/dashboard/events/news/${articleId}`);
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
              publishDate: new Date().toISOString().split('T')[0],
              readTime: Math.ceil(content.split(' ').length / 200)
            }
          : article
      );
      setNews(updatedNews);
      localStorage.setItem('newsArticles', JSON.stringify(updatedNews));
    } else {
      const newArticle: NewsArticle = {
        id: Date.now().toString(),
        title,
        content,
        excerpt,
        author,
        category,
        status,
        publishDate: new Date().toISOString().split('T')[0],
        readTime: Math.ceil(content.split(' ').length / 200),
        views: 0
      };
      const updatedNews = [...news, newArticle];
      setNews(updatedNews);
      localStorage.setItem('newsArticles', JSON.stringify(updatedNews));
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
                {getStatusBadge(article.status)}
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
                <div className="text-sm text-muted-foreground">
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
                  onClick={() => handleViewNews(article.id)}
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

      {/* Add/Edit News Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingNews ? 'Edit News Article' : 'Create New News Article'}
            </DialogTitle>
            <DialogDescription>
              {editingNews ? 'Update the news article details.' : 'Fill in the details for the new news article.'}
            </DialogDescription>
          </DialogHeader>
          <form action={handleSaveNews}>
            <div className="grid gap-4 py-4">
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
                  rows={6}
                  required
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
            </div>
            <DialogFooter>
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