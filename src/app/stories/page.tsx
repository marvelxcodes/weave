'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  Book, 
  Heart, 
  Eye, 
  Search,
  User, 
  Clock,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

interface Story {
  id: string;
  title: string;
  description: string;
  likes: number;
  views: number;
  createdAt: string;
  author: {
    id: string;
    name: string;
    image?: string;
  };
  _count: {
    chapters: number;
    likes_users: number;
  };
}

interface StoriesResponse {
  stories: Story[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function StoriesPage() {
  const { data: session } = useSession();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<StoriesResponse['pagination'] | null>(null);

  useEffect(() => {
    fetchStories();
  }, [currentPage, searchTerm]);

  const fetchStories = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`/api/stories?${params}`);
      const data: StoriesResponse = await response.json();
      
      setStories(data.stories);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchStories();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900/20 to-amber-800/10">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900/80 to-amber-800/60 backdrop-blur-md 
                    border-b border-amber-600/30">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="flex items-center space-x-2 text-amber-200 hover:text-amber-100 
                         transition-colors"
              >
                <ArrowLeft size={20} />
                <span className="antique-text">Back to Create</span>
              </Link>
              
              <div className="h-6 w-px bg-amber-600/50" />
              
              <div className="flex items-center space-x-2">
                <Sparkles className="text-amber-400" size={24} />
                <h1 className="text-2xl font-bold gold-text decorative-text">
                  Story Library
                </h1>
              </div>
            </div>

            {session && (
              <div className="text-amber-200 antique-text">
                Welcome, {session.user?.name}
              </div>
            )}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-6">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 
                              text-amber-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search stories by title or description..."
                className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-amber-600/40 
                         bg-black/30 backdrop-blur-sm text-amber-100 placeholder-amber-300/50
                         focus:border-amber-400/80 focus:outline-none transition-all duration-300
                         antique-text"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 
                          rounded-full animate-spin" />
              <span className="text-amber-200 antique-text text-lg">
                Loading stories...
              </span>
            </div>
          </div>
        ) : stories?.length === 0 ? (
          <div className="text-center py-12">
            <Book className="mx-auto text-amber-400/50 mb-4" size={64} />
            <h2 className="text-2xl font-bold text-amber-300 decorative-text mb-2">
              No stories found
            </h2>
            <p className="text-amber-200/80 antique-text">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Be the first to create a public story!'
              }
            </p>
          </div>
        ) : (
          <>
            {/* Stories Grid */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <AnimatePresence>
                {stories?.map((story, index) => (
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="group"
                  >
                    <Link href={`/stories/${story.id}`}>
                      <div className="bg-gradient-to-br from-amber-900/40 to-amber-800/20 
                                    backdrop-blur-sm border border-amber-600/40 rounded-lg p-6 
                                    hover:border-amber-500/60 transition-all duration-300 h-full
                                    hover:shadow-lg hover:shadow-amber-500/20">
                        {/* Story Header */}
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-lg font-semibold text-amber-100 decorative-text 
                                       group-hover:text-amber-50 transition-colors line-clamp-2">
                            {story.title}
                          </h3>
                          <div className="flex items-center space-x-1 text-amber-400">
                            <Book size={16} />
                            <span className="text-sm">{story._count.chapters}</span>
                          </div>
                        </div>

                        {/* Description */}
                        {story.description && (
                          <p className="text-amber-200/80 antique-text text-sm mb-4 line-clamp-3">
                            {story.description}
                          </p>
                        )}

                        {/* Author */}
                        <div className="flex items-center space-x-2 mb-4">
                          <User size={16} className="text-amber-400" />
                          <span className="text-amber-300 antique-text text-sm">
                            {story.author.name}
                          </span>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1 text-amber-400">
                              <Heart size={14} />
                              <span>{story._count.likes_users}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-amber-400">
                              <Eye size={14} />
                              <span>{story.views}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1 text-amber-500/80">
                            <Clock size={14} />
                            <span className="antique-text">
                              {new Date(story.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <motion.div 
                className="flex justify-center mt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center space-x-2">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`
                        px-4 py-2 rounded-lg border-2 transition-all duration-300
                        decorative-text font-semibold
                        ${page === currentPage
                          ? 'bg-amber-600 border-amber-500 text-white shadow-lg shadow-amber-500/30'
                          : 'bg-amber-900/40 border-amber-600/40 text-amber-200 hover:border-amber-500/60'
                        }
                      `}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 