'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { Sparkles, BookOpen, Zap, Loader2, ArrowRight } from 'lucide-react';
import { storyApiService } from '@/lib/storyApi';
import { StoryGenerateResponse, StoryContinueResponse } from '@/types/api';
import { StoryIdTracker } from './StoryIdTracker';

interface Genre {
  id: string;
  name: string;
  description: string;
  color: string;
}

const GENRES: Genre[] = [
  { id: 'fantasy', name: 'Fantasy', description: 'Magical realms and mythical creatures', color: 'from-purple-500 to-pink-500' },
  { id: 'sci-fi', name: 'Sci-Fi', description: 'Futuristic technology and space exploration', color: 'from-cyan-500 to-blue-500' },
  { id: 'mystery', name: 'Mystery', description: 'Puzzles, clues, and hidden secrets', color: 'from-gray-500 to-slate-600' },
  { id: 'romance', name: 'Romance', description: 'Love stories and emotional journeys', color: 'from-rose-500 to-red-500' },
  { id: 'horror', name: 'Horror', description: 'Spine-chilling tales of terror', color: 'from-red-600 to-black' },
  { id: 'adventure', name: 'Adventure', description: 'Thrilling quests and exploration', color: 'from-green-500 to-emerald-600' },
];

const SAMPLE_PROMPTS = [
  'A neural interface activates in a cyberpunk metropolis...',
  'You discover a hidden portal in an ancient library...',
  'The last AI awakens in an abandoned server farm...',
  'A mysterious letter arrives from the future...',
  'You inherit a magical artifact from a distant relative...',
  'The space station receives an unknown signal...',
];

