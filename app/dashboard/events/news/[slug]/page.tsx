"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Eye, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

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

export default function NewsDetailPage() {
  const params = useParams();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const articleId = params.id as string;
      
      // Get news from localStorage
      const savedNews = localStorage.getItem('newsArticles');
      const newsArticles = savedNews ? JSON.parse(savedNews) : [];
      
      const foundArticle = newsArticles.find((article: NewsArticle) => article.id === articleId);
      
      if (foundArticle) {
        // Increment views when article is viewed
        const updatedNews = newsArticles.map((article: NewsArticle) =>
          article.id === articleId ? { ...article, views: article.views + 1 } : article
        );
        localStorage.setItem('newsArticles', JSON.stringify(updatedNews));
        
        setArticle({ ...foundArticle, views: foundArticle.views + 1 });
      } else {
        setArticle(null);
      }
      
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">Loading article...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-12 max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
        <p className="text-muted-foreground mb-4">The news article you're looking for could not be found.</p>
        <Button asChild>
          <Link href="/dashboard/events/news">Back to News</Link>
        </Button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderContent = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => (
      <div key={index} className="mb-6">
        {paragraph.split('\n').map((line, lineIndex) => {
          if (line.startsWith('## ')) {
            return (
              <h2 key={lineIndex} className="text-2xl font-bold mt-8 mb-4 text-gray-900">
                {line.replace('## ', '')}
              </h2>
            );
          } else if (line.startsWith('- **')) {
            const cleanLine = line.replace('- **', '').replace('**:', ':').replace('**', '');
            return (
              <li key={lineIndex} className="ml-6 mb-2 text-gray-700">
                <strong>{cleanLine.split(':')[0]}:</strong>
                {cleanLine.split(':').slice(1).join(':')}
              </li>
            );
          } else if (line.trim() === '') {
            return null;
          } else {
            return (
              <p key={lineIndex} className="mb-4 leading-7 text-gray-700">
                {line}
              </p>
            );
          }
        })}
      </div>
    ));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      {/* Back Button */}
      <Button variant="outline" asChild className="mb-4">
        <Link href="/dashboard/events/news" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to News
        </Link>
      </Button>

      {/* Article Header */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start mb-4">
            <Badge variant="outline" className="text-sm capitalize">{article.category}</Badge>
            <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
              {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
            </Badge>
          </div>
          <CardTitle className="text-3xl leading-tight text-gray-900">{article.title}</CardTitle>
          <CardDescription className="text-lg mt-2 text-gray-600">{article.excerpt}</CardDescription>
          
          <div className="flex flex-wrap gap-4 pt-4 text-sm text-muted-foreground border-t mt-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>By {article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(article.publishDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{article.readTime} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{article.views} views</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Article Content */}
      <Card>
        <CardContent className="pt-6">
          <div className="prose max-w-none">
            {renderContent(article.content)}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4 pt-4">
        <Button variant="outline" asChild>
          <Link href="/dashboard/events/news">
            Back to News List
          </Link>
        </Button>
        <Button asChild>
          <Link href={`/dashboard/events/news?edit=${article.id}`}>
            Edit Article
          </Link>
        </Button>
      </div>
    </div>
  );
}