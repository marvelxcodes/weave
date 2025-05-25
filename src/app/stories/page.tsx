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
  Zap,
  ArrowLeft
} from 'lucide-react';
import axios, { AxiosError } from 'axios';

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
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchStories = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...(search && { search })
      });

      const response = await axios.get<StoriesResponse>(`/api/stories?${params}`);
      
      setStories(response.data.stories);
      setTotalPages(response.data.pagination.pages);
      setCurrentPage(page);
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      setError(axiosError.response?.data?.error || 'Failed to load stories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchStories(1, searchTerm);
  };

  const handlePageChange = (page: number) => {
    fetchStories(page, searchTerm);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative">
      {/* Cyberpunk background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="glass-surface border-b border-cyan-500/30 relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 text-cyan-300 hover:text-cyan-100 
                         transition-colors hover:shadow-[0_0_10px_rgba(0,255,255,0.3)]"
              >
                <ArrowLeft size={20} />
                <span className="cyber-text">Return to Matrix</span>
              </Link>
              
              <div className="h-6 w-px bg-cyan-500/50" />
              
              <div className="flex items-center space-x-2">
                <Zap className="text-cyan-400 neon-glow" size={24} />
                <h1 className="text-2xl font-bold neon-text">
                  DATA ARCHIVES
                </h1>
              </div>
            </div>

            {session && (
              <div className="cyber-text">
                CONNECTED: {session.user?.name}
              </div>
            )}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-6">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 
                              text-cyan-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search neural archives..."
                className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-cyan-500/40 
                         glass-surface text-cyan-100 placeholder-cyan-300/50
                         focus:border-cyan-400 focus:outline-none transition-all duration-300
                         cyber-text focus:shadow-[0_0_20px_rgba(0,255,255,0.3)]"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 
                          rounded-full animate-spin" />
              <span className="text-cyan-200 cyber-text text-lg">
                Accessing archives...
              </span>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-400 text-lg font-semibold cyber-text mb-2">
              Archive access error
            </div>
            <p className="text-red-400/80 cyber-text mb-4">
              {error}
            </p>
            <button
              onClick={() => fetchStories(currentPage, searchTerm)}
              className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg
                       border-2 border-red-500 transition-all duration-300 cyber-text
                       hover:shadow-[0_0_20px_rgba(255,0,0,0.5)]"
            >
              Retry Connection
            </button>
          </div>
        ) : stories?.length === 0 ? (
          <div className="text-center py-12">
            <Book className="mx-auto text-cyan-400/50 mb-4 neon-glow" size={64} />
            <h2 className="text-2xl font-bold text-cyan-300 neon-text mb-2">
              No data found
            </h2>
            <p className="text-cyan-200/80 cyber-text">
              {searchTerm 
                ? 'Refine search parameters' 
                : 'Initialize first neural narrative!'
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
                      <div className="hologram neon-border rounded-lg p-6 
                                    hover:border-cyan-400/80 transition-all duration-300 h-full
                                    hover:shadow-[0_0_30px_rgba(0,255,255,0.3)]
                                    hover:hologram-flicker">
                        {/* Story Header */}
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-lg font-semibold text-cyan-100 cyber-text 
                                       group-hover:text-cyan-50 transition-colors line-clamp-2">
                            {story.title}
                          </h3>
                          <div className="flex items-center space-x-1 text-cyan-400">
                            <Book size={16} />
                            <span className="text-sm">{story._count.chapters}</span>
                          </div>
                        </div>

                        {/* Description */}
                        {story.description && (
                          <p className="text-cyan-200/80 cyber-text text-sm mb-4 line-clamp-3">
                            {story.description}
                          </p>
                        )}

                        {/* Author */}
                        <div className="flex items-center space-x-2 mb-4">
                          <User size={16} className="text-cyan-400" />
                          <span className="text-cyan-300 cyber-text text-sm">
                            {story.author.name}
                          </span>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1 text-pink-400">
                              <Heart size={14} />
                              <span>{story._count.likes_users}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-cyan-400">
                              <Eye size={14} />
                              <span>{story.views}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1 text-cyan-500/80">
                            <Clock size={14} />
                            <span className="cyber-text">
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
            {totalPages > 1 && (
              <motion.div 
                className="flex justify-center mt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`
                        px-4 py-2 rounded-lg border-2 transition-all duration-300
                        cyber-text font-semibold
                        ${page === currentPage
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-500 text-white shadow-[0_0_20px_rgba(0,255,255,0.5)]'
                          : 'glass-surface border-cyan-600/40 text-cyan-200 hover:border-cyan-500/60 hover:shadow-[0_0_10px_rgba(0,255,255,0.3)]'
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