export const ExternalApiDemo: React.FC = () => {
  const { data: session } = useSession();
  const [selectedGenre, setSelectedGenre] = useState<string>('sci-fi');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isContinuing, setIsContinuing] = useState(false);
  const [currentStory, setCurrentStory] = useState<StoryGenerateResponse | null>(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [error, setError] = useState<string>('');

  const generateStory = async () => {
    if (!session?.user) {
      setError('Please sign in to generate stories');
      return;
    }

    setIsGenerating(true);
    setError('');
    setCurrentStory(null);

    try {
      const response = await storyApiService.generateStory({
        user_id: '', // Handled by API route using session
        genre: selectedGenre,
        custom_prompt: customPrompt || undefined,
      });

      if (response.success && response.data) {
        setCurrentStory(response.data);
        setCurrentChapter(0);
      } else {
        setError(response.error || 'Failed to generate story');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const continueStory = async (choice: string, choiceIndex: number) => {
    if (!currentStory || !session?.user) {
      console.error('ExternalApiDemo continueStory: Missing requirements', {
        hasCurrentStory: !!currentStory,
        hasSession: !!session?.user,
        currentStoryId: currentStory?.story_id
      });
      return;
    }

    console.log('ExternalApiDemo continueStory called:', {
      choice,
      choiceIndex,
      currentStoryId: currentStory.story_id,
      storyIdType: typeof currentStory.story_id
    });

    setIsContinuing(true);
    setError('');

    try {
      // Map choice index to A/B format
      const choiceLabel = choiceIndex === 0 ? "A" : "B";
      
      console.log('ExternalApiDemo about to call storyApiService.continueStory with:', {
        user_id: '',
        story_id: currentStory.story_id,
        choice: choiceLabel
      });
      
      const response = await storyApiService.continueStory({
        user_id: '', // Handled by API route using session
        story_id: currentStory.story_id,
        choice: choiceLabel, // Send "A" or "B" instead of full text
      });

      if (response.success && response.data) {
        // Add the new chapter to the current story
        const newChapter = {
          chapter_num: response.data.chapter_num,
          content: response.data.content,
          choices: response.data.choices
        };
        
        setCurrentStory({
          ...currentStory,
          chapters: [...currentStory.chapters, newChapter],
          current_chapter: response.data.chapter_num
        });
        setCurrentChapter(response.data.chapter_num - 1);
      } else {
        setError(response.error || 'Failed to continue story');
      }
    } catch (error) {
      console.error('ExternalApiDemo continueStory error:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsContinuing(false);
    }
  };

  const selectPrompt = (prompt: string) => {
    setCustomPrompt(prompt);
  };

  const resetStory = () => {
    setCurrentStory(null);
    setCurrentChapter(0);
    setCustomPrompt('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <StoryIdTracker 
        componentName="ExternalApiDemo" 
        storyId={currentStory?.story_id} 
      />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold neon-text animate-neon-pulse mb-4 font-orbitron">
            External API Story Generator
          </h1>
          <p className="text-cyan-300 cyber-text text-lg font-rajdhani">
            Experience AI-powered storytelling with external API integration
          </p>
        </motion.div>

        {!currentStory ? (
          /* Story Generation Interface */
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Genre Selection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-surface neon-border rounded-lg p-6"
            >
              <h2 className="text-xl font-semibold text-cyan-100 cyber-text mb-4 flex items-center">
                <BookOpen className="mr-2" size={20} />
                Select Genre
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {GENRES.map((genre) => (
                  <motion.button
                    key={genre.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedGenre(genre.id)}
                    className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                      selectedGenre === genre.id
                        ? 'border-cyan-400 bg-cyan-400/10'
                        : 'border-cyan-600/30 hover:border-cyan-400/50'
                    }`}
                  >
                    <div className={`w-full h-2 rounded mb-2 bg-gradient-to-r ${genre.color}`} />
                    <h3 className="text-cyan-100 font-semibold text-sm">{genre.name}</h3>
                    <p className="text-cyan-300/80 text-xs">{genre.description}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Prompt Input */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-surface neon-border rounded-lg p-6"
            >
              <h2 className="text-xl font-semibold text-cyan-100 cyber-text mb-4 flex items-center">
                <Zap className="mr-2" size={20} />
                Story Prompt
              </h2>
              
              {/* Sample Prompts */}
              <div className="mb-4">
                <p className="text-cyan-300 text-sm mb-2">Quick prompts:</p>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_PROMPTS.slice(0, 3).map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => selectPrompt(prompt)}
                      className="text-xs bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 
                               px-2 py-1 rounded border border-cyan-600/30 hover:border-cyan-400/50
                               transition-all duration-200"
                    >
                      {prompt.substring(0, 30)}...
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Enter your custom story prompt or select one above..."
                className="w-full h-32 bg-slate-800/50 border border-cyan-600/30 rounded-lg p-3
                         text-cyan-100 placeholder-cyan-400/50 focus:border-cyan-400 
                         focus:outline-none resize-none cyber-text"
              />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={generateStory}
                disabled={isGenerating || !session?.user}
                className="w-full mt-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600
                         text-white rounded-lg border-2 border-cyan-500
                         hover:shadow-[0_0_20px_rgba(0,255,255,0.4)]
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-300 cyber-text font-semibold
                         flex items-center justify-center"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Generating Story...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2" size={20} />
                    Generate Story
                  </>
                )}
              </motion.button>

              {!session?.user && (
                <p className="text-yellow-400 text-sm mt-2 text-center">
                  Please sign in to generate stories
                </p>
              )}
            </motion.div>
          </div>
        ) : (
          /* Story Display */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-surface neon-border rounded-lg p-6"
          >
            {/* Story Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-cyan-100 cyber-text">{currentStory.title}</h2>
                <p className="text-cyan-400 text-sm">
                  Genre: {currentStory.genre} | Chapter: {currentChapter + 1} of {currentStory.chapters.length}
                </p>
              </div>
              <button
                onClick={resetStory}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-cyan-300 
                         rounded-lg border border-cyan-600/30 hover:border-cyan-400/50
                         transition-all duration-200 cyber-text"
              >
                New Story
              </button>
            </div>

            {/* Current Chapter */}
            <div className="mb-6">
              <div className="bg-slate-800/50 rounded-lg p-4 border border-cyan-600/30">
                <p className="text-cyan-100 leading-relaxed cyber-text">
                  {currentStory.chapters[currentChapter]?.content}
                </p>
              </div>
            </div>

            {/* Choices */}
            {currentStory.chapters[currentChapter]?.choices && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-cyan-100 cyber-text">Choose your path:</h3>
                {currentStory.chapters[currentChapter].choices.map((choice, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => continueStory(choice, index)}
                    disabled={isContinuing}
                    className="w-full p-4 bg-slate-800/30 hover:bg-slate-700/50 
                             border border-cyan-600/30 hover:border-cyan-400/50
                             rounded-lg text-left text-cyan-100 cyber-text
                             transition-all duration-200 flex items-center justify-between
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center">
                      <span className="bg-cyan-600/30 text-cyan-300 px-2 py-1 rounded text-xs mr-3 font-mono">
                        {index === 0 ? 'A' : 'B'}
                      </span>
                      <span>{choice}</span>
                    </div>
                    <ArrowRight size={16} className="text-cyan-400" />
                  </motion.button>
                ))}
                
                {isContinuing && (
                  <div className="text-center py-4">
                    <Loader2 className="animate-spin mx-auto text-cyan-400" size={24} />
                    <p className="text-cyan-300 mt-2 cyber-text">Continuing story...</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6 p-4 bg-red-900/50 border border-red-500/50 rounded-lg"
            >
              <p className="text-red-300 cyber-text text-center">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}; 